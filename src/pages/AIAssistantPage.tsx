
import { AIAssistant } from "@/components/ai/AIAssistant";

export default function AIAssistantPage() {
  return (
    <div className="container p-4 sm:p-6 h-[calc(100vh-80px)]">
      <h1 className="text-3xl font-semibold mb-6">AI Assistant</h1>
      <div className="h-[calc(100%-80px)]">
        <AIAssistant />
      </div>
    </div>
  );
}
