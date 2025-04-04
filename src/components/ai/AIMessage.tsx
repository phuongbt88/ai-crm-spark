
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Message } from "./AIAssistant";
import { Bot, User, Loader2 } from "lucide-react";

interface AIMessageProps {
  message: Message;
}

export function AIMessage({ message }: AIMessageProps) {
  const isAssistant = message.role === "assistant";
  
  return (
    <div className={cn(
      "flex gap-3",
      isAssistant ? "justify-start" : "justify-end"
    )}>
      {isAssistant && (
        <Avatar className="h-8 w-8 bg-brand-500">
          <AvatarImage src="" />
          <AvatarFallback className="text-white">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn(
        "max-w-[80%] rounded-lg p-3",
        isAssistant 
          ? "bg-muted text-foreground" 
          : "bg-brand-500 text-white"
      )}>
        {message.isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">AI is thinking...</span>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm">{message.content}</p>
            <p className="text-xs opacity-70">
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        )}
      </div>

      {!isAssistant && (
        <Avatar className="h-8 w-8 bg-muted">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
