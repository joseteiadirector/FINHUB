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
      className="p-6 transition-all cursor-pointer group animate-scale-in border-4 border-foreground bg-card hover:bg-foreground hover:shadow-2xl duration-300 relative overflow-hidden"
      onClick={onClick}
    >
      {/* Efeito de brilho no hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex flex-col items-center text-center gap-3">
        <div className="p-5 bg-background rounded-2xl group-hover:bg-background/90 transition-all duration-300 group-hover:scale-110 border-2 border-foreground shadow-lg">
          <Icon className="text-foreground transition-transform duration-300 group-hover:rotate-12" size={40} strokeWidth={2.5} />
        </div>
        <h3 className="font-black text-xl text-foreground group-hover:text-background transition-colors duration-300">{title}</h3>
        <p className="text-sm text-foreground/70 group-hover:text-background/80 leading-relaxed font-semibold transition-colors duration-300">{description}</p>
      </div>
    </Card>
  );
};
