import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingDown, TrendingUp, AlertTriangle, Lightbulb, Target, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Transaction {
  amount: number;
  type: "income" | "expense";
  date: string;
  category: string;
}

interface PredictiveAssistantProps {
  transactions: Transaction[];
  currentBalance: number;
}

export const PredictiveAssistant = ({ transactions, currentBalance }: PredictiveAssistantProps) => {
  // Análise preditiva
  const calculatePredictions = () => {
    const expenses = transactions.filter(t => t.type === "expense");
    const income = transactions.filter(t => t.type === "income");
    
    const avgDailyExpense = expenses.reduce((sum, t) => sum + t.amount, 0) / 30;
    const avgMonthlyIncome = income.reduce((sum, t) => sum + t.amount, 0);
    
    const daysUntilZero = Math.floor(currentBalance / avgDailyExpense);
    const projectedEndOfMonth = currentBalance - (avgDailyExpense * 30);
    const burnRate = (avgDailyExpense / avgMonthlyIncome) * 100;
    
    // Categoria que mais gasta
    const categorySpending: Record<string, number> = {};
    expenses.forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });
    const topCategory = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0];
    
    return {
      daysUntilZero,
      projectedEndOfMonth,
      burnRate,
      avgDailyExpense,
      topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
    };
  };

  const predictions = calculatePredictions();

  // Alertas e recomendações
  const getAlerts = () => {
    const alerts = [];
    
    if (predictions.daysUntilZero < 15) {
      alerts.push({
        type: "critical",
        icon: AlertTriangle,
        title: "⚠️ Alerta de Saldo Crítico",
        message: `Com o ritmo atual, seu saldo acabará em ${predictions.daysUntilZero} dias`,
        action: "Reduza gastos diários",
        priority: 1,
      });
    }
    
    if (predictions.projectedEndOfMonth < 0) {
      alerts.push({
        type: "warning",
        icon: TrendingDown,
        title: "📉 Projeção Negativa",
        message: `Fim do mês: saldo previsto de R$ ${Math.abs(predictions.projectedEndOfMonth).toFixed(2)} negativo`,
        action: "Planeje economia agora",
        priority: 2,
      });
    }
    
    if (predictions.burnRate > 80) {
      alerts.push({
        type: "warning",
        icon: Target,
        title: "🔥 Taxa de Queima Alta",
        message: `Você está gastando ${predictions.burnRate.toFixed(0)}% da sua receita`,
        action: "Reduza gastos em 20%",
        priority: 2,
      });
    }
    
    if (predictions.topCategory) {
      alerts.push({
        type: "insight",
        icon: Lightbulb,
        title: "💡 Oportunidade de Economia",
        message: `${predictions.topCategory.name} consome R$ ${predictions.topCategory.amount.toFixed(2)}/mês`,
        action: `Reduza 15% em ${predictions.topCategory.name}`,
        priority: 3,
      });
    }
    
    return alerts.sort((a, b) => a.priority - b.priority);
  };

  const alerts = getAlerts();

  const getHealthScore = () => {
    let score = 100;
    if (predictions.daysUntilZero < 15) score -= 40;
    else if (predictions.daysUntilZero < 30) score -= 20;
    if (predictions.burnRate > 80) score -= 30;
    else if (predictions.burnRate > 60) score -= 15;
    if (predictions.projectedEndOfMonth < 0) score -= 20;
    return Math.max(0, score);
  };

  const healthScore = getHealthScore();

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600 dark:text-green-400";
    if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 70) return "bg-green-100 dark:bg-green-900/30";
    if (score >= 40) return "bg-yellow-100 dark:bg-yellow-900/30";
    return "bg-red-100 dark:bg-red-900/30";
  };

  return (
    <div className="space-y-4">
      {/* Health Score */}
      <Card className={`p-6 ${getScoreBgColor(healthScore)} border-2`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-display font-bold text-foreground uppercase tracking-tight">Saúde Financeira</h3>
            <p className="text-sm font-condensed text-muted-foreground">Score preditivo em tempo real</p>
          </div>
          <div className={`text-4xl font-display font-bold ${getScoreColor(healthScore)}`}>
            {healthScore}
          </div>
        </div>
        <Progress value={healthScore} className="h-3" />
      </Card>

      {/* Previsões */}
      <Card className="p-4">
        <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2 uppercase tracking-tight">
          <Calendar size={18} />
          Próximos 30 Dias
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Saldo em 30 dias</p>
            <p className={`text-lg font-bold ${predictions.projectedEndOfMonth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {predictions.projectedEndOfMonth.toFixed(2)}
            </p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Gasto médio/dia</p>
            <p className="text-lg font-bold text-foreground">
              R$ {predictions.avgDailyExpense.toFixed(2)}
            </p>
          </div>
        </div>
      </Card>

      {/* Alertas e Ações */}
      <div className="space-y-3">
        {alerts.map((alert, index) => {
          const Icon = alert.icon;
          const isUrgent = alert.type === "critical";
          
          return (
            <Card 
              key={index}
              className={`p-4 animate-fade-in border-l-4 ${
                isUrgent 
                  ? 'border-l-red-500 bg-red-50 dark:bg-red-900/10' 
                  : alert.type === "warning"
                  ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
                  : 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  isUrgent 
                    ? 'bg-red-100 dark:bg-red-900/30' 
                    : alert.type === "warning"
                    ? 'bg-yellow-100 dark:bg-yellow-900/30'
                    : 'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  <Icon size={20} className={
                    isUrgent 
                      ? 'text-red-600 dark:text-red-400' 
                      : alert.type === "warning"
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-blue-600 dark:text-blue-400'
                  } />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-foreground mb-1">{alert.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{alert.message}</p>
                  <Button 
                    size="sm" 
                    variant={isUrgent ? "default" : "outline"}
                    className="text-xs h-7"
                  >
                    {alert.action}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
