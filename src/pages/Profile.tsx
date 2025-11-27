import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, User, Bell, Lock, HelpCircle, LogOut, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null);
  const { uploadAvatar, uploading } = useAvatarUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) setProfile(data);
        });
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const avatarUrl = await uploadAvatar(file, user.id);
      if (avatarUrl) {
        setProfile((prev) => prev ? { ...prev, avatar_url: avatarUrl } : null);
      }
    }
  };

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
          <h1 className="text-2xl font-display font-bold text-foreground uppercase tracking-tight">Perfil</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6 animate-fade-in">
        <Card className="p-6 text-center bg-gradient-to-br from-card to-card/50 animate-scale-in">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile?.avatar_url || undefined} alt="Avatar" />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-2xl">
                {profile?.full_name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={handleAvatarClick}
              disabled={uploading}
              className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <h2 className="text-3xl font-display font-bold text-foreground mb-1 uppercase tracking-tight">
            {profile?.full_name || "Usuário"}
          </h2>
          <p className="text-sm font-condensed text-muted-foreground font-semibold">✉️ {user?.email}</p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <span className="text-xs font-condensed font-bold text-primary uppercase">⭐ Membro desde Nov 2024</span>
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
                    <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">{item.title}</h3>
                    <p className="text-xs font-condensed text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Button 
          variant="outline" 
          className="w-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all hover:scale-105 font-condensed font-bold uppercase tracking-wide" 
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
