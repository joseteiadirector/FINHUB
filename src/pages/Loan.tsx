import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, DollarSign, TrendingUp, Calculator, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Loan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loanAmount, setLoanAmount] = useState(5000);
  const [installments, setInstallments] = useState(12);
  const [showSimulation, setShowSimulation] = useState(false);

  // Taxa de juros mensal (exemplo: 1.99% ao mês)
  const monthlyRate = 0.0199;

  // Cálculo do valor da parcela usando a fórmula Price
  const calculateInstallment = () => {
    const rate = monthlyRate;
    const n = installments;
    const pv = loanAmount;
    
    // Fórmula Price: PMT = PV * (i * (1+i)^n) / ((1+i)^n - 1)
    const pmt = pv * (rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
    return pmt;
  };

  const installmentValue = calculateInstallment();
  const totalAmount = installmentValue * installments;
  const totalInterest = totalAmount - loanAmount;

  const handleSimulate = () => {
    if (loanAmount < 1000) {
      toast({
        title: "Valor mínimo",
        description: "O valor mínimo para empréstimo é R$ 1.000",
        variant: "destructive",
      });
      return;
    }

    setShowSimulation(true);
    toast({
      title: "Simulação calculada!",
      description: "Confira os detalhes abaixo",
    });
  };

  const handleRequestLoan = () => {
    toast({
      title: "📧 Solicitação enviada!",
      description: "O contrato do seu empréstimo será enviado ao seu email cadastrado em até 24 horas.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
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
          <h1 className="text-3xl font-black text-foreground">EMPRÉSTIMOS</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-6 space-y-6">
        {/* Hero */}
        <Card className="p-6 border-4 border-foreground bg-gradient-to-br from-green-50 to-blue-50">
          <div className="text-center space-y-2">
            <DollarSign className="mx-auto text-green-600" size={48} strokeWidth={3} />
            <h2 className="text-2xl font-black text-foreground">CRÉDITO RÁPIDO</h2>
            <p className="text-sm font-bold text-foreground/70">
              Dinheiro na conta em até 24 horas
            </p>
            <Badge className="bg-green-600 text-white font-black">
              TAXA A PARTIR DE 1,99% A.M.
            </Badge>
          </div>
        </Card>

        {/* Simulador */}
        <Card className="p-6 border-4 border-foreground">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="text-foreground" size={24} strokeWidth={3} />
            <h3 className="text-xl font-black text-foreground">SIMULADOR</h3>
          </div>

          <div className="space-y-6">
            {/* Valor do empréstimo */}
            <div className="space-y-3">
              <Label className="text-sm font-black text-foreground">
                QUANTO VOCÊ PRECISA?
              </Label>
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="text-2xl font-black border-4 border-foreground h-14"
                min={1000}
                max={50000}
                step={100}
              />
              <Slider
                value={[loanAmount]}
                onValueChange={(value) => setLoanAmount(value[0])}
                min={1000}
                max={50000}
                step={100}
                className="py-2"
              />
              <div className="flex justify-between text-xs font-bold text-foreground/60">
                <span>R$ 1.000</span>
                <span>R$ 50.000</span>
              </div>
            </div>

            {/* Número de parcelas */}
            <div className="space-y-3">
              <Label className="text-sm font-black text-foreground">
                EM QUANTAS VEZES?
              </Label>
              <div className="text-3xl font-black text-center p-4 bg-card border-4 border-foreground rounded-lg">
                {installments}x
              </div>
              <Slider
                value={[installments]}
                onValueChange={(value) => setInstallments(value[0])}
                min={6}
                max={48}
                step={6}
                className="py-2"
              />
              <div className="flex justify-between text-xs font-bold text-foreground/60">
                <span>6 meses</span>
                <span>48 meses</span>
              </div>
            </div>

            <Button
              onClick={handleSimulate}
              className="w-full bg-foreground hover:bg-foreground/90 text-background font-black h-12"
            >
              SIMULAR EMPRÉSTIMO
            </Button>
          </div>
        </Card>

        {/* Resultado da Simulação */}
        {showSimulation && (
          <div className="space-y-4 animate-fade-in">
            <Card className="p-6 border-4 border-green-500 bg-green-50">
              <div className="text-center space-y-3">
                <CheckCircle className="mx-auto text-green-600" size={40} strokeWidth={3} />
                <h4 className="text-lg font-black text-foreground">
                  SIMULAÇÃO APROVADA PRÉ-APROVADA
                </h4>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground/70">Valor da parcela</p>
                  <div className="text-4xl font-black text-green-600">
                    R$ {installmentValue.toFixed(2)}
                  </div>
                  <p className="text-sm font-bold text-foreground/70">
                    {installments}x no cartão de crédito
                  </p>
                </div>
              </div>
            </Card>

            {/* Detalhes */}
            <Card className="p-5 border-4 border-foreground">
              <h4 className="text-lg font-black text-foreground mb-4">
                📊 DETALHES DO EMPRÉSTIMO
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-card rounded border-2 border-foreground/20">
                  <span className="font-bold text-sm">Valor solicitado</span>
                  <span className="font-black text-lg">R$ {loanAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-card rounded border-2 border-foreground/20">
                  <span className="font-bold text-sm">Juros total</span>
                  <span className="font-black text-lg text-orange-600">R$ {totalInterest.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded border-2 border-blue-200">
                  <span className="font-bold text-sm">Valor total a pagar</span>
                  <span className="font-black text-xl text-blue-600">R$ {totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Benefícios */}
            <Card className="p-4 bg-foreground text-background border-4 border-foreground">
              <h4 className="text-sm font-black mb-3">✨ VANTAGENS</h4>
              <ul className="space-y-2 text-sm font-bold">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} strokeWidth={3} /> Aprovação em minutos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} strokeWidth={3} /> Dinheiro em até 24h
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} strokeWidth={3} /> Sem consulta ao SPC/Serasa
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} strokeWidth={3} /> Parcelas fixas
                </li>
              </ul>
            </Card>

            <Button
              onClick={handleRequestLoan}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-black h-14 text-lg"
            >
              SOLICITAR EMPRÉSTIMO
            </Button>
          </div>
        )}

        {/* Info */}
        <Card className="p-4 bg-yellow-50 border-4 border-yellow-500">
          <p className="text-xs font-bold text-yellow-900">
            ⚠️ <strong>ATENÇÃO:</strong> Simule antes de solicitar. Certifique-se de que as parcelas cabem no seu orçamento. Empréstimo sujeito à análise de crédito.
          </p>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Loan;
