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
    <div className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${type === "income" ? "bg-green-100" : "bg-red-100"}`}>
          {type === "income" ? (
            <ArrowDownLeft className="text-green-600" size={20} />
          ) : (
            <ArrowUpRight className="text-red-600" size={20} />
          )}
        </div>
        <div>
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{category} • {date}</p>
        </div>
      </div>
      <p className={`font-semibold ${type === "income" ? "text-green-600" : "text-red-600"}`}>
        {type === "income" ? "+" : "-"} R$ {amount.toFixed(2).replace('.', ',')}
      </p>
    </div>
  );
};
