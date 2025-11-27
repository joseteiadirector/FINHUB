import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { useAIInsights } from "@/hooks/useAIInsights";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface Transaction {
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

interface AIPersonalizedInsightsProps {
  transactions: Transaction[];
  currentBalance: number;
}

export const AIPersonalizedInsights = ({ transactions, currentBalance }: AIPersonalizedInsightsProps) => {
  const { generateInsights, insights, isLoading, error } = useAIInsights();
  const { toast } = useToast();
  const [displayedInsights, setDisplayedInsights] = useState<string[]>([]);

  useEffect(() => {
    if (insights) {
      // Dividir insights em parágrafos
      const insightList = insights
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+\.\s*/, '').trim());
      setDisplayedInsights(insightList);
    }
  }, [insights]);

  const handleGenerateInsights = async () => {
    if (transactions.length === 0) {
      toast({
        title: "Sem dados suficientes",
        description: "Adicione algumas transações para gerar insights personalizados.",
        variant: "destructive",
      });
      return;
    }

    const result = await generateInsights(transactions, currentBalance);
    
    if (error) {
      toast({
        title: "Erro ao gerar insights",
        description: error,
        variant: "destructive",
      });
    } else if (result) {
      toast({
        title: "Insights atualizados!",
        description: "Análise personalizada gerada com sucesso.",
      });
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-2 border-purple-200 dark:border-purple-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <Sparkles className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-foreground uppercase tracking-tight">Insights por IA</h3>
            <p className="text-xs font-condensed text-muted-foreground">Análise inteligente em linguagem natural</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-condensed font-bold uppercase text-xs">
          Lovable AI
        </Badge>
      </div>

      {displayedInsights.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Clique no botão abaixo para gerar insights personalizados sobre suas finanças
          </p>
        </div>
      )}

      {displayedInsights.length > 0 && (
        <div className="space-y-3 mb-4">
          {displayedInsights.map((insight, index) => (
            <Card 
              key={index} 
              className="p-4 bg-card hover:shadow-md transition-all duration-300 border-l-4 border-l-purple-500"
            >
              <p className="text-sm text-foreground leading-relaxed">
                {insight}
              </p>
            </Card>
          ))}
        </div>
      )}

      <Button
        onClick={handleGenerateInsights}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gerando insights...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            {displayedInsights.length > 0 ? "Atualizar Insights" : "Gerar Insights com IA"}
          </>
        )}
      </Button>

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-2 text-center">
          {error}
        </p>
      )}
    </Card>
  );
};
