import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Scan, CheckCircle2, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const BillPayment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [barcode, setBarcode] = useState("");
  const [amount] = useState("125.50"); // Simulated amount from barcode

  const recentBills = [
    { name: "Conta de Luz", company: "EDP", dueDate: "30/11/2024", amount: 184.50 },
    { name: "Conta de Água", company: "SABESP", dueDate: "05/12/2024", amount: 89.30 },
    { name: "Internet", company: "NET", dueDate: "10/12/2024", amount: 99.90 },
  ];

  const handleConfirm = () => {
    if (!barcode) {
      toast({
        title: "Código de barras necessário",
        description: "Digite ou escaneie o código de barras",
        variant: "destructive",
      });
      return;
    }
    setStep("confirm");
  };

  const handlePayment = async () => {
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

      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: {
          amount: parseFloat(amount),
          description: `Pagamento de conta - ${barcode}`,
          productName: "Pagamento de Conta",
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
        description: "Não foi possível processar o pagamento",
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
          <h2 className="text-2xl font-bold text-foreground mb-2">Pagamento confirmado!</h2>
          <p className="text-muted-foreground mb-6">
            R$ {parseFloat(amount).toFixed(2).replace('.', ',')} pago
          </p>
          <div className="space-y-2 mb-6 text-left bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Código de barras</span>
              <span className="text-sm font-medium text-foreground font-mono">{barcode.slice(0, 15)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Data de pagamento</span>
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
            <h1 className="text-xl font-bold text-foreground">Confirmar pagamento</h1>
          </div>
        </header>

        <main className="max-w-md mx-auto p-4 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Detalhes do pagamento</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Valor</p>
                <p className="text-3xl font-bold text-foreground">
                  R$ {parseFloat(amount).toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div className="pt-4 border-t border-border space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Código de barras</p>
                  <p className="font-medium text-foreground font-mono text-sm">{barcode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Beneficiário</p>
                  <p className="font-medium text-foreground">Empresa de Serviços</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("form")} className="flex-1">
              Voltar
            </Button>
            <Button onClick={handlePayment} className="flex-1">
              Confirmar pagamento
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
          <h1 className="text-xl font-bold text-foreground">Pagar conta</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <div>
          <Label htmlFor="barcode">Código de barras</Label>
          <Input
            id="barcode"
            placeholder="Digite o código de barras"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="font-mono"
          />
        </div>

        <Button variant="outline" className="w-full" onClick={() => toast({ title: "Em breve!", description: "Scanner de código de barras disponível em breve" })}>
          <Scan className="mr-2" size={20} />
          Escanear código de barras
        </Button>

        <Button className="w-full" size="lg" onClick={handleConfirm}>
          Continuar
        </Button>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-primary" size={20} />
            <h2 className="text-lg font-semibold text-foreground">Contas recentes</h2>
          </div>
          <div className="space-y-3">
            {recentBills.map((bill, index) => (
              <Card key={index} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">{bill.name}</h3>
                    <p className="text-sm text-muted-foreground">{bill.company}</p>
                    <p className="text-xs text-muted-foreground mt-1">Vencimento: {bill.dueDate}</p>
                  </div>
                  <p className="font-semibold text-foreground">
                    R$ {bill.amount.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BillPayment;
