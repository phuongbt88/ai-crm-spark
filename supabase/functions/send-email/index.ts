
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'npm:@supabase/supabase-js';

// Initialize Resend with API key from env variable
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(resendApiKey);

// Create a Supabase client specially for this function
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabaseFunctionClient = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  message: string;
  customerName: string;
  customerId: string;
  replyTo?: string;
}

interface IncomingEmailRequest {
  from: string;
  to: string;
  subject: string;
  message: string;
  customerId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    
    // Handle incoming customer emails (replies)
    if (requestData.type === "inbound") {
      const { from, to, subject, message, customerId }: IncomingEmailRequest = requestData;
      
      console.log(`Received incoming email from ${from}`);
      
      // Record the incoming email in the database
      const { error: dbError } = await supabaseFunctionClient
        .from("email_history")
        .insert({
          customer_id: customerId,
          subject,
          message,
          direction: 'received',
          reply_to: from,
          status: 'delivered'
        });
        
      if (dbError) {
        console.error("Error recording incoming email in database:", dbError);
        throw dbError;
      }
      
      return new Response(
        JSON.stringify({ success: true, message: "Incoming email recorded" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Handle outgoing emails (default case)
    const { to, subject, message, customerName, customerId, replyTo }: EmailRequest = requestData;

    if (!to || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Sending email to ${to} with subject: ${subject}`);
    console.log(`Using RESEND_API_KEY: ${resendApiKey ? "Key is present" : "Key is missing!"}`);
    
    const emailOptions = {
      from: "CRM <customer@mail.coka.ai>", // You can change this after domain verification
      to: [to],
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4f46e5;">Hello ${customerName}</h2>
          <div style="margin: 20px 0; line-height: 1.5;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px;">
            This email was sent from the AI CRM Spark platform.
            <p>You can reply directly to this email with your feedback.</p>
          </div>
        </div>
      `,
    };
    
    if (replyTo) {
      emailOptions.reply_to = replyTo;
    }

    const emailResponse = await resend.emails.send(emailOptions);
    console.log("Email sent successfully:", emailResponse);
    
    // Record the email in the database
    const { error: dbError } = await supabaseFunctionClient
      .from("email_history")
      .insert({
        customer_id: customerId,
        subject,
        message,
        direction: 'sent',
        reply_to: replyTo || null,
        status: emailResponse.error ? 'failed' : 'sent'
      });
      
    if (dbError) {
      console.error("Error recording email in database:", dbError);
    }

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
