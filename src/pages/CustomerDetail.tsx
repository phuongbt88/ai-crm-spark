import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, Mail, Phone, Building, Calendar, Clock, ArrowLeft,
  MessageSquare, BarChart, FileText, Send, Sparkles, Loader2,
  Inbox
} from "lucide-react";
import { Customer } from "@/components/customers/CustomerCard";
import { AICustomerInsights } from "@/components/customers/AICustomerInsights";
import { EmailCustomer } from "@/components/customers/EmailCustomer";
import { EmailHistory } from "@/components/customers/EmailHistory";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type CustomerNote = Database['public']['Tables']['customer_notes']['Row'];
type CustomerActivity = Database['public']['Tables']['customer_activities']['Row'];

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [notes, setNotes] = useState<CustomerNote[]>([]);
  const [activities, setActivities] = useState<CustomerActivity[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!id) return;
    fetchCustomerData();
  }, [id]);
  
  const fetchCustomerData = async () => {
    setIsLoading(true);
    try {
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (customerError) throw customerError;
      
      if (customerData) {
        const formattedCustomer: Customer = {
          id: customerData.id,
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone || "",
          company: customerData.company || "",
          status: (customerData.status as "active" | "inactive" | "lead") || "lead",
          lastContact: customerData.last_contact ? new Date(customerData.last_contact).toLocaleDateString() : undefined,
          initials: customerData.initials || customerData.name.substring(0, 2).toUpperCase(),
          avatar: customerData.avatar_url,
        };
        
        setCustomer(formattedCustomer);
      }
      
      const { data: notesData, error: notesError } = await supabase
        .from('customer_notes')
        .select('*')
        .eq('customer_id', id)
        .order('created_at', { ascending: false });
      
      if (notesError) throw notesError;
      
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('customer_activities')
        .select('*')
        .eq('customer_id', id)
        .order('created_at', { ascending: false });
        
      if (activitiesError) throw activitiesError;
      
      setNotes(notesData as CustomerNote[]);
      setActivities(activitiesData as CustomerActivity[]);
      
    } catch (error) {
      console.error('Error fetching customer data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load customer data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status?: Customer["status"]) => {
    if (!status) return "";
    
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "lead":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !id) return;
    
    try {
      const { data, error } = await supabase
        .from('customer_notes')
        .insert({
          customer_id: id,
          content: newNote
        } as Database['public']['Tables']['customer_notes']['Insert'])
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        const newNoteObj = data[0] as CustomerNote;
        setNotes([newNoteObj, ...notes]);
        setNewNote("");
        
        toast({
          title: 'Note saved',
          description: 'Your note has been saved successfully',
        });
      }
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: 'Error',
        description: 'Failed to save note',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container p-4 sm:p-6 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/customers">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Customers
            </Link>
          </Button>
        </div>
        <div className="text-center p-10">
          <h3 className="text-2xl font-medium">Customer not found</h3>
          <p className="text-muted-foreground mt-2">
            The customer you're looking for does not exist or has been deleted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/customers">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Customers
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={customer.avatar} />
                  <AvatarFallback className="text-lg">{customer.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{customer.name}</CardTitle>
                  <Badge className={`mt-2 ${getStatusColor(customer.status)}`}>{customer.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-[20px_1fr] items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>{customer.email}</span>
              </div>
              <div className="grid grid-cols-[20px_1fr] items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>{customer.phone || "Not provided"}</span>
              </div>
              <div className="grid grid-cols-[20px_1fr] items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <span>{customer.company || "Not provided"}</span>
              </div>
              {customer.lastContact && (
                <div className="grid grid-cols-[20px_1fr] items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>Last contact: {customer.lastContact}</span>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <EmailCustomer 
                customerId={customer.id} 
                customerName={customer.name} 
                customerEmail={customer.email} 
              />
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-500" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AICustomerInsights customerId={customer.id} customerName={customer.name} />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="activity">
            <TabsList className="mb-4">
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Activity</span>
              </TabsTrigger>
              <TabsTrigger value="emails" className="flex items-center gap-2">
                <Inbox className="h-4 w-4" />
                <span>Emails</span>
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Notes</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : activities.length > 0 ? (
                    <div className="space-y-6">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4">
                          <div className="rounded-full bg-muted p-2 h-10 w-10 flex items-center justify-center">
                            {activity.action === "Email" && <Mail className="h-5 w-5" />}
                            {activity.action === "Call" && <Phone className="h-5 w-5" />}
                            {activity.action === "Meeting" && <Calendar className="h-5 w-5" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="font-medium">{activity.action}</p>
                              <time className="text-sm text-muted-foreground">
                                {new Date(activity.created_at).toLocaleDateString()}
                              </time>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">No activity records found</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="emails" className="space-y-4">
              <EmailHistory customerId={customer.id} />
            </TabsContent>
            
            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add Note</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <Textarea 
                      placeholder="Enter your notes here..." 
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={handleAddNote} className="self-end">
                      Save Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notes History</CardTitle>
                </CardHeader>
                <CardContent>
                  {notes.length > 0 ? (
                    <div className="space-y-6">
                      {notes.map((note) => (
                        <div key={note.id} className="flex flex-col gap-1 border-b pb-4 last:border-0">
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">
                              Date: {new Date(note.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <p>{note.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">No notes found</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border rounded-md bg-muted/20">
                    <p className="text-muted-foreground">Analytics visualizations will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
