import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, TrendingUp, Zap, ShoppingBag } from "lucide-react";

interface Transaction {
  amount: number;
  type: "income" | "expense";
  date: string;
  category: string;
}

interface ContextualInsightsProps {
  transactions: Transaction[];
}

export const ContextualInsights = ({ transactions }: ContextualInsightsProps) => {
  // Análise de padrões temporais
  const getTimePatterns = () => {
    const expenses = transactions.filter(t => t.type === "expense");
    
    // Análise por dia da semana
    const daySpending: Record<string, number> = {
      'Segunda': 0, 'Terça': 0, 'Quarta': 0, 'Quinta': 0, 'Sexta': 0, 'Sábado': 0, 'Domingo': 0
    };
    
    expenses.forEach(t => {
      const date = new Date(t.date);
      const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      const day = dayNames[date.getDay()];
      daySpending[day] += t.amount;
    });
    
    const maxDay = Object.entries(daySpending).sort((a, b) => b[1] - a[1])[0];
    
    return {
      peakDay: maxDay ? { day: maxDay[0], amount: maxDay[1] } : null,
    };
  };

  const getCategoryInsights = () => {
    const expenses = transactions.filter(t => t.type === "expense");
    
    const categoryData: Record<string, { total: number; count: number }> = {};
    expenses.forEach(t => {
      if (!categoryData[t.category]) {
        categoryData[t.category] = { total: 0, count: 0 };
      }
      categoryData[t.category].total += t.amount;
      categoryData[t.category].count += 1;
    });
    
    const sortedCategories = Object.entries(categoryData)
      .map(([name, data]) => ({
        name,
        total: data.total,
        avg: data.total / data.count,
        count: data.count,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);
    
    return sortedCategories;
  };

  const timePatterns = getTimePatterns();
  const topCategories = getCategoryInsights();

  const insights = [
    {
      icon: Clock,
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
      title: "Padrão Temporal",
      description: timePatterns.peakDay 
        ? `Você gasta mais às ${timePatterns.peakDay.day}s: R$ ${timePatterns.peakDay.amount.toFixed(2)}`
        : "Sem padrão identificado ainda",
      badge: "Comportamento",
    },
    {
      icon: ShoppingBag,
      color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
      title: "Categoria Dominante",
      description: topCategories[0] 
        ? `${topCategories[0].name}: ${topCategories[0].count} transações, média de R$ ${topCategories[0].avg.toFixed(2)}`
        : "Sem dados suficientes",
      badge: "Frequência",
    },
    {
      icon: Zap,
      color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
      title: "Ação Recomendada",
      description: topCategories[0]
        ? `Configure um limite mensal para ${topCategories[0].name}`
        : "Continue registrando transações",
      badge: "Sugestão",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-foreground">Insights Contextuais</h3>
        <Badge variant="secondary" className="text-xs">
          Baseado em IA
        </Badge>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <Card 
              key={index}
              className="p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl ${insight.color}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-foreground">{insight.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {insight.badge}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Top Categories Breakdown */}
      {topCategories.length > 0 && (
        <Card className="p-4 mt-4 bg-gradient-to-br from-card to-card/50">
          <h4 className="font-bold text-sm text-foreground mb-3">Top 3 Categorias</h4>
          <div className="space-y-2">
            {topCategories.map((cat, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{cat.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-foreground">
                    R$ {cat.total.toFixed(2)}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {cat.count}x
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
