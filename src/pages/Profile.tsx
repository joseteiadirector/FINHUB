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
      <header className="bg-card border-b-4 border-foreground p-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-foreground/10"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-3xl font-black text-foreground">PERFIL</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6 animate-fade-in">
        <Card className="p-6 text-center bg-card animate-scale-in border-4 border-foreground shadow-xl">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Avatar className="w-24 h-24 border-4 border-foreground shadow-lg">
              <AvatarImage src={profile?.avatar_url || undefined} alt="Avatar" />
              <AvatarFallback className="bg-foreground text-background text-3xl font-black">
                {profile?.full_name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={handleAvatarClick}
              disabled={uploading}
              className="absolute bottom-0 right-0 p-2 bg-foreground text-background rounded-full hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Camera size={18} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <h2 className="text-4xl font-black text-foreground mb-1">
            {profile?.full_name?.toUpperCase() || "USUÁRIO"}
          </h2>
          <p className="text-base font-bold text-foreground/70">✉️ {user?.email}</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-foreground rounded-full">
            <span className="text-sm font-bold text-background">⭐ MEMBRO DESDE NOV 2024</span>
          </div>
        </Card>

        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card 
                key={item.title} 
                className="p-4 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group animate-fade-in border-4 border-foreground hover:bg-foreground/5"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-foreground rounded-2xl group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <Icon className="text-background" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg text-foreground group-hover:text-foreground/80 transition-colors">{item.title}</h3>
                    <p className="text-sm font-semibold text-foreground/60 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Button 
          variant="outline" 
          className="w-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all hover:scale-105 font-black text-base border-4 border-foreground" 
          size="lg"
          onClick={handleLogout}
        >
          <LogOut className="mr-2" size={22} />
          SAIR DA CONTA
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
