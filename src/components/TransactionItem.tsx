import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface TransactionItemProps {
  title: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  category: string;
}

export const TransactionItem = ({ title = '', date = '', amount = 0, type = 'expense', category = '' }: TransactionItemProps) => {
  // Garantir valores válidos
  const safeTitle = typeof title === 'string' ? title : 'Transação';
  const safeDate = typeof date === 'string' ? date : new Date().toLocaleDateString('pt-BR');
  const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const safeType = type === 'income' || type === 'expense' ? type : 'expense';
  const safeCategory = typeof category === 'string' && category ? category : 'Outros';

  const formatCurrency = (value: number) => {
    try {
      return value.toFixed(2).replace('.', ',');
    } catch (error) {
      console.error('Error formatting currency:', error);
      return '0,00';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 sm:p-4 hover:bg-muted/50 rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer group animate-fade-in touch-manipulation">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <div className={`p-2 sm:p-2.5 rounded-full transition-all duration-200 group-hover:scale-110 flex-shrink-0 ${safeType === "income" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
          {safeType === "income" ? (
            <ArrowDownLeft className="text-green-600 dark:text-green-400" size={18} />
          ) : (
            <ArrowUpRight className="text-red-600 dark:text-red-400" size={18} />
          )}
        </div>
        <div className="transition-all duration-200 flex-1 min-w-0">
          <p className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors truncate">{safeTitle}</p>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            <span className="inline-block mr-1">📁</span>
            {safeCategory} • {safeDate}
          </p>
        </div>
      </div>
      <p className={`font-black text-base sm:text-lg transition-all duration-200 group-hover:scale-110 flex-shrink-0 ml-2 ${safeType === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
        {safeType === "income" ? "+" : "-"} R$ {formatCurrency(safeAmount)}
      </p>
    </div>
  );
};
