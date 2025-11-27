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
      <header className="bg-card border-b-4 border-foreground p-6 sticky top-0 z-10 shadow-xl">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="border-4 border-foreground hover:bg-foreground hover:text-background transition-all"
          >
            <ArrowLeft size={24} strokeWidth={3} />
          </Button>
          <h1 className="text-3xl font-black text-foreground">SERVIÇOS</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-6 animate-fade-in">
        <div className="bg-card rounded-2xl p-5 mb-8 animate-scale-in border-4 border-foreground shadow-xl">
          <p className="text-base text-foreground font-black text-center">
            💎 TODOS OS SERVIÇOS FINANCEIROS EM UM SÓ LUGAR
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {services.map((service, index) => (
            <div 
              key={service.title}
              className="animate-scale-in"
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
