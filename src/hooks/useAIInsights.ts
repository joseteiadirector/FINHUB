import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Transaction {
  amount: number;
  type: "income" | "expense";
  category: string;
}

export const useAIInsights = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<string>("");

  const generateInsights = async (transactions: Transaction[], currentBalance: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('generate-insights', {
        body: { transactions, currentBalance }
      });

      if (functionError) {
        console.error("Function error:", functionError);
        setError(functionError.message);
        return null;
      }

      if (data?.insights) {
        setInsights(data.insights);
        return data.insights;
      }

      return null;
    } catch (err) {
      console.error("AI Insights error:", err);
      setError(err instanceof Error ? err.message : "Erro ao gerar insights");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateInsights, insights, isLoading, error };
};
