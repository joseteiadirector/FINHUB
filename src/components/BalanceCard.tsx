import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";

interface BalanceCardProps {
  balance: number;
  income: number;
  expenses: number;
}

export const BalanceCard = ({ balance, income, expenses }: BalanceCardProps) => {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <Card className="bg-gradient-to-br from-primary via-primary to-primary/80 p-6 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="transition-all duration-300">
          <p className="text-sm opacity-90 mb-2 font-medium">💰 Saldo disponível</p>
          <h2 className="text-4xl font-bold transition-all duration-300">
            {showBalance ? `R$ ${balance.toFixed(2).replace('.', ',')}` : 'R$ ••••••'}
          </h2>
        </div>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="p-2.5 hover:bg-primary-foreground/20 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label={showBalance ? "Ocultar saldo" : "Mostrar saldo"}
        >
          {showBalance ? <EyeOff size={22} /> : <Eye size={22} />}
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-primary-foreground/20">
        <div>
          <p className="text-xs opacity-75 mb-1">Receitas</p>
          <p className="text-lg font-semibold">
            {showBalance ? `R$ ${income.toFixed(2).replace('.', ',')}` : 'R$ ••••••'}
          </p>
        </div>
        <div>
          <p className="text-xs opacity-75 mb-1">Despesas</p>
          <p className="text-lg font-semibold">
            {showBalance ? `R$ ${expenses.toFixed(2).replace('.', ',')}` : 'R$ ••••••'}
          </p>
        </div>
      </div>
    </Card>
  );
};
