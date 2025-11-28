import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id?: string;
  title: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  ai_categorized?: boolean;
}

// Dados de demonstração fixos para MVP
const DEMO_TRANSACTIONS: Transaction[] = [
  { id: "demo-1", title: "Salário", date: "2025-01-15", amount: 5500, type: "income", category: "Salário" },
  { id: "demo-2", title: "Freelance Design", date: "2025-01-20", amount: 1200, type: "income", category: "Freelance" },
  { id: "demo-3", title: "Aluguel", date: "2025-01-10", amount: 1500, type: "expense", category: "Moradia" },
  { id: "demo-4", title: "Supermercado Extra", date: "2025-01-12", amount: 350, type: "expense", category: "Alimentação" },
  { id: "demo-5", title: "Uber", date: "2025-01-14", amount: 45, type: "expense", category: "Transporte" },
  { id: "demo-6", title: "Netflix", date: "2025-01-16", amount: 55, type: "expense", category: "Entretenimento" },
  { id: "demo-7", title: "Farmácia", date: "2025-01-18", amount: 120, type: "expense", category: "Saúde" },
  { id: "demo-8", title: "Restaurante", date: "2025-01-22", amount: 180, type: "expense", category: "Alimentação" },
  { id: "demo-9", title: "Academia", date: "2025-01-05", amount: 150, type: "expense", category: "Saúde" },
  { id: "demo-10", title: "Conta de Luz", date: "2025-01-08", amount: 220, type: "expense", category: "Contas" },
];

export const useTransactions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    // Se não houver usuário, usar dados de demonstração
    if (!user) {
      setTransactions(DEMO_TRANSACTIONS);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) throw error;

      const formattedData = (data || []).map((t) => ({
        ...t,
        type: t.type as "income" | "expense",
      }));

      // Se não houver transações do usuário, usar dados demo
      setTransactions(formattedData.length > 0 ? formattedData : DEMO_TRANSACTIONS);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      // Em caso de erro, usar dados demo
      setTransactions(DEMO_TRANSACTIONS);
      toast({
        title: "Usando dados de demonstração",
        description: "Exibindo exemplo de transações",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("transactions")
        .insert([
          {
            ...transaction,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const formattedData = { ...data, type: data.type as "income" | "expense" };
      setTransactions((prev) => [formattedData, ...prev]);
      toast({
        title: "Transação adicionada!",
        description: "Sua transação foi salva com sucesso",
      });
      return data;
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Erro ao adicionar transação",
        description: "Não foi possível salvar sua transação",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("transactions")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;

      const formattedData = { ...data, type: data.type as "income" | "expense" };
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...formattedData } : t))
      );
      toast({
        title: "Transação atualizada!",
        description: "Sua transação foi atualizada com sucesso",
      });
      return data;
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        title: "Erro ao atualizar transação",
        description: "Não foi possível atualizar sua transação",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast({
        title: "Transação deletada!",
        description: "Sua transação foi removida com sucesso",
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Erro ao deletar transação",
        description: "Não foi possível remover sua transação",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]); // Sempre executa, mesmo sem user

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions: fetchTransactions,
  };
};
