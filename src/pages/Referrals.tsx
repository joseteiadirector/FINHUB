import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Users, Gift, Sparkles, MessageCircle, Mail, ArrowLeft } from "lucide-react";
import { useReferrals } from "@/hooks/useReferrals";
import { ReferralProgress } from "@/components/ReferralProgress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const emailSchema = z.object({
  recipientEmail: z.string().trim().email({ message: "Email inválido" }).max(255),
  recipientName: z.string().trim().min(1, { message: "Nome não pode estar vazio" }).max(100),
});

const Referrals = () => {
  const { stats, loading, getReferralLink, copyReferralLink, unlockBronzeBadge, hasExampleReferral } = useReferrals();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [isSending, setIsSending] = useState(false);

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

  const handleSendEmail = async () => {
    try {
      // Validar dados
      const validated = emailSchema.parse({
        recipientEmail: recipientEmail.trim(),
        recipientName: recipientName.trim(),
      });

      setIsSending(true);

      // Desbloquear emblema Bronze na primeira vez
      const isFirstShare = stats?.referralCount === 0 && !hasExampleReferral;
      
      const { data, error } = await supabase.functions.invoke("send-referral-email", {
        body: {
          recipientEmail: validated.recipientEmail,
          recipientName: validated.recipientName,
          referralLink: getReferralLink(),
          senderName: user?.user_metadata?.full_name || "Um amigo",
        },
      });

      if (error) throw error;

      // Se é a primeira vez, desbloquear emblema Bronze
      if (isFirstShare) {
        await unlockBronzeBadge();
      } else {
        toast({
          title: "✉️ Email enviado com sucesso!",
          description: `O convite foi enviado para ${validated.recipientEmail}`,
        });
      }

      // Limpar campos e fechar modal
      setRecipientEmail("");
      setRecipientName("");
      setIsEmailDialogOpen(false);
    } catch (error: any) {
      console.error("Error sending email:", error);
      
      if (error instanceof z.ZodError) {
        toast({
          title: "Erro de validação",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao enviar email",
          description: "Não foi possível enviar o convite. Tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Botão Voltar */}
        <Button
          onClick={() => navigate("/dashboard")}
          variant="ghost"
          className="font-bold gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          VOLTAR
        </Button>

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

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={copyReferralLink}
              className="font-bold"
              variant="outline"
            >
              <Copy className="w-4 h-4 mr-2" />
              COPIAR LINK
            </Button>
            
            <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
              <DialogTrigger asChild>
                <Button className="font-bold" variant="default">
                  <Mail className="w-4 h-4 mr-2" />
                  ENVIAR EMAIL
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black">
                    📧 Enviar Convite por Email
                  </DialogTitle>
                  <DialogDescription className="font-bold">
                    Digite o email e nome da pessoa que você quer convidar para o FinHub.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient-name" className="font-bold">
                      Nome do destinatário
                    </Label>
                    <Input
                      id="recipient-name"
                      placeholder="Ex: João Silva"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      disabled={isSending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient-email" className="font-bold">
                      Email do destinatário
                    </Label>
                    <Input
                      id="recipient-email"
                      type="email"
                      placeholder="exemplo@email.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      disabled={isSending}
                    />
                  </div>
                  <Button
                    onClick={handleSendEmail}
                    className="w-full font-bold"
                    disabled={isSending || !recipientEmail.trim() || !recipientName.trim()}
                  >
                    {isSending ? "Enviando..." : "Enviar Convite"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <p className="font-bold text-sm">💡 COMPARTILHE NO WHATSAPP:</p>
            </div>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Copie seu link mágico acima</li>
              <li>Cole no WhatsApp e envie para amigos</li>
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
