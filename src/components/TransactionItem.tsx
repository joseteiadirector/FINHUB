import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface TransactionItemProps {
  title: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  category: string;
}

export const TransactionItem = ({ title, date, amount, type, category }: TransactionItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer group animate-fade-in">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-full transition-all duration-200 group-hover:scale-110 ${type === "income" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
          {type === "income" ? (
            <ArrowDownLeft className="text-green-600 dark:text-green-400" size={20} />
          ) : (
            <ArrowUpRight className="text-red-600 dark:text-red-400" size={20} />
          )}
        </div>
        <div className="transition-all duration-200">
          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{title}</p>
          <p className="text-sm text-muted-foreground">
            <span className="inline-block mr-1">📁</span>
            {category} • {date}
          </p>
        </div>
      </div>
      <p className={`font-bold text-lg transition-all duration-200 group-hover:scale-110 ${type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
        {type === "income" ? "+" : "-"} R$ {amount.toFixed(2).replace('.', ',')}
      </p>
    </div>
  );
};
