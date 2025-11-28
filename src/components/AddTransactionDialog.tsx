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
    
    const result = await addTransaction({
      title: formData.title,
      amount: parseFloat(formData.amount),
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-foreground hover:bg-foreground/90 text-background font-black h-12 border-2 border-foreground">
          <Plus className="mr-2" size={20} />
          ADICIONAR TRANSAÇÃO
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-4 border-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-foreground">
            NOVA TRANSAÇÃO
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="font-bold">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Supermercado"
              required
              className="border-2 border-foreground"
            />
          </div>

          <div>
            <Label htmlFor="amount" className="font-bold">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0,00"
              required
              className="border-2 border-foreground"
            />
          </div>

          <div>
            <Label htmlFor="type" className="font-bold">Tipo</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "income" | "expense") =>
                setFormData({ ...formData, type: value, category: "" })
              }
            >
              <SelectTrigger className="border-2 border-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Despesa</SelectItem>
                <SelectItem value="income">Receita</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category" className="font-bold">Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="border-2 border-foreground">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories[formData.type].map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date" className="font-bold">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="border-2 border-foreground"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-foreground hover:bg-foreground/90 text-background font-black h-11"
          >
            SALVAR TRANSAÇÃO
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
