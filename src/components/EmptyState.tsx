import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-scale-in">
        <Icon className="text-primary" size={40} />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="hover:scale-105 transition-transform">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
