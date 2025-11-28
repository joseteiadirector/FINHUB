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
  const [amount, setAmount] = useState(0);
  const [selectedBill, setSelectedBill] = useState<typeof recentBills[0] | null>(null);

  const recentBills = [
    { name: "Conta de Luz", company: "EDP", dueDate: "30/11/2024", amount: 184.50 },
    { name: "Conta de Água", company: "SABESP", dueDate: "05/12/2024", amount: 89.30 },
    { name: "Internet", company: "NET", dueDate: "10/12/2024", amount: 99.90 },
  ];

  const handleBillClick = (bill: typeof recentBills[0]) => {
    const simulatedBarcode = `${Math.floor(Math.random() * 10000000000)}${Math.floor(Math.random() * 10000000000)}${Math.floor(Math.random() * 10000)}`;
    setBarcode(simulatedBarcode);
    setAmount(bill.amount);
    setSelectedBill(bill);
    toast({
      title: "✓ Conta selecionada",
      description: `${bill.name} - R$ ${bill.amount.toFixed(2).replace('.', ',')}`,
    });
  };

  const handleConfirm = () => {
    if (!barcode || barcode.length < 10) {
      toast({
        title: "⚠️ Código de barras necessário",
        description: "Digite ou escaneie o código de barras",
        variant: "destructive",
      });
      return;
    }
    
    if (!amount || amount <= 0) {
      toast({
        title: "⚠️ Valor inválido",
        description: "Selecione uma conta ou digite um valor válido",
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
      
      // Modo demonstração se não houver sessão
      const isDemo = !session;
      
      toast({
        title: "💳 Processando pagamento...",
        description: "Aguarde enquanto processamos sua transação",
      });

      // Registrar transação no banco de dados (apenas se autenticado)
      if (!isDemo) {
        const billName = selectedBill ? selectedBill.name : "Pagamento de Conta";
        
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            user_id: session.user.id,
            title: billName,
            amount: amount,
            type: 'expense',
            category: 'Contas',
            date: new Date().toISOString(),
          });

        if (transactionError) {
          console.error('Transaction error:', transactionError);
          toast({
            title: "❌ Erro ao registrar",
            description: "Não foi possível registrar a transação",
            variant: "destructive",
          });
          return;
        }
      }

      // Simular processamento
      setTimeout(() => {
        setStep("success");
        toast({
          title: "✅ Pagamento confirmado!",
          description: isDemo 
            ? "Pagamento processado (modo demonstração)" 
            : "Seu pagamento foi processado com sucesso",
        });
      }, 1500);

    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "❌ Erro no pagamento",
        description: "Não foi possível processar o pagamento. Tente novamente.",
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
            R$ {amount.toFixed(2).replace('.', ',')} pago
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
                  R$ {amount.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div className="pt-4 border-t border-border space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Código de barras</p>
                  <p className="font-medium text-foreground font-mono text-sm break-all">{barcode}</p>
                </div>
                {selectedBill && (
                  <div>
                    <p className="text-sm text-muted-foreground">Beneficiário</p>
                    <p className="font-medium text-foreground">{selectedBill.company}</p>
                  </div>
                )}
                {!selectedBill && (
                  <div>
                    <p className="text-sm text-muted-foreground">Beneficiário</p>
                    <p className="font-medium text-foreground">Empresa de Serviços</p>
                  </div>
                )}
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
      <header className="bg-card border-b-4 border-foreground p-6 sticky top-0 z-10 shadow-xl">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/services")}
            className="border-4 border-foreground hover:bg-foreground hover:text-background"
          >
            <ArrowLeft size={24} strokeWidth={3} />
          </Button>
          <h1 className="text-3xl font-black text-foreground">PAGAR CONTA</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <Card className="p-4 bg-card border-4 border-foreground">
          <div className="space-y-4">
            <div>
              <Label htmlFor="barcode" className="text-sm font-black text-foreground">
                CÓDIGO DE BARRAS
              </Label>
              <Input
                id="barcode"
                placeholder="Digite o código de barras"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="font-mono mt-2 border-2 border-foreground"
              />
            </div>

            <Button 
              variant="outline" 
              className="w-full border-2 border-foreground font-bold" 
              onClick={() => {
                const simulatedBarcode = `${Math.floor(Math.random() * 10000000000)}${Math.floor(Math.random() * 10000000000)}${Math.floor(Math.random() * 10000)}`;
                setBarcode(simulatedBarcode);
                // Simular valor aleatório entre 50 e 300
                const randomAmount = Math.floor(Math.random() * 250) + 50 + Math.random();
                setAmount(randomAmount);
                setSelectedBill(null);
                toast({ 
                  title: "✓ Código escaneado!", 
                  description: `Valor: R$ ${randomAmount.toFixed(2).replace('.', ',')}` 
                });
              }}
            >
              <Scan className="mr-2" size={20} />
              Escanear código de barras
            </Button>
          </div>
        </Card>

        <Button 
          className="w-full bg-foreground hover:bg-foreground/90 text-background font-black h-12" 
          size="lg" 
          onClick={handleConfirm}
          disabled={!barcode || !amount}
        >
          CONTINUAR
        </Button>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-foreground" size={24} strokeWidth={3} />
            <h2 className="text-xl font-black text-foreground">CONTAS RECENTES</h2>
          </div>
          <div className="space-y-3">
            {recentBills.map((bill, index) => (
              <Card 
                key={index} 
                className="p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all border-4 border-foreground bg-card"
                onClick={() => handleBillClick(bill)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-foreground text-lg">{bill.name}</h3>
                    <p className="text-sm font-bold text-foreground/70">{bill.company}</p>
                    <p className="text-xs font-bold text-foreground/60 mt-1">
                      Vencimento: {bill.dueDate}
                    </p>
                  </div>
                  <p className="font-black text-foreground text-xl">
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
