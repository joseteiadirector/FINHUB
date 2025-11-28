import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Shield, Car, Home, Heart, Smartphone, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Insurance = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [quoteValue, setQuoteValue] = useState("");
  const [showQuote, setShowQuote] = useState(false);

  const insuranceTypes = [
    {
      id: "auto",
      title: "Seguro Auto",
      icon: Car,
      description: "Proteção completa para seu veículo",
      monthlyPrice: 89.90,
      coverage: ["Colisão", "Roubo/Furto", "Terceiros", "Assistência 24h"],
      color: "bg-blue-500"
    },
    {
      id: "residencial",
      title: "Seguro Residencial",
      icon: Home,
      description: "Proteja sua casa e família",
      monthlyPrice: 45.00,
      coverage: ["Incêndio", "Roubo", "Danos elétricos", "Responsabilidade civil"],
      color: "bg-green-500"
    },
    {
      id: "vida",
      title: "Seguro de Vida",
      icon: Heart,
      description: "Segurança para quem você ama",
      monthlyPrice: 67.50,
      coverage: ["Morte", "Invalidez", "Doenças graves", "Cobertura funeral"],
      color: "bg-red-500"
    },
    {
      id: "celular",
      title: "Seguro Celular",
      icon: Smartphone,
      description: "Proteja seu smartphone",
      monthlyPrice: 19.90,
      coverage: ["Quebra de tela", "Roubo/Furto", "Oxidação", "Assistência técnica"],
      color: "bg-purple-500"
    }
  ];

  const handleGetQuote = (insuranceId: string) => {
    const insurance = insuranceTypes.find(i => i.id === insuranceId);
    if (!insurance) return;

    setSelectedType(insuranceId);
    setShowQuote(false);
    
    toast({
      title: "Simulando cotação...",
      description: `Calculando melhor plano para ${insurance.title}`,
    });

    setTimeout(() => {
      setShowQuote(true);
      toast({
        title: "✅ Cotação pronta!",
        description: "Veja os detalhes abaixo",
      });
    }, 1500);
  };

  const handleHireInsurance = () => {
    const insurance = insuranceTypes.find(i => i.id === selectedType);
    toast({
      title: "✅ Contrato enviado!",
      description: "O contrato do seu seguro será enviado ao seu email cadastrado.",
    });
  };

  const selectedInsurance = insuranceTypes.find(i => i.id === selectedType);

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="bg-card border-b-4 border-foreground p-6 sticky top-0 z-10 shadow-xl">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/services")}
            className="border-4 border-foreground hover:bg-foreground hover:text-background"
          >
            <ArrowLeft size={24} strokeWidth={3} />
          </Button>
          <h1 className="text-3xl font-black text-foreground">SEGUROS</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-6 space-y-6">
        {/* Hero */}
        <Card className="p-6 border-4 border-foreground bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="text-center space-y-2">
            <Shield className="mx-auto text-blue-600" size={48} strokeWidth={3} />
            <h2 className="text-2xl font-black text-foreground">PROTEJA O QUE IMPORTA</h2>
            <p className="text-sm font-bold text-foreground/70">
              Seguros com cobertura completa e preços acessíveis
            </p>
          </div>
        </Card>

        {/* Tipos de Seguro */}
        {!showQuote && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-foreground">ESCOLHA SEU SEGURO</h3>
            
            {insuranceTypes.map((insurance, index) => {
              const Icon = insurance.icon;
              
              return (
                <Card 
                  key={insurance.id}
                  className="p-5 border-4 border-foreground bg-card hover:shadow-xl hover:-translate-y-1 transition-all"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl ${insurance.color}`}>
                      <Icon className="text-white" size={28} strokeWidth={3} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-black text-foreground mb-1">
                        {insurance.title}
                      </h4>
                      <p className="text-sm font-bold text-foreground/70 mb-2">
                        {insurance.description}
                      </p>
                      <Badge className="bg-foreground text-background font-black">
                        R$ {insurance.monthlyPrice.toFixed(2)}/mês
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-black text-foreground/60">COBERTURAS:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {insurance.coverage.map(item => (
                        <div key={item} className="flex items-center gap-1 text-xs font-bold text-foreground/70">
                          <Check size={14} className="text-green-600" strokeWidth={3} />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleGetQuote(insurance.id)}
                    className="w-full bg-foreground hover:bg-foreground/90 text-background font-black"
                  >
                    SIMULAR COTAÇÃO
                  </Button>
                </Card>
              );
            })}
          </div>
        )}

        {/* Cotação Detalhada */}
        {showQuote && selectedInsurance && (
          <div className="space-y-4 animate-fade-in">
            <Button
              variant="outline"
              onClick={() => {
                setShowQuote(false);
                setSelectedType(null);
              }}
              className="border-2 border-foreground font-black"
            >
              ← Voltar para seguros
            </Button>

            <Card className="p-6 border-4 border-green-500 bg-green-50">
              <div className="text-center space-y-2">
                <Badge className="bg-green-600 text-white font-black mb-2">
                  COTAÇÃO APROVADA
                </Badge>
                <h3 className="text-2xl font-black text-foreground">
                  {selectedInsurance.title}
                </h3>
                <div className="text-4xl font-black text-green-600">
                  R$ {selectedInsurance.monthlyPrice.toFixed(2)}
                </div>
                <p className="text-sm font-bold text-foreground/70">por mês</p>
              </div>
            </Card>

            <Card className="p-5 border-4 border-foreground">
              <h4 className="text-lg font-black text-foreground mb-3">
                ✓ COBERTURAS INCLUÍDAS
              </h4>
              <div className="space-y-2">
                {selectedInsurance.coverage.map(item => (
                  <div key={item} className="flex items-center gap-2 p-2 bg-card rounded border-2 border-foreground/20">
                    <Check size={18} className="text-green-600" strokeWidth={3} />
                    <span className="font-bold text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-yellow-50 border-4 border-yellow-500">
              <p className="text-sm font-bold text-yellow-900">
                🎁 <strong>OFERTA ESPECIAL:</strong> Contrate agora e ganhe o primeiro mês com 50% de desconto!
              </p>
            </Card>

            <Button
              onClick={handleHireInsurance}
              className="w-full bg-foreground hover:bg-foreground/90 text-background font-black h-14 text-lg"
            >
              CONTRATAR AGORA
            </Button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Insurance;
