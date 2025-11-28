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

export const PredictiveAssistant = ({ transactions = [], currentBalance = 0 }: PredictiveAssistantProps) => {
  // Garantir que transactions é sempre um array válido
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const safeBalance = typeof currentBalance === 'number' && !isNaN(currentBalance) ? currentBalance : 0;
  
  // Análise preditiva
  const calculatePredictions = () => {
    const expenses = safeTransactions.filter(t => t.type === "expense");
    const income = safeTransactions.filter(t => t.type === "income");
    
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    
    const avgDailyExpense = totalExpenses > 0 ? totalExpenses / 30 : 0;
    const avgMonthlyIncome = totalIncome;
    
    const daysUntilZero = avgDailyExpense > 0 ? Math.floor(safeBalance / avgDailyExpense) : 999;
    const projectedEndOfMonth = safeBalance - (avgDailyExpense * 30);
    const burnRate = avgMonthlyIncome > 0 ? (avgDailyExpense / avgMonthlyIncome) * 100 : 0;
    
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
      <Card className={`p-6 ${getScoreBgColor(healthScore)} border-4 border-foreground`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-black text-foreground">SAÚDE FINANCEIRA</h3>
            <p className="text-base font-bold text-foreground/70">Score preditivo em tempo real</p>
          </div>
          <div className={`text-5xl font-black ${getScoreColor(healthScore)}`}>
            {healthScore}
          </div>
        </div>
        <Progress value={healthScore} className="h-4" />
      </Card>

      {/* Previsões */}
        <Card className="p-6 bg-card border-4 border-foreground shadow-xl">
          <h3 className="font-black text-foreground mb-3 flex items-center gap-2 text-lg">
            <Calendar size={22} />
            PRÓXIMOS 30 DIAS
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 p-4 rounded-2xl border-2 border-foreground">
              <p className="text-sm text-foreground/70 mb-1 font-bold">SALDO EM 30 DIAS</p>
              <p className={`text-2xl font-black ${predictions.projectedEndOfMonth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {predictions.projectedEndOfMonth.toFixed(2)}
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-2xl border-2 border-foreground">
              <p className="text-sm text-foreground/70 mb-1 font-bold">GASTO MÉDIO/DIA</p>
              <p className="text-2xl font-black text-foreground">
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
                className={`p-4 animate-fade-in border-l-4 border-4 ${
                  isUrgent 
                    ? 'border-l-red-500 bg-red-50 dark:bg-red-900/10 border-red-500' 
                    : alert.type === "warning"
                    ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-500'
                    : 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10 border-blue-500'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-2xl ${
                    isUrgent 
                      ? 'bg-red-600' 
                      : alert.type === "warning"
                      ? 'bg-yellow-600'
                      : 'bg-blue-600'
                  }`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-base text-foreground mb-1">{alert.title}</h4>
                    <p className="text-sm font-bold text-foreground/70 mb-2">{alert.message}</p>
                    <Button 
                      size="sm" 
                      variant={isUrgent ? "default" : "outline"}
                      className="text-sm h-9 font-black border-2 border-foreground"
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
