import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CategorizationResult {
  category: string;
  subcategory: string;
  confidence: number;
}

export const useCategorization = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categorizeExpense = async (title: string, amount: number): Promise<CategorizationResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('categorize-expense', {
        body: { title, amount }
      });

      if (functionError) {
        console.error("Function error:", functionError);
        setError(functionError.message);
        return null;
      }

      return data as CategorizationResult;
    } catch (err) {
      console.error("Categorization error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { categorizeExpense, isLoading, error };
};
