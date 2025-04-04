
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { AIMessage } from "./AIMessage";
import { AIWelcomeMessage } from "./AIWelcomeMessage";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    const tempBotMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, tempBotMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responses = [
        "I can help you analyze your customer data and identify patterns to improve your sales strategy.",
        "Based on your customer interactions, I recommend focusing on the tech industry segment, which has shown a 15% higher conversion rate.",
        "I've analyzed your calendar and found that you have 3 overlapping meetings tomorrow. Would you like me to suggest a rescheduling plan?",
        "Your customer satisfaction score has increased by 12% this month. The main factors appear to be faster response times and personalized follow-ups.",
        "I've noticed that leads from the recent marketing campaign have a 30% higher probability of converting. Would you like me to schedule follow-up calls for the top 10 prospects?"
      ];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => 
        prev.map((msg) => 
          msg.isLoading ? assistantMessage : msg
        )
      );
      
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-500" /> AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hidden">
          <AIWelcomeMessage />
          
          {messages.map((message) => (
            <AIMessage
              key={message.id}
              message={message}
            />
          ))}
        </div>
        
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask a question or give a command..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="resize-none min-h-[60px]"
              disabled={isLoading}
            />
            <Button 
              size="icon" 
              onClick={handleSendMessage} 
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
