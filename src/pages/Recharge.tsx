import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Smartphone, Bus, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Recharge = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [rechargeType, setRechargeType] = useState<"phone" | "transport">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("");

  const phoneOperators = ["Claro", "Vivo", "TIM", "Oi"];
  const quickAmounts = ["10", "20", "30", "50"];

  const handleConfirm = () => {
    if (rechargeType === "phone" && (!phoneNumber || !amount || !selectedOperator)) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    if (rechargeType === "transport" && (!cardNumber || !amount)) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha número do cartão e valor",
        variant: "destructive",
      });
      return;
    }
    setStep("confirm");
  };

  const handleRecharge = async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Erro de autenticação",
          description: "Faça login para continuar",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Processando...",
        description: "Redirecionando para pagamento",
      });

      const description = rechargeType === "phone" 
        ? `Recarga ${selectedOperator} - ${phoneNumber}`
        : `Recarga transporte - ${cardNumber}`;

      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: {
          amount: parseFloat(amount),
          description,
          productName: "Recarga",
        },
      });

      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, "_blank");
        setStep("success");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível processar a recarga",
        variant: "destructive",
      });
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Recarga realizada!</h2>
          <p className="text-muted-foreground mb-6">
            R$ {parseFloat(amount).toFixed(2).replace('.', ',')} recarregado
          </p>
          <div className="space-y-2 mb-6 text-left bg-muted/50 p-4 rounded-lg">
            {rechargeType === "phone" ? (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Telefone</span>
                  <span className="text-sm font-medium text-foreground">{phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Operadora</span>
                  <span className="text-sm font-medium text-foreground">{selectedOperator}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cartão</span>
                <span className="text-sm font-medium text-foreground">{cardNumber}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Data</span>
              <span className="text-sm font-medium text-foreground">{new Date().toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
          <Button onClick={() => navigate("/dashboard")} className="w-full">
            Voltar ao início
          </Button>
        </Card>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border p-4">
          <div className="max-w-md mx-auto flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setStep("form")}>
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-bold text-foreground">Confirmar recarga</h1>
          </div>
        </header>

        <main className="max-w-md mx-auto p-4 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Detalhes da recarga</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Valor</p>
                <p className="text-3xl font-bold text-foreground">
                  R$ {parseFloat(amount).toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div className="pt-4 border-t border-border space-y-3">
                {rechargeType === "phone" ? (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-medium text-foreground">{phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Operadora</p>
                      <p className="font-medium text-foreground">{selectedOperator}</p>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground">Cartão de transporte</p>
                    <p className="font-medium text-foreground">{cardNumber}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("form")} className="flex-1">
              Voltar
            </Button>
            <Button onClick={handleRecharge} className="flex-1">
              Confirmar recarga
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/services")}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Recargas</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <Tabs value={rechargeType} onValueChange={(v) => setRechargeType(v as typeof rechargeType)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="phone">
              <Smartphone className="mr-2" size={16} />
              Celular
            </TabsTrigger>
            <TabsTrigger value="transport">
              <Bus className="mr-2" size={16} />
              Transporte
            </TabsTrigger>
          </TabsList>

          <TabsContent value="phone" className="space-y-4 mt-6">
            <div>
              <Label htmlFor="phone">Número do celular</Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div>
              <Label>Operadora</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {phoneOperators.map((operator) => (
                  <Button
                    key={operator}
                    variant={selectedOperator === operator ? "default" : "outline"}
                    onClick={() => setSelectedOperator(operator)}
                    className="h-auto py-3"
                  >
                    {operator}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transport" className="space-y-4 mt-6">
            <div>
              <Label htmlFor="card">Número do cartão</Label>
              <Input
                id="card"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div>
          <Label>Valor da recarga</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {quickAmounts.map((value) => (
              <Button
                key={value}
                variant={amount === value ? "default" : "outline"}
                onClick={() => setAmount(value)}
              >
                R$ {value}
              </Button>
            ))}
          </div>
          <Input
            type="number"
            placeholder="Outro valor"
            className="mt-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <Button className="w-full" size="lg" onClick={handleConfirm}>
          Continuar
        </Button>
      </main>
    </div>
  );
};

export default Recharge;
