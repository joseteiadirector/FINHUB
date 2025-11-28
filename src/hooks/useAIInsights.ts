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
  const [insights, setInsights] = useState<any>(null);

  const generateInsights = async (transactions: Transaction[], currentBalance: number) => {
    // Evita chamadas simultâneas que podem travar a interface
    if (isLoading) return null;

    setIsLoading(true);
    setError(null);

    // Timeout de segurança para o link público
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      setError("Tempo limite excedido ao gerar insights. Tente novamente em instantes.");
    }, 30000);

    try {
      const { data, error: functionError } = await supabase.functions.invoke("generate-insights", {
        body: { transactions, currentBalance },
      });

      clearTimeout(timeoutId);

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
      clearTimeout(timeoutId);
      console.error("AI Insights error:", err);
      setError(err instanceof Error ? err.message : "Erro ao gerar insights");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateInsights, insights, isLoading, error };
};
