
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUp, 
  ArrowDown, 
  X, 
  Trash2, 
  Reply, 
  AlertCircle,
  Loader2 
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EmailDetailProps {
  email: {
    id: string;
    subject: string;
    message: string;
    direction: 'sent' | 'received';
    status: string;
    reply_to: string | null;
    created_at: string;
    customer_id: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onEmailAction?: () => void;
}

export function EmailDetail({ email, isOpen, onClose, onEmailAction }: EmailDetailProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  if (!email) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('email_history')
        .delete()
        .eq('id', email.id);

      if (error) throw error;

      toast({
        title: "Email deleted",
        description: "The email has been removed from your history",
      });
      
      if (onEmailAction) onEmailAction();
      onClose();
    } catch (error) {
      console.error('Error deleting email:', error);
      toast({
        title: "Delete failed",
        description: "Could not delete the email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message to send",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      // Determine reply subject
      const subject = replySubject.trim() || `Re: ${email.subject}`;

      // Call send-email function
      const response = await fetch('https://qrwxwxirouscsuznvtdr.supabase.co/functions/v1/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email.direction === 'received' ? email.reply_to : email.reply_to,
          subject,
          message: replyMessage,
          customer_id: email.customer_id,
          reply_to: email.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }

      toast({
        title: "Reply sent",
        description: "Your email has been sent successfully",
      });

      setIsReplying(false);
      setReplyMessage("");
      setReplySubject("");
      
      if (onEmailAction) onEmailAction();
      onClose();
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Reply failed",
        description: error instanceof Error ? error.message : "Could not send your reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <div className="rounded-full p-2 bg-muted">
                {email.direction === 'sent' ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </div>
              {email.subject}
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
          <div className="flex items-center justify-between mt-2">
            <Badge className={getStatusColor(email.status)}>
              {email.direction === 'received' ? 'Received' : email.status}
            </Badge>
            <DialogDescription>
              {formatDistanceToNow(new Date(email.created_at), { addSuffix: true })}
            </DialogDescription>
          </div>
        </DialogHeader>

        {!isReplying ? (
          <>
            <div className="border-t pt-4 mt-2">
              <div className="whitespace-pre-wrap">{email.message.replace(/<[^>]*>/g, '')}</div>
              
              {email.reply_to && (
                <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                  {email.direction === 'sent' ? (
                    <><strong>Reply to:</strong> {email.reply_to}</>
                  ) : (
                    <><strong>From:</strong> {email.reply_to}</>
                  )}
                </div>
              )}
            </div>

            <DialogFooter className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsReplying(true)}
                className="sm:mr-auto"
              >
                <Reply className="h-4 w-4 mr-2" />
                Reply
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="subject" className="text-sm font-medium mb-1 block">
                  Subject
                </label>
                <input
                  id="subject"
                  className="w-full p-2 border rounded-md"
                  placeholder={`Re: ${email.subject}`}
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="reply" className="text-sm font-medium mb-1 block">
                  Your reply
                </label>
                <Textarea
                  id="reply"
                  placeholder="Write your reply here..."
                  rows={6}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsReplying(false)}
                className="sm:mr-auto"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleReply}
                disabled={isSending}
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Reply className="h-4 w-4 mr-2" />
                )}
                Send Reply
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
