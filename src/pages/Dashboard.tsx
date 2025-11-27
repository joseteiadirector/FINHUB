import { BalanceCard } from "@/components/BalanceCard";
import { TransactionItem } from "@/components/TransactionItem";
import { BottomNav } from "@/components/BottomNav";
import { PredictiveAssistant } from "@/components/PredictiveAssistant";
import { ContextualInsights } from "@/components/ContextualInsights";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const navigate = useNavigate();

  const recentTransactions = [
    { title: "Salário", date: "2024-11-27", amount: 5000, type: "income" as const, category: "Trabalho" },
    { title: "Supermercado", date: "2024-11-26", amount: 245.80, type: "expense" as const, category: "Alimentação" },
    { title: "Netflix", date: "2024-11-25", amount: 39.90, type: "expense" as const, category: "Entretenimento" },
    { title: "Uber", date: "2024-11-24", amount: 28.50, type: "expense" as const, category: "Transporte" },
    { title: "Restaurante", date: "2024-11-23", amount: 156.00, type: "expense" as const, category: "Alimentação" },
    { title: "Academia", date: "2024-11-22", amount: 120.00, type: "expense" as const, category: "Saúde" },
    { title: "Gasolina", date: "2024-11-21", amount: 200.00, type: "expense" as const, category: "Transporte" },
    { title: "Farmácia", date: "2024-11-20", amount: 45.00, type: "expense" as const, category: "Saúde" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-to-br from-card to-card/50 border-b border-border p-6 animate-fade-in">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-1">Olá, João! 👋</h1>
          <p className="text-sm text-muted-foreground">Gerencie suas finanças com inteligência</p>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6 animate-fade-in">
        <div className="animate-scale-in">
          <BalanceCard balance={8547.32} income={5000} expenses={1452.18} />
        </div>

        {/* Assistente IA + Insights em Abas */}
        <div className="bg-card rounded-lg p-1">
          <Tabs defaultValue="assistant" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-3">
              <TabsTrigger value="assistant" className="text-xs">
                <Sparkles size={14} className="mr-1" />
                Assistente IA
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-xs">
                <TrendingUp size={14} className="mr-1" />
                Insights
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="assistant" className="mt-0 px-3 pb-3">
              <PredictiveAssistant 
                transactions={recentTransactions} 
                currentBalance={8547.32}
              />
            </TabsContent>
            
            <TabsContent value="insights" className="mt-0 px-3 pb-3">
              <ContextualInsights transactions={recentTransactions} />
            </TabsContent>
          </Tabs>
        </div>

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
