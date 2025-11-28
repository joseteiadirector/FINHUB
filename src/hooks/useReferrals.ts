import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

interface ReferralStats {
  referralCode: string;
  referralCount: number;
  badgeLevel: 'none' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  referrals: Array<{
    id: string;
    created_at: string;
    referred_user: {
      full_name: string;
      avatar_url: string;
    };
  }>;
}

export const useReferrals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasExampleReferral, setHasExampleReferral] = useState(false);

  const fetchReferralStats = async () => {
    if (!user) return;

    try {
      // Get user's referral code
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("referral_code")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      // Get referral stats
      const { data: statsData, error: statsError } = await supabase
        .from("referral_stats")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') throw statsError;

      // Get list of referrals with user details
      const { data: referrals, error: referralsError } = await supabase
        .from("referrals")
        .select("id, created_at, referred_user_id")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false });

      if (referralsError) throw referralsError;

      // Fetch profiles for referred users
      const referredUserIds = referrals?.map(r => r.referred_user_id) || [];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", referredUserIds);

      const referralsWithProfiles = (referrals || []).map(ref => ({
        id: ref.id,
        created_at: ref.created_at,
        referred_user: profiles?.find(p => p.id === ref.referred_user_id) || {
          full_name: "Usuário",
          avatar_url: "",
        },
      }));

      // Adicionar referral de exemplo se ativado
      const finalReferrals = hasExampleReferral 
        ? [
            {
              id: 'example-referral',
              created_at: new Date().toISOString(),
              referred_user: {
                full_name: "🎉 Usuário de Exemplo",
                avatar_url: "",
              }
            },
            ...referralsWithProfiles
          ]
        : referralsWithProfiles;

      const finalCount = (statsData?.referral_count || 0) + (hasExampleReferral ? 1 : 0);
      const badgeLevel = hasExampleReferral && finalCount === 1 
        ? 'bronze' 
        : (statsData?.badge_level || 'none') as 'none' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

      setStats({
        referralCode: profile?.referral_code || "",
        referralCount: finalCount,
        badgeLevel: badgeLevel,
        referrals: finalReferrals,
      });
    } catch (error) {
      console.error("Error fetching referral stats:", error);
      toast({
        title: "Erro ao carregar indicações",
        description: "Não foi possível carregar suas indicações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralStats();
  }, [user]);

  const getReferralLink = () => {
    if (!stats?.referralCode) return "";
    return `${window.location.origin}/?ref=${stats.referralCode}`;
  };

  const unlockBronzeBadge = async () => {
    setHasExampleReferral(true);
    
    // Atualizar stats imediatamente para mostrar o emblema
    if (stats) {
      setStats({
        ...stats,
        referralCount: 1,
        badgeLevel: 'bronze',
        referrals: [
          {
            id: 'example-referral',
            created_at: new Date().toISOString(),
            referred_user: {
              full_name: "🎉 Usuário de Exemplo",
              avatar_url: "",
            }
          },
          ...stats.referrals
        ]
      });
    }
    
    // Disparar confete celebrativo
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF6347', '#4169E1', '#32CD32']
    });
    
    // Enviar email automático de conquista Bronze
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user?.id)
        .single();

      await supabase.functions.invoke("send-referral-email", {
        body: {
          recipientEmail: user?.email || "",
          recipientName: profile?.full_name || "Usuário",
          referralLink: `${window.location.origin}/?ref=${stats?.referralCode}`,
          senderName: "Equipe FinHub",
          isBronzeAchievement: true,
        },
      });
    } catch (error) {
      console.error("Error sending bronze achievement email:", error);
    }
    
    toast({
      title: "🎉 Emblema Bronze desbloqueado!",
      description: "Parabéns! Você ganhou seu primeiro emblema. Continue compartilhando!",
      duration: 5000,
    });
  };

  const copyReferralLink = async () => {
    const link = getReferralLink();
    try {
      await navigator.clipboard.writeText(link);
      
      // Criar indicação de exemplo visual na primeira cópia
      if (stats?.referralCount === 0 && !hasExampleReferral) {
        await unlockBronzeBadge();
      } else {
        toast({
          title: "Link copiado!",
          description: "O link de indicação foi copiado para a área de transferência",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link",
        variant: "destructive",
      });
    }
  };

  return {
    stats,
    loading,
    getReferralLink,
    copyReferralLink,
    refreshStats: fetchReferralStats,
    unlockBronzeBadge,
    hasExampleReferral,
  };
};
