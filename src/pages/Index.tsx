import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import heroBackground from "@/assets/hero-background.png";
import { WelcomeAudio } from "@/components/WelcomeAudio";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setAuthLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });

    setAuthLoading(false);

    if (error) {
      toast({
        title: "Erro ao entrar",
        description: error.message === "Invalid login credentials" 
          ? "Email ou senha incorretos." 
          : error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Login realizado!",
      description: "Bem-vindo de volta ao FinHub.",
    });
    setAuthModalOpen(false);
    navigate("/dashboard");
  };

  const handleDirectAccess = async () => {
    setAuthLoading(true);
    
    // Direct access with creator credentials
    const { error } = await supabase.auth.signInWithPassword({
      email: "jose.vev26@gmail.com",
      password: "creator123",
    });

    setAuthLoading(false);

    if (error) {
      toast({
        title: "Acesso direto indisponível",
        description: "Use o login normal ou crie uma conta.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Acesso direto!",
      description: "Bem-vindo ao FinHub.",
    });
    navigate("/dashboard");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupData.fullName || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas digitadas são diferentes.",
        variant: "destructive",
      });
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setAuthLoading(true);

    const { error } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: signupData.fullName,
        },
      },
    });

    setAuthLoading(false);

    if (error) {
      toast({
        title: "Erro ao cadastrar",
        description: error.message === "User already registered" 
          ? "Este email já está cadastrado." 
          : error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Cadastro realizado!",
      description: "Bem-vindo ao FinHub.",
    });
    setAuthModalOpen(false);
    navigate("/dashboard");
  };

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
        <p className="text-lg md:text-xl text-foreground/90 mb-2 font-bold drop-shadow-lg">
          Seu assistente financeiro inteligente
        </p>
        
        <p className="text-sm md:text-base text-foreground/75 mb-8 max-w-xl mx-auto drop-shadow-md font-semibold">
          Controle total dos seus gastos, extrato inteligível e todos os serviços financeiros em um único lugar.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
          <Button 
            size="lg" 
            onClick={handleDirectAccess}
            disabled={authLoading}
            className="w-full sm:w-auto min-w-[160px] h-12 text-base rounded-full bg-primary hover:bg-primary/90 shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Entrar
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => setAuthModalOpen(true)}
            className="w-full sm:w-auto min-w-[160px] h-12 text-base rounded-full border-2 bg-background/80 backdrop-blur-sm hover:bg-background shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Cadastrar
          </Button>
          <WelcomeAudio />
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

      {/* Auth Modal */}
      <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">FinHub</DialogTitle>
            <DialogDescription className="text-center">
              Seu assistente financeiro inteligente
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    disabled={authLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    disabled={authLoading}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={authLoading}>
                  {authLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nome completo</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="João Silva"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    disabled={authLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    disabled={authLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    disabled={authLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirmar senha</Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    disabled={authLoading}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={authLoading}>
                  {authLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    "Criar conta"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
