import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, RefreshCw, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

interface PersonalizedRecommendationsProps {
  transactions: Transaction[];
  onActionClick?: (action: string) => void;
}

interface Recommendation {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  action?: string;
}

export const PersonalizedRecommendations = ({ transactions, onActionClick }: PersonalizedRecommendationsProps) => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);

  const generateRecommendations = async () => {
    if (transactions.length === 0) {
      toast({
        title: "Sem dados suficientes",
        description: "Adicione transações para gerar recomendações.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-recommendations', {
        body: { 
          transactions, 
          currentBalance: totalIncome - totalExpenses 
        }
      });

      if (error) throw error;
      
      if (data?.recommendations) {
        setRecommendations(data.recommendations);
        toast({
          title: "Recomendações atualizadas!",
          description: "Análise personalizada gerada com IA.",
        });
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast({
        title: "Erro ao gerar recomendações",
        description: error instanceof Error ? error.message : "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const impactColors = {
    high: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
    low: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400"
  };

  const impactLabels = {
    high: "Alto impacto",
    medium: "Médio impacto",
    low: "Baixo impacto"
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-3 rounded-2xl bg-foreground">
            <Sparkles className="text-background" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-foreground">RECOMENDAÇÕES IA</h2>
            <p className="text-sm font-bold text-foreground/70">Dicas personalizadas para você</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-foreground text-background font-black px-3 py-1">
          LOVABLE AI
        </Badge>
      </div>

      {recommendations.length === 0 && !isLoading && (
        <Card className="p-6 text-center border-4 border-foreground">
          <p className="text-foreground/70 mb-4 font-bold">
            Clique no botão para gerar recomendações personalizadas com IA
          </p>
        </Card>
      )}
      
      {recommendations.length > 0 && (
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <Card key={index} className="p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-4 border-foreground">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-black text-base text-foreground mb-1">{rec.title}</h3>
                    <p className="text-sm font-bold text-foreground/70">{rec.description}</p>
                  </div>
                  <Badge variant="outline" className={`${impactColors[rec.impact]} font-black text-xs`}>
                    {impactLabels[rec.impact]}
                  </Badge>
                </div>
                
                {rec.action && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-between font-bold hover:bg-foreground/10"
                    onClick={() => onActionClick?.(rec.action!)}
                  >
                    {rec.action}
                    <ArrowRight size={16} />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Button
        onClick={generateRecommendations}
        disabled={isLoading}
        className="w-full bg-foreground hover:bg-foreground/90 text-background font-black h-12 rounded-xl border-2 border-foreground shadow-lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            GERANDO...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-5 w-5" />
            {recommendations.length > 0 ? "ATUALIZAR DICAS" : "GERAR DICAS COM IA"}
          </>
        )}
      </Button>
    </div>
  );
};
