
import { Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AIWelcomeMessage() {
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 bg-brand-500">
        <AvatarFallback className="text-white">
          <Bot className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>

      <div className="max-w-[80%] rounded-lg bg-muted p-3">
        <div className="space-y-3">
          <p className="text-sm font-medium">Hello, I'm your AI CRM assistant. How can I help you today?</p>
          <div className="text-sm space-y-2">
            <p>I can help you with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Customer insights and analysis</li>
              <li>Finding and organizing customer information</li>
              <li>Scheduling and managing appointments</li>
              <li>Identifying sales opportunities</li>
              <li>Creating reports and summaries</li>
            </ul>
          </div>
          <p className="text-sm">Just type your question or request, and I'll assist you right away!</p>
        </div>
      </div>
    </div>
  );
}
