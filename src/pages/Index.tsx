import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Wallet, TrendingUp, Shield, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary),0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(var(--secondary),0.08),transparent_50%)]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float opacity-20">
        <Wallet size={60} className="text-primary" />
      </div>
      <div className="absolute bottom-32 right-16 animate-float opacity-20" style={{ animationDelay: '1s' }}>
        <TrendingUp size={50} className="text-secondary" />
      </div>
      <div className="absolute top-1/3 right-1/4 animate-float opacity-20" style={{ animationDelay: '2s' }}>
        <Shield size={45} className="text-accent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto animate-fade-in">
        {/* Logo Icon */}
        <div className="mb-8 flex justify-center animate-scale-in">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-primary to-primary/80 p-6 rounded-3xl shadow-2xl">
              <Sparkles size={48} className="text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-4 tracking-tight">
          FinHub
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-3 font-light">
          Seu assistente financeiro inteligente
        </p>
        
        <p className="text-base md:text-lg text-muted-foreground/80 mb-12 max-w-xl mx-auto">
          Controle total dos seus gastos, extrato inteligível e todos os serviços financeiros em um único lugar.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto min-w-[180px] h-14 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Entrar
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto min-w-[180px] h-14 text-lg rounded-full border-2 hover:bg-accent/10 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Cadastrar
          </Button>
        </div>

        {/* Features Pills */}
        <div className="mt-16 flex flex-wrap justify-center gap-3">
          <div className="px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border border-border/50 text-sm text-muted-foreground">
            ✨ Categorização automática
          </div>
          <div className="px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border border-border/50 text-sm text-muted-foreground">
            🔒 100% seguro
          </div>
          <div className="px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border border-border/50 text-sm text-muted-foreground">
            💰 Insights personalizados
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
