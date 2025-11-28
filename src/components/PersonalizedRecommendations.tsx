import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles, ArrowRight, RefreshCw, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);

  const handleActionClick = (action: string, rec: Recommendation) => {
    // Calcular dados reais baseados nas transações
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    // Extrair percentuais e valores da recomendação
    const percentMatch = rec.description.match(/(\d+)%/);
    const valueMatch = rec.description.match(/R\$\s*(\d+(?:[.,]\d+)?)/);
    
    const reductionPercent = percentMatch ? parseInt(percentMatch[1]) : 20;
    
    // Identificar categoria mencionada
    const categories = ['Alimentação', 'Transporte', 'Saúde', 'Lazer', 'Educação', 'Moradia'];
    const mentionedCategory = categories.find(cat => 
      rec.title.toLowerCase().includes(cat.toLowerCase()) || 
      rec.description.toLowerCase().includes(cat.toLowerCase())
    ) || 'Despesas Gerais';
    
    const categoryExpenses = expenses
      .filter(t => t.category === mentionedCategory)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const currentAmount = categoryExpenses > 0 ? categoryExpenses : totalExpenses * 0.3;
    const projectedAmount = currentAmount * (1 - reductionPercent / 100);
    const actualSavings = currentAmount - projectedAmount;
    
    setSelectedRecommendation({
      title: rec.title,
      description: rec.description,
      action: rec.action,
      category: mentionedCategory,
      reductionPercent,
      currentAmount,
      projectedAmount,
      savings: actualSavings,
      comparisonData: [
        { period: 'Antes', amount: currentAmount },
        { period: 'Depois', amount: projectedAmount },
      ]
    });
    setShowModal(true);
  };

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
        <Card className="p-4 text-center border-2 border-foreground">
          <p className="text-foreground/70 text-sm font-bold">
            Gere dicas personalizadas
          </p>
        </Card>
      )}
      
      {recommendations.length > 0 && (
        <div className="space-y-2">
          {recommendations.slice(0, 2).map((rec, index) => (
            <Card key={index} className="p-3 hover:shadow-lg transition-all border-2 border-foreground cursor-pointer" onClick={() => handleActionClick(rec.action || 'Ver detalhes', rec)}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-black text-sm text-foreground">{rec.title}</h3>
                  <p className="text-xs font-bold text-foreground/70 mt-1">{rec.description}</p>
                </div>
                <ArrowRight className="text-foreground flex-shrink-0 animate-pulse" size={16} />
              </div>
            </Card>
          ))}
        </div>
      )}

      <Button
        onClick={generateRecommendations}
        disabled={isLoading}
        className="w-full bg-foreground hover:bg-foreground/90 text-background font-black h-11 border-2 border-foreground"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            GERANDO...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            {recommendations.length > 0 ? "ATUALIZAR" : "GERAR DICAS"}
          </>
        )}
      </Button>

      {/* Modal de Análise Detalhada */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl bg-card border-4 border-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-foreground">
              📊 ANÁLISE DETALHADA
            </DialogTitle>
          </DialogHeader>
          
          {selectedRecommendation && (
            <div className="space-y-6">
              {/* Título */}
              <div>
                <Card className="p-4 bg-foreground text-background border-2 mb-2">
                  <h4 className="font-black text-lg">{selectedRecommendation.title}</h4>
                </Card>
                <p className="text-sm font-bold text-foreground/70">{selectedRecommendation.description}</p>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 border-4 border-red-500 bg-red-50">
                  <p className="text-xs font-bold text-red-800">GASTO ATUAL</p>
                  <p className="text-2xl font-black text-red-600">
                    R$ {selectedRecommendation.currentAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-red-700 mt-1">em {selectedRecommendation.category}</p>
                </Card>
                <Card className="p-4 border-4 border-green-500 bg-green-50">
                  <p className="text-xs font-bold text-green-800">META PROJETADA</p>
                  <p className="text-2xl font-black text-green-600">
                    R$ {selectedRecommendation.projectedAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-green-700 mt-1">reduzindo {selectedRecommendation.reductionPercent}%</p>
                </Card>
                <Card className="p-4 border-4 border-blue-500 bg-blue-50">
                  <p className="text-xs font-bold text-blue-800">ECONOMIA MENSAL</p>
                  <p className="text-2xl font-black text-blue-600">
                    R$ {selectedRecommendation.savings.toFixed(2)}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">por mês</p>
                </Card>
              </div>

              {/* Gráfico */}
              <Card className="p-6 border-4 border-foreground">
                <h5 className="text-lg font-black mb-4 text-foreground">
                  COMPARAÇÃO: ANTES vs DEPOIS
                </h5>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={selectedRecommendation.comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#000" opacity={0.1} />
                    <XAxis 
                      dataKey="period" 
                      tick={{ fill: 'currentColor', fontWeight: 'bold' }}
                    />
                    <YAxis 
                      tick={{ fill: 'currentColor', fontWeight: 'bold' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '3px solid hsl(var(--foreground))',
                        borderRadius: '8px',
                        fontWeight: 'bold'
                      }}
                      formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                    />
                    <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                      {selectedRecommendation.comparisonData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#22c55e'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Impacto */}
              <Card className="p-4 bg-yellow-50 border-4 border-yellow-500">
                <p className="text-sm font-bold text-yellow-900">
                  💰 <strong>IMPACTO ANUAL:</strong> Seguindo esta recomendação durante 12 meses, você economizaria{' '}
                  <span className="text-yellow-600 font-black text-lg">
                    R$ {(selectedRecommendation.savings * 12).toFixed(2)}
                  </span>
                  !
                </p>
              </Card>

              {/* Ação Sugerida */}
              {selectedRecommendation.action && (
                <Card className="p-4 bg-foreground text-background border-2">
                  <p className="text-xs font-bold mb-2">PRÓXIMA AÇÃO SUGERIDA:</p>
                  <p className="text-lg font-black">{selectedRecommendation.action}</p>
                </Card>
              )}

              <Button
                onClick={() => setShowModal(false)}
                className="w-full bg-foreground hover:bg-foreground/90 text-background font-black"
              >
                FECHAR ANÁLISE
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
