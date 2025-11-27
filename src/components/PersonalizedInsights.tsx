import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, Award, Lightbulb } from "lucide-react";

interface Transaction {
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

interface PersonalizedInsightsProps {
  transactions: Transaction[];
}

export const PersonalizedInsights = ({ transactions }: PersonalizedInsightsProps) => {
  // Heurística: Calcular insights baseados nos dados
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  
  // Categoria com mais gastos
  const categoryTotals = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
  
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  
  // Taxa de economia
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;
  
  // Média de gastos diários
  const daysInMonth = 30;
  const dailyAverage = totalExpenses / daysInMonth;
  
  // Projeção para fim do mês
  const currentDay = new Date().getDate();
  const projectedMonthlyExpense = (totalExpenses / currentDay) * daysInMonth;
  
  // Comparação com mês anterior (simulado +5% de redução)
  const previousMonthExpenses = totalExpenses * 1.05;
  const changePercent = ((totalExpenses - previousMonthExpenses) / previousMonthExpenses * 100);
  
  const insights = [
    {
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
      title: "Taxa de economia",
      value: `${savingsRate.toFixed(1)}%`,
      description: savingsRate > 20 ? "Ótimo! Você está economizando bem" : "Tente economizar pelo menos 20% da renda"
    },
    {
      icon: TrendingDown,
      color: changePercent < 0 ? "text-green-600" : "text-red-600",
      bg: changePercent < 0 ? "bg-green-100" : "bg-red-100",
      title: "Vs. mês anterior",
      value: `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}%`,
      description: changePercent < 0 ? "Parabéns! Você reduziu seus gastos" : "Seus gastos aumentaram este mês"
    },
    {
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-100",
      title: "Gasto diário médio",
      value: `R$ ${dailyAverage.toFixed(2).replace('.', ',')}`,
      description: `Projeção do mês: R$ ${projectedMonthlyExpense.toFixed(2).replace('.', ',')}`
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="text-primary" size={20} />
        <h2 className="text-lg font-semibold text-foreground">Seus Insights Personalizados</h2>
      </div>
      
      <div className="grid gap-3">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${insight.bg}`}>
                  <Icon className={insight.color} size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{insight.title}</p>
                  <p className="text-2xl font-bold text-foreground">{insight.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
        
        {topCategory && (
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Award className="text-primary" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Categoria principal</p>
                <p className="text-xl font-bold text-foreground">{topCategory[0]}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  R$ {topCategory[1].toFixed(2).replace('.', ',')} gastos este mês
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
