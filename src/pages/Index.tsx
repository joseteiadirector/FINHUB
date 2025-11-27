import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-financial.jpg";
import iconCard from "@/assets/icon-card.jpg";
import iconSecurity from "@/assets/icon-security.jpg";
import iconCashback from "@/assets/icon-cashback.jpg";
import { ArrowRight, Zap, Shield, Gift } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 z-0"></div>
        <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Seu hub financeiro completo
              </h1>
              <p className="text-xl text-muted-foreground">
                Controle total dos seus gastos, extrato inteligível e todos os serviços financeiros em um só lugar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/dashboard")}
                  className="text-lg"
                >
                  Começar agora <ArrowRight className="ml-2" size={20} />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg"
                >
                  Saber mais
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="FinHub App" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-foreground mb-12">
            Tudo que você precisa para controlar suas finanças
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden">
                <img src={iconCard} alt="Pagamentos" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Pagamentos Instantâneos</h3>
              <p className="text-muted-foreground">
                PIX, boletos, recargas e muito mais com apenas alguns toques
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden">
                <img src={iconSecurity} alt="Segurança" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Segurança Garantida</h3>
              <p className="text-muted-foreground">
                Seus dados protegidos com a mais alta tecnologia de segurança
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden">
                <img src={iconCashback} alt="Cashback" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Cashback em Compras</h3>
              <p className="text-muted-foreground">
                Ganhe de volta em cada compra e economize ainda mais
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-foreground mb-12">
            Todos os serviços em um único app
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "PIX", desc: "Transferências instantâneas 24/7" },
              { icon: Shield, title: "Seguros", desc: "Proteja o que é importante" },
              { icon: Gift, title: "Cashback", desc: "Ganhe em cada compra" },
              { icon: "💳", title: "Pagamentos", desc: "Pague contas sem sair de casa" },
              { icon: "📱", title: "Recargas", desc: "Celular e transporte" },
              { icon: "💰", title: "Empréstimos", desc: "Crédito quando precisar" },
            ].map((service, index) => (
              <div 
                key={index}
                className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-border"
              >
                <div className="flex items-center gap-4">
                  {typeof service.icon === 'string' ? (
                    <span className="text-4xl">{service.icon}</span>
                  ) : (
                    <service.icon className="text-primary" size={32} />
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-6">
            Pronto para transformar sua vida financeira?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Junte-se a milhares de usuários que já controlam suas finanças com FinHub
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate("/dashboard")}
            className="text-lg"
          >
            Começar gratuitamente <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 FinHub. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
