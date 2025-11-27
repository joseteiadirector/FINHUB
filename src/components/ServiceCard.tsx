import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
}

export const ServiceCard = ({ icon: Icon, title, description, onClick }: ServiceCardProps) => {
  return (
    <Card 
      className="p-5 hover:shadow-xl transition-all cursor-pointer hover:scale-105 duration-300 hover:-translate-y-1 group animate-scale-in border-2 hover:border-primary/20"
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
          <Icon className="text-primary group-hover:text-primary transition-colors" size={28} />
        </div>
        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </Card>
  );
};
