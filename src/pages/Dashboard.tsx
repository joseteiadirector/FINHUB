import { BalanceCard } from "@/components/BalanceCard";
import { TransactionItem } from "@/components/TransactionItem";
import { BottomNav } from "@/components/BottomNav";
import { PredictiveAssistant } from "@/components/PredictiveAssistant";
import { ContextualInsights } from "@/components/ContextualInsights";
import { AIPersonalizedInsights } from "@/components/AIPersonalizedInsights";
import { FinancialChatBot } from "@/components/FinancialChatBot";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight, Sparkles, MessageCircle, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, loading } = useUserProfile();
  
  const userName = profile?.full_name || "Usuário";
  const userInitial = profile?.full_name?.charAt(0).toUpperCase() || "U";

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
      <header className="bg-card border-b-4 border-foreground p-6 animate-fade-in shadow-xl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/")}
            className="border-4 border-foreground hover:bg-foreground hover:text-background transition-all"
            aria-label="Ir para início"
          >
            <Home size={24} />
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-black text-foreground mb-1">
              {loading ? "OLÁ! 👋" : `OLÁ, ${userName.toUpperCase()}! 👋`}
            </h1>
            <p className="text-base font-semibold text-foreground/70">Gerencie suas finanças com inteligência</p>
          </div>
          <Avatar className="w-14 h-14 border-4 border-foreground cursor-pointer hover:scale-110 transition-transform shadow-lg" onClick={() => navigate("/profile")}>
            <AvatarImage src={profile?.avatar_url || undefined} alt="Avatar" />
            <AvatarFallback className="bg-foreground text-background text-xl font-black">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6 animate-fade-in">
        <div className="animate-scale-in">
          <BalanceCard balance={8547.32} income={5000} expenses={1452.18} />
        </div>

        {/* Assistente IA + Insights + Chat em Abas */}
        <div className="bg-card rounded-2xl p-1 border-4 border-foreground shadow-xl">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-3 bg-foreground">
              <TabsTrigger value="chat" className="text-sm font-black data-[state=active]:bg-background data-[state=active]:text-foreground">
                <MessageCircle size={16} className="mr-1" />
                CHAT
              </TabsTrigger>
              <TabsTrigger value="assistant" className="text-sm font-black data-[state=active]:bg-background data-[state=active]:text-foreground">
                <Sparkles size={16} className="mr-1" />
                ASSISTENTE
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-sm font-black data-[state=active]:bg-background data-[state=active]:text-foreground">
                <TrendingUp size={16} className="mr-1" />
                INSIGHTS
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="mt-0 px-3 pb-3">
              <FinancialChatBot 
                transactions={recentTransactions}
                currentBalance={8547.32}
              />
            </TabsContent>
            
            <TabsContent value="assistant" className="mt-0 px-3 pb-3 space-y-4">
              <AIPersonalizedInsights 
                transactions={recentTransactions} 
                currentBalance={8547.32}
              />
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
            <TrendingUp className="text-foreground" size={24} />
            <h2 className="text-2xl font-black text-foreground">GASTOS DO MÊS</h2>
          </div>
          <p className="text-base font-bold text-foreground/70">Novembro</p>
        </div>

        <div className="bg-card rounded-2xl p-4 border-4 border-foreground shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base font-black text-foreground">LIMITE DE GASTOS</span>
            <span className="text-base font-black text-foreground">65% USADO</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 border-2 border-foreground">
            <div className="bg-foreground h-full rounded-full" style={{ width: "65%" }}></div>
          </div>
          <p className="text-sm font-bold text-foreground/70 mt-2">R$ 1.452,18 de R$ 2.200,00</p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-black text-foreground">TRANSAÇÕES RECENTES</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/transactions")}
              className="text-foreground font-bold hover:bg-foreground/10"
            >
              Ver todas <ArrowRight size={18} className="ml-1" />
            </Button>
          </div>
          
          <div className="bg-card rounded-2xl divide-y-2 divide-foreground border-4 border-foreground shadow-lg">
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
