
import { useState, useEffect } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AICustomerInsightsProps {
  customerId: string;
  customerName: string;
}

interface Insight {
  id: string;
  text: string;
}

export function AICustomerInsights({ customerId, customerName }: AICustomerInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const generateInsights = async () => {
    setIsLoading(true);
    
    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Predefined insights based on customer
    const customerInsights: Record<string, Insight[]> = {
      "1": [
        { id: "1", text: "Customer spending has increased by 18% over the past quarter." },
        { id: "2", text: "Recent engagement suggests interest in expanding their contract." },
        { id: "3", text: "Communication frequency is higher than average, indicating strong relationship." },
      ],
      "2": [
        { id: "1", text: "First contact was through a referral from an existing customer." },
        { id: "2", text: "Has shown interest in premium features but concerned about pricing." },
        { id: "3", text: "Based on profile similarities, this lead has a 62% conversion probability." },
      ],
      "3": [
        { id: "1", text: "Customer has been with us for over 2 years with consistent engagement." },
        { id: "2", text: "Support ticket frequency has decreased by 30% since last upgrade." },
        { id: "3", text: "Renewal date is approaching in 45 days - historical pattern shows high renewal likelihood." },
      ],
      "default": [
        { id: "1", text: `${customerName} shows potential for increased engagement based on recent activity.` },
        { id: "2", text: "Our AI model suggests offering a personalized demo of new features." },
        { id: "3", text: "Communication patterns suggest a preference for email over calls." },
      ]
    };
    
    const newInsights = customerInsights[customerId] || customerInsights.default;
    setInsights(newInsights);
    setIsLoading(false);
  };
  
  useEffect(() => {
    // Reset insights when customer changes
    setInsights([]);
  }, [customerId]);

  return (
    <div className="space-y-4">
      {insights.length > 0 ? (
        <div className="space-y-3">
          {insights.map((insight) => (
            <div 
              key={insight.id} 
              className="p-3 bg-muted/50 rounded-md text-sm border-l-2 border-brand-500"
            >
              {insight.text}
            </div>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            onClick={generateInsights}
            disabled={isLoading}
          >
            <Sparkles className="h-4 w-4 mr-2 text-brand-500" />
            Refresh Insights
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-sm text-muted-foreground text-center">
            Generate AI-powered insights about this customer
          </p>
          <Button 
            onClick={generateInsights}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Insights
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
