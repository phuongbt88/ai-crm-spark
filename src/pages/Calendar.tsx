
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Sample events data
  const events = [
    {
      id: "1",
      title: "Meeting with Tech Solutions",
      date: new Date(2025, 3, 5, 10, 30),
      duration: "1 hour",
      type: "meeting"
    },
    {
      id: "2",
      title: "Follow-up call with Jane Cooper",
      date: new Date(2025, 3, 5, 14, 0),
      duration: "30 minutes",
      type: "call"
    },
    {
      id: "3",
      title: "Product demo for Global Enterprises",
      date: new Date(2025, 3, 6, 11, 0),
      duration: "1 hour",
      type: "demo"
    },
    {
      id: "4",
      title: "Proposal review with team",
      date: new Date(2025, 3, 7, 9, 0),
      duration: "45 minutes",
      type: "internal"
    }
  ];
  
  // Filter events for the selected date
  const selectedDateEvents = events.filter(event => 
    date && 
    event.date.getDate() === date.getDate() &&
    event.date.getMonth() === date.getMonth() &&
    event.date.getFullYear() === date.getFullYear()
  );
  
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container p-4 sm:p-6">
      <h1 className="text-3xl font-semibold mb-6">Calendar</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="border rounded-md p-3"
            />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {date ? date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'No date selected'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map(event => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatTime(event.date)} • {event.duration}
                        </p>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                        event.type === 'call' ? 'bg-green-100 text-green-800' :
                        event.type === 'demo' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No events scheduled for this day</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
