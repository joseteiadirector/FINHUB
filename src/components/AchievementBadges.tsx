import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, Zap, Award, Crown } from "lucide-react";

interface Transaction {
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

interface AchievementBadgesProps {
  transactions: Transaction[];
}

export const AchievementBadges = ({ transactions }: AchievementBadgesProps) => {
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;
  
  const categoryCount = new Set(transactions.map(t => t.category)).size;
  const transactionCount = transactions.length;

  const achievements = [
    {
      icon: Trophy,
      title: "Primeiro Passo",
      description: "Complete sua primeira transação",
      unlocked: transactionCount >= 1,
      progress: Math.min(transactionCount, 1)
    },
    {
      icon: Star,
      title: "Economista Iniciante",
      description: "Economize 10% da sua renda",
      unlocked: savingsRate >= 10,
      progress: Math.min(savingsRate / 10, 1)
    },
    {
      icon: Target,
      title: "Mestre da Economia",
      description: "Economize 20% ou mais da sua renda",
      unlocked: savingsRate >= 20,
      progress: Math.min(savingsRate / 20, 1)
    },
    {
      icon: Zap,
      title: "Usuário Ativo",
      description: "Faça 10 transações",
      unlocked: transactionCount >= 10,
      progress: Math.min(transactionCount / 10, 1)
    },
    {
      icon: Award,
      title: "Organizador",
      description: "Use 5 categorias diferentes",
      unlocked: categoryCount >= 5,
      progress: Math.min(categoryCount / 5, 1)
    },
    {
      icon: Crown,
      title: "Guru Financeiro",
      description: "Complete 30 transações e economize 25%",
      unlocked: transactionCount >= 30 && savingsRate >= 25,
      progress: Math.min((transactionCount / 30 + savingsRate / 25) / 2, 1)
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="text-primary" size={20} />
          <h2 className="text-lg font-semibold text-foreground">Conquistas</h2>
        </div>
        <Badge variant="secondary">
          {unlockedCount}/{achievements.length}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          return (
            <Card 
              key={index} 
              className={`p-4 ${achievement.unlocked ? 'bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20' : 'opacity-50'}`}
            >
              <div className="space-y-2">
                <div className={`p-2 rounded-lg w-fit ${achievement.unlocked ? 'bg-primary/20' : 'bg-muted'}`}>
                  <Icon 
                    className={achievement.unlocked ? 'text-primary' : 'text-muted-foreground'} 
                    size={24} 
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{achievement.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                </div>
                {!achievement.unlocked && (
                  <div className="mt-2">
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div 
                        className="bg-primary h-1.5 rounded-full transition-all" 
                        style={{ width: `${achievement.progress * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
