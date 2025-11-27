import { BalanceCard } from "@/components/BalanceCard";
import { TransactionItem } from "@/components/TransactionItem";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const recentTransactions = [
    { title: "Salário", date: "Hoje", amount: 5000, type: "income" as const, category: "Trabalho" },
    { title: "Supermercado", date: "Ontem", amount: 245.80, type: "expense" as const, category: "Alimentação" },
    { title: "Netflix", date: "15 Nov", amount: 39.90, type: "expense" as const, category: "Entretenimento" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-foreground">Olá, João!</h1>
          <p className="text-sm text-muted-foreground">Bem-vindo ao seu FinHub</p>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <BalanceCard balance={8547.32} income={5000} expenses={1452.18} />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-primary" size={20} />
            <h2 className="text-lg font-semibold text-foreground">Gastos do mês</h2>
          </div>
          <p className="text-sm text-muted-foreground">Novembro</p>
        </div>

        <div className="bg-card rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Limite de gastos</span>
            <span className="text-sm font-semibold text-foreground">65% usado</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">R$ 1.452,18 de R$ 2.200,00</p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-foreground">Transações recentes</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/transactions")}
              className="text-primary"
            >
              Ver todas <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
          
          <div className="bg-card rounded-lg divide-y divide-border">
            {recentTransactions.map((transaction, index) => (
              <TransactionItem key={index} {...transaction} />
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
