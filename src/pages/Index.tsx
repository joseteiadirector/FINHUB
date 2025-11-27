import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Wallet, TrendingUp, Shield } from "lucide-react";
import heroBackground from "@/assets/hero-background.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden flex items-end justify-center pb-12">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/95"></div>
      </div>


      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto animate-fade-in w-full">
        {/* Brand Name */}
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-3 tracking-tight drop-shadow-2xl">
          FinHub
        </h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-foreground/90 mb-2 font-light drop-shadow-lg">
          Seu assistente financeiro inteligente
        </p>
        
        <p className="text-sm md:text-base text-foreground/75 mb-8 max-w-xl mx-auto drop-shadow-md">
          Controle total dos seus gastos, extrato inteligível e todos os serviços financeiros em um único lugar.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
          <Button 
            size="lg" 
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto min-w-[160px] h-12 text-base rounded-full bg-primary hover:bg-primary/90 shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Entrar
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto min-w-[160px] h-12 text-base rounded-full border-2 bg-background/80 backdrop-blur-sm hover:bg-background shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Cadastrar
          </Button>
        </div>

        {/* Features Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          <div className="px-3 py-1.5 bg-background/70 backdrop-blur-md rounded-full border border-border/30 text-xs text-foreground/80 shadow-lg">
            ✨ Categorização automática
          </div>
          <div className="px-3 py-1.5 bg-background/70 backdrop-blur-md rounded-full border border-border/30 text-xs text-foreground/80 shadow-lg">
            🔒 100% seguro
          </div>
          <div className="px-3 py-1.5 bg-background/70 backdrop-blur-md rounded-full border border-border/30 text-xs text-foreground/80 shadow-lg">
            💰 Insights personalizados
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
