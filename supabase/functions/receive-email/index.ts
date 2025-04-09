
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js';

// Create a Supabase client specially for this function
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabaseFunctionClient = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface IncomingEmail {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments?: any[];
  headers: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: { email: IncomingEmail } = await req.json();
    console.log("Received email webhook:", email.subject);

    // Find the customer by email address
    const { data: customerData, error: customerError } = await supabaseFunctionClient
      .from("customers")
      .select("id")
      .eq("email", email.from)
      .single();

    if (customerError || !customerData) {
      console.error("Customer not found for email:", email.from);
      // Still record the email but without customer association
      await supabaseFunctionClient
        .from("email_history")
        .insert({
          subject: email.subject,
          message: email.text || email.html,
          direction: 'received',
          reply_to: email.from,
          status: 'delivered'
        });

      return new Response(
        JSON.stringify({ status: "processed", customer: "unknown" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Record the incoming email in the database
    const { error: dbError } = await supabaseFunctionClient
      .from("email_history")
      .insert({
        customer_id: customerData.id,
        subject: email.subject,
        message: email.text || email.html,
        direction: 'received',
        reply_to: email.from,
        status: 'delivered'
      });
      
    if (dbError) {
      console.error("Error recording incoming email in database:", dbError);
      throw dbError;
    }
    
    // Also record an activity
    await supabaseFunctionClient
      .from("customer_activities")
      .insert({
        customer_id: customerData.id,
        action: "Email",
        description: `Received email: ${email.subject}`
      });

    return new Response(
      JSON.stringify({ success: true, message: "Incoming email recorded" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in receive-email function:", error);
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
