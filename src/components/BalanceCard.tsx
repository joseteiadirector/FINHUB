import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";

interface BalanceCardProps {
  balance: number;
  income: number;
  expenses: number;
}

export const BalanceCard = ({ balance = 0, income = 0, expenses = 0 }: BalanceCardProps) => {
  const [showBalance, setShowBalance] = useState(true);

  // Garantir valores numéricos válidos
  const safeBalance = typeof balance === 'number' && !isNaN(balance) ? balance : 0;
  const safeIncome = typeof income === 'number' && !isNaN(income) ? income : 0;
  const safeExpenses = typeof expenses === 'number' && !isNaN(expenses) ? expenses : 0;

  const formatCurrency = (value: number) => {
    try {
      return value.toFixed(2).replace('.', ',');
    } catch (error) {
      console.error('Error formatting currency:', error);
      return '0,00';
    }
  };

  return (
    <Card className="bg-foreground p-4 sm:p-6 text-background shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-300 border-3 sm:border-4 border-foreground">
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className="transition-all duration-300 flex-1 min-w-0">
          <p className="text-xs sm:text-base font-bold opacity-90 mb-1 sm:mb-2 uppercase">💰 SALDO DISPONÍVEL</p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black transition-all duration-300 break-words">
            {showBalance ? `R$ ${formatCurrency(safeBalance)}` : 'R$ ••••••'}
          </h2>
        </div>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="p-2 sm:p-3 hover:bg-background/20 rounded-xl sm:rounded-2xl transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0 touch-manipulation"
          aria-label={showBalance ? "Ocultar saldo" : "Mostrar saldo"}
        >
          {showBalance ? <EyeOff size={20} className="sm:w-[26px] sm:h-[26px]" /> : <Eye size={20} className="sm:w-[26px] sm:h-[26px]" />}
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t-2 border-background/30">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-bold opacity-75 mb-1 uppercase truncate">RECEITAS</p>
          <p className="text-xl sm:text-2xl font-black break-words">
            {showBalance ? `R$ ${formatCurrency(safeIncome)}` : 'R$ ••••••'}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-bold opacity-75 mb-1 uppercase truncate">DESPESAS</p>
          <p className="text-xl sm:text-2xl font-black break-words">
            {showBalance ? `R$ ${formatCurrency(safeExpenses)}` : 'R$ ••••••'}
          </p>
        </div>
      </div>
    </Card>
  );
};
