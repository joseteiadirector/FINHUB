import { ServiceCard } from "@/components/ServiceCard";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Smartphone, CreditCard, Gift, Shield, DollarSign, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Services = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleServiceClick = (serviceName: string, route?: string) => {
    if (route) {
      navigate(route);
    } else {
      toast({
        title: `${serviceName} em breve!`,
        description: "Esta funcionalidade estará disponível em breve.",
      });
    }
  };

  const services = [
    { icon: Zap, title: "PIX", description: "Transferências instantâneas", route: "/pix" },
    { icon: CreditCard, title: "Pagamentos", description: "Pague suas contas", route: "/bill-payment" },
    { icon: Smartphone, title: "Recargas", description: "Celular, transporte e mais", route: "/recharge" },
    { icon: Gift, title: "Cashback", description: "Ganhe de volta em compras" },
    { icon: Shield, title: "Seguros", description: "Proteja o que importa" },
    { icon: DollarSign, title: "Empréstimos", description: "Crédito quando precisar" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Serviços</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 animate-fade-in">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 mb-6 animate-scale-in">
          <p className="text-sm text-foreground font-medium">
            💎 Todos os serviços financeiros em um só lugar
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {services.map((service, index) => (
            <div 
              key={service.title}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                onClick={() => handleServiceClick(service.title, service.route)}
              />
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Services;
