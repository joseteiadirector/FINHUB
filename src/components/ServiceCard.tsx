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
      className="p-4 hover:shadow-md transition-all cursor-pointer hover:scale-105 duration-200"
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center gap-2">
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="text-primary" size={24} />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
};
