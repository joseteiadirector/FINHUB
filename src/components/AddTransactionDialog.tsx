import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";

export const AddTransactionDialog = () => {
  const { addTransaction } = useTransactions();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense" as "income" | "expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  const categories = {
    expense: ["Alimentação", "Transporte", "Saúde", "Entretenimento", "Moradia", "Educação", "Outros"],
    income: ["Salário", "Freelance", "Investimentos", "Cashback", "Outros"],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações robustas
    if (!formData.title.trim()) {
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    if (!formData.category) {
      return;
    }

    try {
      const result = await addTransaction({
        title: formData.title.trim(),
        amount: amount,
        type: formData.type,
        category: formData.category,
        date: formData.date,
      });

      if (result) {
        setOpen(false);
        setFormData({
          title: "",
          amount: "",
          type: "expense",
          category: "",
          date: new Date().toISOString().split("T")[0],
        });
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-foreground hover:bg-foreground/90 text-background font-black h-11 sm:h-12 text-sm sm:text-base border-2 sm:border-3 border-foreground touch-manipulation">
          <Plus className="mr-1.5 sm:mr-2" size={18} />
          ADICIONAR TRANSAÇÃO
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-3 sm:border-4 border-foreground max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-black text-foreground">
            NOVA TRANSAÇÃO
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <Label htmlFor="title" className="font-bold text-sm sm:text-base">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Supermercado"
              required
              className="border-2 border-foreground h-10 sm:h-11 text-sm sm:text-base"
            />
          </div>

          <div>
            <Label htmlFor="amount" className="font-bold text-sm sm:text-base">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0,00"
              required
              className="border-2 border-foreground h-10 sm:h-11 text-sm sm:text-base"
            />
          </div>

          <div>
            <Label htmlFor="type" className="font-bold text-sm sm:text-base">Tipo</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "income" | "expense") =>
                setFormData({ ...formData, type: value, category: "" })
              }
            >
              <SelectTrigger className="border-2 border-foreground h-10 sm:h-11 text-sm sm:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                <SelectItem value="expense">Despesa</SelectItem>
                <SelectItem value="income">Receita</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category" className="font-bold text-sm sm:text-base">Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="border-2 border-foreground h-10 sm:h-11 text-sm sm:text-base">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="z-[100] max-h-[200px] overflow-y-auto">
                {categories[formData.type].map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-sm sm:text-base">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date" className="font-bold text-sm sm:text-base">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="border-2 border-foreground h-10 sm:h-11 text-sm sm:text-base"
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <Button
            type="submit"
            disabled={!formData.title.trim() || !formData.amount || !formData.category}
            className="w-full bg-foreground hover:bg-foreground/90 text-background font-black h-10 sm:h-11 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            SALVAR TRANSAÇÃO
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
