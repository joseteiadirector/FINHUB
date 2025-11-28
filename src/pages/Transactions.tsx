import { TransactionItem } from "@/components/TransactionItem";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Transactions = () => {
  const navigate = useNavigate();

  const allTransactions = [
    { title: "Salário", date: "27 Nov", amount: 5000, type: "income" as const, category: "Trabalho" },
    { title: "Supermercado Extra", date: "26 Nov", amount: 245.80, type: "expense" as const, category: "Alimentação" },
    { title: "Transferência recebida", date: "25 Nov", amount: 350, type: "income" as const, category: "Transferência" },
    { title: "Uber", date: "24 Nov", amount: 28.50, type: "expense" as const, category: "Transporte" },
    { title: "Netflix", date: "23 Nov", amount: 39.90, type: "expense" as const, category: "Entretenimento" },
    { title: "Cashback", date: "22 Nov", amount: 15.50, type: "income" as const, category: "Recompensas" },
    { title: "Farmácia", date: "21 Nov", amount: 87.30, type: "expense" as const, category: "Saúde" },
    { title: "iFood", date: "20 Nov", amount: 52.90, type: "expense" as const, category: "Alimentação" },
    { title: "Freelance", date: "19 Nov", amount: 800, type: "income" as const, category: "Trabalho" },
    { title: "Academia", date: "18 Nov", amount: 120, type: "expense" as const, category: "Saúde" },
  ];

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold text-foreground flex-1">Extrato</h1>
          <Button variant="ghost" size="icon">
            <Filter size={20} />
          </Button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">
        <div className="mb-4 flex gap-2">
          <Button variant="default" size="sm">Todos</Button>
          <Button variant="outline" size="sm">Receitas</Button>
          <Button variant="outline" size="sm">Despesas</Button>
        </div>

        <div className="space-y-2">
          {allTransactions.map((transaction, index) => (
            <div key={index} className="bg-card rounded-lg">
              <TransactionItem {...transaction} />
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Transactions;
