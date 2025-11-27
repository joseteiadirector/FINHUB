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
    <Card className="bg-foreground p-6 text-background shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-300 border-4 border-foreground">
      <div className="flex justify-between items-start mb-4">
        <div className="transition-all duration-300">
          <p className="text-base font-bold opacity-90 mb-2 uppercase">💰 SALDO DISPONÍVEL</p>
          <h2 className="text-6xl font-black transition-all duration-300">
            {showBalance ? `R$ ${balance.toFixed(2).replace('.', ',')}` : 'R$ ••••••'}
          </h2>
        </div>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="p-3 hover:bg-background/20 rounded-2xl transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label={showBalance ? "Ocultar saldo" : "Mostrar saldo"}
        >
          {showBalance ? <EyeOff size={26} /> : <Eye size={26} />}
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t-2 border-background/30">
        <div>
          <p className="text-sm font-bold opacity-75 mb-1 uppercase">RECEITAS</p>
          <p className="text-2xl font-black">
            {showBalance ? `R$ ${income.toFixed(2).replace('.', ',')}` : 'R$ ••••••'}
          </p>
        </div>
        <div>
          <p className="text-sm font-bold opacity-75 mb-1 uppercase">DESPESAS</p>
          <p className="text-2xl font-black">
            {showBalance ? `R$ ${expenses.toFixed(2).replace('.', ',')}` : 'R$ ••••••'}
          </p>
        </div>
      </div>
    </Card>
  );
};
