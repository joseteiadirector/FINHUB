import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Users, Gift, Sparkles } from "lucide-react";
import { useReferrals } from "@/hooks/useReferrals";
import { ReferralProgress } from "@/components/ReferralProgress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const Referrals = () => {
  const { stats, loading, getReferralLink, copyReferralLink } = useReferrals();

  if (loading) {
    return (
      <div className="min-h-screen pb-24 pt-6 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    const link = getReferralLink();
    const text = `Junte-se ao FinHub! Use meu link de indicação e gerencie suas finanças com inteligência: ${link}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "FinHub - Convite de Indicação",
          text: text,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      copyReferralLink();
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black flex items-center justify-center gap-2">
            <Gift className="w-8 h-8" />
            INDICAÇÕES
          </h1>
          <p className="text-lg font-bold opacity-75">
            Compartilhe o FinHub e ganhe emblemas exclusivos!
          </p>
        </div>

        {/* Progress Card */}
        <Card className="p-6 bg-card border-4">
          <ReferralProgress
            referralCount={stats?.referralCount || 0}
            badgeLevel={stats?.badgeLevel || 'none'}
          />
        </Card>

        {/* Referral Link Card */}
        <Card className="p-6 bg-card border-4 space-y-4">
          <div className="flex items-center gap-2 text-xl font-black">
            <Sparkles className="w-6 h-6" />
            <h2>SEU LINK MÁGICO</h2>
          </div>
          
          <div className="bg-muted p-4 rounded-lg font-mono text-sm break-all">
            {getReferralLink()}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={copyReferralLink}
              className="flex-1 font-bold"
              variant="outline"
            >
              <Copy className="w-4 h-4 mr-2" />
              COPIAR LINK
            </Button>
            <Button
              onClick={handleShare}
              className="flex-1 font-bold"
            >
              <Share2 className="w-4 h-4 mr-2" />
              COMPARTILHAR
            </Button>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg space-y-2">
            <p className="font-bold text-sm">💡 COMO FUNCIONA:</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Compartilhe seu link mágico com amigos</li>
              <li>Quando eles se cadastrarem, você ganha 1 ponto</li>
              <li>Acumule pontos e desbloqueie emblemas exclusivos!</li>
            </ul>
          </div>
        </Card>

        {/* Referrals List */}
        <Card className="p-6 bg-card border-4">
          <div className="flex items-center gap-2 text-xl font-black mb-4">
            <Users className="w-6 h-6" />
            <h2>SUAS INDICAÇÕES ({stats?.referralCount || 0})</h2>
          </div>

          {!stats?.referrals || stats.referrals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="font-bold">Nenhuma indicação ainda</p>
              <p className="text-sm">Compartilhe seu link para começar!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.referrals.map((referral: any) => (
                <div
                  key={referral.id}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                >
                  <Avatar>
                    <AvatarImage src={referral.referred_user?.avatar_url} />
                    <AvatarFallback>
                      {referral.referred_user?.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-bold">
                      {referral.referred_user?.full_name || "Usuário"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(referral.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Referrals;
