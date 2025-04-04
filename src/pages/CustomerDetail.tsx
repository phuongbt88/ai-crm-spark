
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, Mail, Phone, Building, Calendar, Clock, ArrowLeft,
  MessageSquare, BarChart, FileText, Send, Sparkles, Loader2
} from "lucide-react";
import { Customer } from "@/components/customers/CustomerCard";
import { AICustomerInsights } from "@/components/customers/AICustomerInsights";

// Mock customer data (would be fetched from API in a real app)
const customersData: Customer[] = [
  {
    id: "1",
    name: "Jane Cooper",
    email: "jane.cooper@example.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Inc.",
    status: "active",
    lastContact: "2 days ago",
    initials: "JC",
  },
  {
    id: "2",
    name: "Robert Fox",
    email: "robert.fox@example.com",
    phone: "+1 (555) 234-5678",
    company: "Global Tech",
    status: "lead",
    initials: "RF",
  },
  {
    id: "3",
    name: "Esther Howard",
    email: "esther.howard@example.com",
    phone: "+1 (555) 345-6789",
    company: "Innovate Solutions",
    status: "active",
    lastContact: "1 week ago",
    initials: "EH",
  },
];

interface CustomerNotes {
  id: string;
  date: string;
  content: string;
}

interface CustomerActivity {
  id: string;
  date: string;
  action: string;
  description: string;
}

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const customer = customersData.find(c => c.id === id) || customersData[0];
  
  const [notes, setNotes] = useState<CustomerNotes[]>([
    {
      id: "1",
      date: "2025-03-28",
      content: "Initial meeting about new project requirements."
    },
    {
      id: "2",
      date: "2025-04-02",
      content: "Follow-up call to discuss pricing and timeline."
    }
  ]);
  
  const [newNote, setNewNote] = useState("");
  const [activities, setActivities] = useState<CustomerActivity[]>([
    {
      id: "1",
      date: "2025-04-03",
      action: "Email",
      description: "Sent proposal for new project"
    },
    {
      id: "2",
      date: "2025-03-30",
      action: "Call",
      description: "Discussed contract terms"
    },
    {
      id: "3", 
      date: "2025-03-28",
      action: "Meeting",
      description: "Initial consultation"
    }
  ]);
  
  const getStatusColor = (status: Customer["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "lead":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const newNoteObj: CustomerNotes = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      content: newNote
    };
    
    setNotes([newNoteObj, ...notes]);
    setNewNote("");
  };

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
                <span>{customer.phone}</span>
              </div>
              <div className="grid grid-cols-[20px_1fr] items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <span>{customer.company}</span>
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
              <Button size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
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
                            <time className="text-sm text-muted-foreground">{activity.date}</time>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
                  <div className="space-y-6">
                    {notes.map((note) => (
                      <div key={note.id} className="flex flex-col gap-1 border-b pb-4 last:border-0">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">Date: {note.date}</p>
                        </div>
                        <p>{note.content}</p>
                      </div>
                    ))}
                  </div>
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
