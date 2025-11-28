import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Target, Zap, Award, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Transaction {
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

interface AchievementBadgesProps {
  transactions: Transaction[];
}

export const AchievementBadges = ({ transactions = [] }: AchievementBadgesProps) => {
  const navigate = useNavigate();
  
  // Garantir que transactions é sempre um array válido
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  
  const totalExpenses = safeTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + (typeof t.amount === 'number' ? t.amount : 0), 0);
  const totalIncome = safeTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + (typeof t.amount === 'number' ? t.amount : 0), 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;
  
  const categoryCount = new Set(safeTransactions.map(t => t.category).filter(Boolean)).size;
  const transactionCount = safeTransactions.length;

  const achievements = [
    {
      icon: Trophy,
      title: "Primeiro Passo",
      description: "Complete sua primeira transação",
      unlocked: transactionCount >= 1,
      progress: Math.min(transactionCount, 1),
      action: () => navigate("/transactions"),
      actionText: "Ver transações"
    },
    {
      icon: Star,
      title: "Economista Iniciante",
      description: "Economize 10% da sua renda",
      unlocked: savingsRate >= 10,
      progress: Math.min(savingsRate / 10, 1),
      action: () => navigate("/transactions"),
      actionText: "Adicionar receita"
    },
    {
      icon: Target,
      title: "Mestre da Economia",
      description: "Economize 20% ou mais da sua renda",
      unlocked: savingsRate >= 20,
      progress: Math.min(savingsRate / 20, 1),
      action: () => navigate("/transactions"),
      actionText: "Gerenciar gastos"
    },
    {
      icon: Zap,
      title: "Usuário Ativo",
      description: "Faça 10 transações",
      unlocked: transactionCount >= 10,
      progress: Math.min(transactionCount / 10, 1),
      action: () => navigate("/services"),
      actionText: "Usar serviços"
    },
    {
      icon: Award,
      title: "Organizador",
      description: "Use 5 categorias diferentes",
      unlocked: categoryCount >= 5,
      progress: Math.min(categoryCount / 5, 1),
      action: () => navigate("/transactions"),
      actionText: "Organizar gastos"
    },
    {
      icon: Crown,
      title: "Guru Financeiro",
      description: "Complete 30 transações e economize 25%",
      unlocked: transactionCount >= 30 && savingsRate >= 25,
      progress: Math.min((transactionCount / 30 + savingsRate / 25) / 2, 1),
      action: () => navigate("/dashboard"),
      actionText: "Ver progresso"
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-3 rounded-2xl bg-foreground">
            <Trophy className="text-background" size={24} />
          </div>
          <h2 className="text-2xl font-black text-foreground">CONQUISTAS</h2>
        </div>
        <Badge variant="secondary" className="bg-foreground text-background font-black text-base px-4 py-2">
          {unlockedCount}/{achievements.length}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          return (
            <Card 
              key={index} 
              className={`p-4 cursor-pointer transition-all duration-300 border-4 border-foreground ${
                achievement.unlocked 
                  ? 'bg-card hover:shadow-xl hover:-translate-y-1' 
                  : 'bg-muted/30 opacity-60'
              }`}
              onClick={achievement.unlocked ? achievement.action : undefined}
            >
              <div className="space-y-3">
                <div className={`p-3 rounded-2xl w-fit ${
                  achievement.unlocked ? 'bg-foreground' : 'bg-muted'
                }`}>
                  <Icon 
                    className={achievement.unlocked ? 'text-background' : 'text-muted-foreground'} 
                    size={28} 
                  />
                </div>
                <div>
                  <h3 className="font-black text-base text-foreground mb-1">{achievement.title}</h3>
                  <p className="text-xs font-bold text-foreground/70 leading-relaxed">{achievement.description}</p>
                </div>
                {!achievement.unlocked && (
                  <div className="mt-2">
                    <div className="w-full bg-muted rounded-full h-2 border-2 border-foreground">
                      <div 
                        className="bg-foreground h-full rounded-full transition-all" 
                        style={{ width: `${achievement.progress * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs font-bold text-foreground/60 mt-1">
                      {Math.round(achievement.progress * 100)}% completo
                    </p>
                  </div>
                )}
                {achievement.unlocked && (
                  <Button 
                    size="sm" 
                    className="w-full bg-foreground hover:bg-foreground/90 text-background font-black text-xs mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      achievement.action();
                    }}
                  >
                    {achievement.actionText}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
