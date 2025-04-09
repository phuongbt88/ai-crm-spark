
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, X } from "lucide-react";

interface EmailDetailProps {
  email: {
    id: string;
    subject: string;
    message: string;
    direction: 'sent' | 'received';
    status: string;
    reply_to: string | null;
    created_at: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EmailDetail({ email, isOpen, onClose }: EmailDetailProps) {
  if (!email) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
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
      </DialogContent>
    </Dialog>
  );
}
