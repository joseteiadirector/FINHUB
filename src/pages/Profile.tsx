import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, User, Bell, Lock, HelpCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) setProfile(data);
        });
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    navigate("/");
  };

  const menuItems = [
    { icon: User, title: "Dados pessoais", description: "Edite suas informações" },
    { icon: Bell, title: "Notificações", description: "Configure alertas" },
    { icon: Lock, title: "Segurança", description: "Senha e privacidade" },
    { icon: HelpCircle, title: "Ajuda", description: "Central de suporte" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Perfil</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6 animate-fade-in">
        <Card className="p-6 text-center bg-gradient-to-br from-card to-card/50 animate-scale-in">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mx-auto flex items-center justify-center mb-4 hover:scale-110 transition-transform">
            <User className="text-primary" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">
            {profile?.full_name || "Usuário"}
          </h2>
          <p className="text-sm text-muted-foreground">✉️ {user?.email}</p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <span className="text-xs font-medium text-primary">⭐ Membro desde Nov 2024</span>
          </div>
        </Card>

        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card 
                key={item.title} 
                className="p-4 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group animate-fade-in border-2 hover:border-primary/20"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                    <Icon className="text-primary" size={22} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Button 
          variant="outline" 
          className="w-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all hover:scale-105" 
          size="lg"
          onClick={handleLogout}
        >
          <LogOut className="mr-2" size={20} />
          Sair da conta
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
