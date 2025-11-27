import { useState, useEffect } from "react";
import { TransactionItem } from "@/components/TransactionItem";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Filter, TrendingDown, TrendingUp, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useCategorization } from "@/hooks/useCategorization";
import { useToast } from "@/hooks/use-toast";
import { PersonalizedInsights } from "@/components/PersonalizedInsights";
import { PersonalizedRecommendations } from "@/components/PersonalizedRecommendations";
import { AchievementBadges } from "@/components/AchievementBadges";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Transaction {
  title: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  aiCategorized?: boolean;
}

const TransactionsEnhanced = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { categorizeExpense } = useCategorization();
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [transactions, setTransactions] = useState<Transaction[]>([
    { title: "Salário", date: "27 Nov", amount: 5000, type: "income", category: "Trabalho" },
    { title: "Supermercado Extra", date: "26 Nov", amount: 245.80, type: "expense", category: "Alimentação" },
    { title: "Transferência recebida", date: "25 Nov", amount: 350, type: "income", category: "Transferência" },
    { title: "Uber", date: "24 Nov", amount: 28.50, type: "expense", category: "Transporte" },
    { title: "Netflix", date: "23 Nov", amount: 39.90, type: "expense", category: "Entretenimento" },
    { title: "Cashback", date: "22 Nov", amount: 15.50, type: "income", category: "Recompensas" },
    { title: "Farmácia", date: "21 Nov", amount: 87.30, type: "expense", category: "Saúde" },
    { title: "iFood", date: "20 Nov", amount: 52.90, type: "expense", category: "Alimentação" },
    { title: "Freelance", date: "19 Nov", amount: 800, type: "income", category: "Trabalho" },
    { title: "Academia", date: "18 Nov", amount: 120, type: "expense", category: "Saúde" },
  ]);

  const handleAIRecategorize = async () => {
    toast({
      title: "Recategorizando com IA...",
      description: "Analisando suas transações automaticamente",
    });

    const expenseTransactions = transactions.filter(t => t.type === "expense");
    const updatedTransactions = [...transactions];

    for (let i = 0; i < expenseTransactions.length; i++) {
      const transaction = expenseTransactions[i];
      const result = await categorizeExpense(transaction.title, transaction.amount);
      
      if (result && result.confidence > 0.7) {
        const idx = updatedTransactions.findIndex(t => t.title === transaction.title && t.date === transaction.date);
        if (idx !== -1) {
          updatedTransactions[idx] = {
            ...updatedTransactions[idx],
            category: result.category,
            aiCategorized: true
          };
        }
      }
    }

    setTransactions(updatedTransactions);
    toast({
      title: "Categorização concluída!",
      description: "Suas transações foram recategorizadas automaticamente",
    });
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === "all") return true;
    return t.type === filterType;
  });

  // Calculate category totals for pie chart
  const categoryTotals = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100,
  }));

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold text-foreground flex-1">Extrato Inteligente</h1>
          <Button variant="ghost" size="icon">
            <Filter size={20} />
          </Button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-green-600" size={20} />
              <span className="text-sm text-muted-foreground">Receitas</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              R$ {totalIncome.toFixed(2).replace(".", ",")}
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="text-red-600" size={20} />
              <span className="text-sm text-muted-foreground">Despesas</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              R$ {totalExpense.toFixed(2).replace(".", ",")}
            </p>
          </Card>
        </div>

        {/* AI Categorization Button */}
        <Button 
          onClick={handleAIRecategorize} 
          className="w-full"
          variant="outline"
        >
          <Sparkles className="mr-2" size={20} />
          Recategorizar com IA
        </Button>

        {/* Category Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Gastos por Categoria</h2>
          <ChartContainer
            config={{
              value: {
                label: "Valor",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        {/* Filters */}
        <div className="flex gap-2">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("all")}
          >
            Todos
          </Button>
          <Button
            variant={filterType === "income" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("income")}
          >
            Receitas
          </Button>
          <Button
            variant={filterType === "expense" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("expense")}
          >
            Despesas
          </Button>
        </div>

            {/* Transactions List */}
            <div className="space-y-2">
              {filteredTransactions.map((transaction, index) => (
                <div key={index} className="bg-card rounded-lg relative">
                  {transaction.aiCategorized && (
                    <div className="absolute top-2 right-2 bg-primary/10 rounded-full p-1">
                      <Sparkles className="text-primary" size={14} />
                    </div>
                  )}
                  <TransactionItem {...transaction} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <PersonalizedInsights transactions={transactions} />
            <PersonalizedRecommendations 
              transactions={transactions}
              onActionClick={(action) => {
                toast({
                  title: action,
                  description: "Esta funcionalidade estará disponível em breve",
                });
              }}
            />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <AchievementBadges transactions={transactions} />
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default TransactionsEnhanced;
