import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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

      setStats({
        referralCode: profile?.referral_code || "",
        referralCount: statsData?.referral_count || 0,
        badgeLevel: (statsData?.badge_level || 'none') as 'none' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond',
        referrals: referralsWithProfiles,
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

  const copyReferralLink = async () => {
    const link = getReferralLink();
    try {
      await navigator.clipboard.writeText(link);
      
      // Criar indicação de exemplo na primeira cópia
      if (stats?.referralCount === 0) {
        try {
          // Criar um usuário fictício de exemplo
          const { error } = await supabase
            .from("referrals")
            .insert({
              referrer_id: user?.id,
              referred_user_id: '00000000-0000-0000-0000-000000000001' // ID fictício
            });
          
          if (!error) {
            toast({
              title: "🎉 Link copiado + Emblema Bronze desbloqueado!",
              description: "Indicação de exemplo criada! Compartilhe seu link de verdade para ganhar mais emblemas.",
            });
            // Recarregar stats
            setTimeout(() => fetchReferralStats(), 500);
          } else {
            toast({
              title: "Link copiado!",
              description: "O link de indicação foi copiado para a área de transferência",
            });
          }
        } catch (err) {
          toast({
            title: "Link copiado!",
            description: "O link de indicação foi copiado para a área de transferência",
          });
        }
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
  };
};
