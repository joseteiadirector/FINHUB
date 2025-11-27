import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";

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

export const PersonalizedRecommendations = ({ transactions, onActionClick }: PersonalizedRecommendationsProps) => {
  // Heurísticas para gerar recomendações
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  
  const categoryTotals = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const recommendations: Array<{
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
    action?: string;
  }> = [];

  // Recomendação 1: Alta porcentagem em alimentação
  if (categoryTotals["Alimentação"] && categoryTotals["Alimentação"] / totalExpenses > 0.3) {
    recommendations.push({
      title: "Reduza gastos com alimentação",
      description: `Você gasta ${((categoryTotals["Alimentação"] / totalExpenses) * 100).toFixed(0)}% do seu orçamento com alimentação. Considere cozinhar mais em casa!`,
      impact: "high",
      action: "Ver dicas de economia"
    });
  }

  // Recomendação 2: Muitas transações pequenas
  const smallTransactions = transactions.filter(t => t.type === "expense" && t.amount < 50).length;
  if (smallTransactions > 5) {
    recommendations.push({
      title: "Atenção às pequenas despesas",
      description: `Você fez ${smallTransactions} pequenas compras este mês. Pequenos gastos somam muito!`,
      impact: "medium",
      action: "Criar orçamento"
    });
  }

  // Recomendação 3: Taxa de economia baixa
  const savingsRate = ((totalIncome - totalExpenses) / totalIncome * 100);
  if (savingsRate < 10) {
    recommendations.push({
      title: "Aumente sua taxa de economia",
      description: `Você está economizando apenas ${savingsRate.toFixed(1)}%. O ideal é economizar pelo menos 20% da renda.`,
      impact: "high",
      action: "Configurar meta"
    });
  }

  // Recomendação 4: Oportunidade de cashback
  const shoppingExpenses = categoryTotals["Compras"] || 0;
  if (shoppingExpenses > 200) {
    recommendations.push({
      title: "Ganhe cashback em compras",
      description: `Com R$ ${shoppingExpenses.toFixed(2).replace('.', ',')} em compras, você poderia ganhar até R$ ${(shoppingExpenses * 0.05).toFixed(2).replace('.', ',')} em cashback!`,
      impact: "medium",
      action: "Ativar cashback"
    });
  }

  // Recomendação padrão se não houver outras
  if (recommendations.length === 0) {
    recommendations.push({
      title: "Continue assim!",
      description: "Seus hábitos financeiros estão equilibrados. Continue monitorando seus gastos regularmente.",
      impact: "low"
    });
  }

  const impactColors = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-green-100 text-green-700 border-green-200"
  };

  const impactLabels = {
    high: "Alto impacto",
    medium: "Médio impacto",
    low: "Baixo impacto"
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="text-primary" size={20} />
        <h2 className="text-lg font-semibold text-foreground">Recomendações Personalizadas</h2>
      </div>
      
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <Card key={index} className="p-4 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{rec.title}</h3>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
                <Badge variant="outline" className={impactColors[rec.impact]}>
                  {impactLabels[rec.impact]}
                </Badge>
              </div>
              
              {rec.action && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-between"
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
    </div>
  );
};
