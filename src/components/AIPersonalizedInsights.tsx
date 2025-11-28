import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles, RefreshCw, Loader2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { useAIInsights } from "@/hooks/useAIInsights";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

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
  const [parsedInsights, setParsedInsights] = useState<any>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);

  useEffect(() => {
    if (insights) {
      try {
        const parsed = typeof insights === 'string' ? JSON.parse(insights) : insights;
        setParsedInsights(parsed);
      } catch (e) {
        console.error("Failed to parse insights:", e);
        setParsedInsights(null);
      }
    }
  }, [insights]);

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'excellent': return '😊';
      case 'good': return '🙂';
      case 'warning': return '😐';
      case 'danger': return '😟';
      default: return '🙂';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400';
      case 'good': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400';
      case 'warning': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400';
      case 'danger': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getBarColor = (status: string) => {
    switch (status) {
      case 'safe': return '#22c55e'; // green
      case 'attention': return '#f59e0b'; // orange
      case 'danger': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="text-green-600" size={32} />;
      case 'good': return <TrendingUp className="text-blue-600" size={32} />;
      case 'warning': return <AlertTriangle className="text-orange-600" size={32} />;
      case 'danger': return <TrendingDown className="text-red-600" size={32} />;
      default: return <CheckCircle className="text-gray-600" size={32} />;
    }
  };

  const handleRecommendationClick = (recommendation: string, index: number) => {
    // Calcular dados reais baseados nas transações
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    // Extrair percentuais e valores da recomendação
    const percentMatch = recommendation.match(/(\d+)%/);
    const valueMatch = recommendation.match(/R\$\s*(\d+(?:\.\d+)?)/);
    
    const reductionPercent = percentMatch ? parseInt(percentMatch[1]) : 20;
    const potentialSavings = valueMatch ? parseFloat(valueMatch[1]) : totalExpenses * (reductionPercent / 100);
    
    // Identificar categoria mencionada na recomendação
    const categories = ['Alimentação', 'Transporte', 'Saúde', 'Lazer', 'Educação', 'Moradia'];
    const mentionedCategory = categories.find(cat => 
      recommendation.toLowerCase().includes(cat.toLowerCase())
    ) || 'Despesas Gerais';
    
    const categoryExpenses = expenses
      .filter(t => t.category === mentionedCategory)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const currentAmount = categoryExpenses > 0 ? categoryExpenses : totalExpenses * 0.3;
    const projectedAmount = currentAmount * (1 - reductionPercent / 100);
    const actualSavings = currentAmount - projectedAmount;
    
    setSelectedRecommendation({
      title: recommendation,
      category: mentionedCategory,
      reductionPercent,
      currentAmount,
      projectedAmount,
      savings: actualSavings,
      chartData: [
        { name: 'Atual', value: currentAmount, fill: '#ef4444' },
        { name: 'Projetado', value: projectedAmount, fill: '#22c55e' },
      ],
      comparisonData: [
        { period: 'Antes', amount: currentAmount },
        { period: 'Depois', amount: projectedAmount },
      ]
    });
    setShowRecommendationModal(true);
  };

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
    <Card className="p-6 bg-card border-4 border-foreground shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-3 rounded-2xl bg-foreground">
            <Sparkles className="text-background" size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-foreground">INSIGHTS POR IA</h3>
            <p className="text-sm font-bold text-foreground/70">Análise inteligente com visualizações</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-foreground text-background font-black text-xs px-3 py-1">
          LOVABLE AI
        </Badge>
      </div>

      {parsedInsights && (
        <div className="space-y-4 mb-4">
          {/* Score com emoji */}
          <Card className={`p-5 border-4 ${getStatusColor(parsedInsights.status)}`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-black">{parsedInsights.analysisTitle || 'ANÁLISE'}</h4>
                <p className="text-xs font-bold opacity-70">{parsedInsights.analysisSubtitle}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl">{getStatusEmoji(parsedInsights.status)}</div>
                <div className="text-2xl font-black">{parsedInsights.healthScore}/100</div>
              </div>
            </div>
          </Card>

          {/* Gráfico único */}
          {parsedInsights.categoryAnalysis && parsedInsights.categoryAnalysis.length > 0 && (
            <Card className="p-4 border-4 border-foreground">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={parsedInsights.categoryAnalysis}>
                  <XAxis dataKey="category" tick={{ fill: 'currentColor', fontWeight: 'bold', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'currentColor', fontWeight: 'bold', fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '2px solid hsl(var(--foreground))', borderRadius: '8px', fontWeight: 'bold' }} />
                  <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                    {parsedInsights.categoryAnalysis.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* 2 insights curtos */}
          {parsedInsights.insights && parsedInsights.insights.length > 0 && (
            <div className="space-y-2">
              {parsedInsights.insights.slice(0, 2).map((insight: string, index: number) => (
                <Card key={index} className="p-3 border-2 border-foreground">
                  <p className="text-sm font-bold text-foreground">💡 {insight}</p>
                </Card>
              ))}
            </div>
          )}

          {/* Recomendações clicáveis */}
          {parsedInsights.recommendations && parsedInsights.recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-lg font-black text-foreground">✨ AÇÕES</h4>
              {parsedInsights.recommendations.slice(0, 2).map((rec: string, index: number) => (
                <Card 
                  key={index} 
                  className="p-3 border-2 border-foreground cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => handleRecommendationClick(rec, index)}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-foreground">▸ {rec}</p>
                    <ArrowRight className="text-foreground flex-shrink-0" size={16} />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {!parsedInsights && !isLoading && (
        <div className="text-center py-6">
          <p className="text-muted-foreground text-sm font-bold">
            Gere análise visual com gráficos
          </p>
        </div>
      )}

      <Button
        onClick={handleGenerateInsights}
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
            {parsedInsights ? "ATUALIZAR" : "GERAR ANÁLISE"}
          </>
        )}
      </Button>

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-2 text-center font-bold">
          {error}
        </p>
      )}

      {/* Modal de Análise Detalhada de Recomendação */}
      <Dialog open={showRecommendationModal} onOpenChange={setShowRecommendationModal}>
        <DialogContent className="max-w-2xl bg-card border-4 border-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-foreground">
              📊 ANÁLISE DETALHADA
            </DialogTitle>
          </DialogHeader>
          
          {selectedRecommendation && (
            <div className="space-y-6">
              {/* Título da Recomendação */}
              <Card className="p-4 bg-foreground text-background border-2">
                <p className="font-bold">{selectedRecommendation.title}</p>
              </Card>

              {/* Estatísticas */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 border-4 border-red-500 bg-red-50">
                  <p className="text-xs font-bold text-red-800">GASTO ATUAL</p>
                  <p className="text-2xl font-black text-red-600">
                    R$ {selectedRecommendation.currentAmount.toFixed(2)}
                  </p>
                </Card>
                <Card className="p-4 border-4 border-green-500 bg-green-50">
                  <p className="text-xs font-bold text-green-800">GASTO PROJETADO</p>
                  <p className="text-2xl font-black text-green-600">
                    R$ {selectedRecommendation.projectedAmount.toFixed(2)}
                  </p>
                </Card>
                <Card className="p-4 border-4 border-blue-500 bg-blue-50">
                  <p className="text-xs font-bold text-blue-800">ECONOMIA</p>
                  <p className="text-2xl font-black text-blue-600">
                    R$ {selectedRecommendation.savings.toFixed(2)}
                  </p>
                </Card>
              </div>

              {/* Gráfico de Comparação */}
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

              {/* Impacto Mensal */}
              <Card className="p-4 bg-yellow-50 border-4 border-yellow-500">
                <p className="text-sm font-bold text-yellow-900">
                  💰 <strong>IMPACTO MENSAL:</strong> Seguindo esta recomendação, você economizaria{' '}
                  <span className="text-yellow-600 font-black">
                    R$ {selectedRecommendation.savings.toFixed(2)}
                  </span>
                  {' '}por mês em {selectedRecommendation.category}, representando uma redução de{' '}
                  <span className="text-yellow-600 font-black">
                    {selectedRecommendation.reductionPercent}%
                  </span>
                  !
                </p>
              </Card>

              <Button
                onClick={() => setShowRecommendationModal(false)}
                className="w-full bg-foreground hover:bg-foreground/90 text-background font-black"
              >
                FECHAR ANÁLISE
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
