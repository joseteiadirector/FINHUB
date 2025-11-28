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

export const useTransactions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    if (!user) return;

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

      setTransactions(formattedData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Erro ao carregar transações",
        description: "Não foi possível carregar suas transações",
        variant: "destructive",
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
  }, [user]);

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions: fetchTransactions,
  };
};
