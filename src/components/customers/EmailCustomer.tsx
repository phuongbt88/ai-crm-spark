
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmailCustomerProps {
  customerId: string;
  customerName: string;
  customerEmail: string;
}

export function EmailCustomer({ customerId, customerName, customerEmail }: EmailCustomerProps) {
  const { toast } = useToast();
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [replyTo, setReplyTo] = useState<string>("");

  const sendEmail = async () => {
    // Validation
    if (!subject.trim()) {
      toast({
        title: "Missing subject",
        description: "Please provide an email subject",
        variant: "destructive"
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Missing message",
        description: "Please provide an email message",
        variant: "destructive"
      });
      return;
    }

    try {
      setSending(true);
      
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: {
          to: customerEmail,
          subject,
          message,
          customerName,
          replyTo: replyTo || undefined
        }
      });

      if (error) {
        console.error("Error sending email:", error);
        throw error;
      }

      // Log email activity
      await supabase.from("customer_activities")
        .insert({
          customer_id: customerId,
          action: "Email",
          description: `Sent email: ${subject}`
        });

      toast({
        title: "Email sent",
        description: "Your email was sent successfully"
      });
      
      // Reset form and close
      setSubject("");
      setMessage("");
      setOpen(false);
    } catch (error) {
      console.error("Error in sendEmail:", error);
      toast({
        title: "Failed to send email",
        description: "There was an error sending your email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Email {customerName}</DialogTitle>
          <DialogDescription>
            Compose an email to send to {customerEmail}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="to" className="text-right">
              To
            </Label>
            <Input id="to" value={customerEmail} disabled className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reply-to" className="text-right">
              Reply-To
            </Label>
            <Input 
              id="reply-to" 
              placeholder="Your email (optional)" 
              value={replyTo}
              onChange={(e) => setReplyTo(e.target.value)}
              className="col-span-3" 
              type="email"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Input 
              id="subject" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="message" className="text-right mt-2">
              Message
            </Label>
            <Textarea 
              id="message" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="col-span-3" 
              rows={8}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={sendEmail} disabled={sending}>
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
