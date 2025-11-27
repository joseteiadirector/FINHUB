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
          <div className="p-3 rounded-2xl bg-foreground">
            <Sparkles className="text-background" size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-foreground">INSIGHTS POR IA</h3>
            <p className="text-sm font-bold text-foreground/70">Análise inteligente em linguagem natural</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-foreground text-background font-black text-xs px-3 py-1">
          LOVABLE AI
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
              className="p-4 bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in border-4 border-foreground"
            >
              <p className="text-base font-bold text-foreground leading-relaxed">
                {insight}
              </p>
            </Card>
          ))}
        </div>
      )}

      <Button
        onClick={handleGenerateInsights}
        disabled={isLoading}
        className="w-full bg-foreground hover:bg-foreground/90 text-background font-black text-base h-12 rounded-xl border-2 border-foreground shadow-lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            GERANDO INSIGHTS...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-5 w-5" />
            {displayedInsights.length > 0 ? "ATUALIZAR INSIGHTS" : "GERAR INSIGHTS COM IA"}
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
