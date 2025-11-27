import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, User, Bell, Lock, HelpCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

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

      <main className="max-w-md mx-auto p-4 space-y-6">
        <Card className="p-6 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
            <User className="text-primary" size={40} />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">João Silva</h2>
          <p className="text-sm text-muted-foreground">joao.silva@email.com</p>
          <p className="text-xs text-muted-foreground mt-2">Membro desde Nov 2024</p>
        </Card>

        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="text-primary" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Button variant="outline" className="w-full" size="lg">
          <LogOut className="mr-2" size={20} />
          Sair da conta
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
