
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Database } from "@/integrations/supabase/types";

interface EmailHistoryProps {
  customerId: string;
}

type EmailRecord = Database['public']['Tables']['email_history']['Row'];

export function EmailHistory({ customerId }: EmailHistoryProps) {
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('email_history')
          .select('*')
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setEmails(data || []);
      } catch (error) {
        console.error('Error fetching email history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [customerId]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Email History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : emails.length > 0 ? (
          <div className="space-y-4">
            {emails.map((email) => (
              <div key={email.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full p-2 bg-muted">
                      {email.direction === 'sent' ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                    </div>
                    <span className="font-medium">{email.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(email.status)}>
                      {email.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(email.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  {email.message.length > 150 ? 
                    `${email.message.substring(0, 150)}...` : 
                    email.message}
                </div>
                {email.reply_to && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Reply to: {email.reply_to}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-muted-foreground">No email history found</p>
        )}
      </CardContent>
    </Card>
  );
}
