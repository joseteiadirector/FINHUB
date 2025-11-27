import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, QrCode, User, Phone, Mail, CreditCard, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PixTransfer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [pixKey, setPixKey] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [keyType, setKeyType] = useState<"cpf" | "phone" | "email" | "random">("cpf");

  const handleConfirm = () => {
    if (!pixKey || !amount) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a chave PIX e o valor",
        variant: "destructive",
      });
      return;
    }
    setStep("confirm");
  };

  const handleTransfer = () => {
    setStep("success");
    toast({
      title: "Transferência realizada!",
      description: `R$ ${parseFloat(amount).toFixed(2).replace('.', ',')} enviado com sucesso`,
    });
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Transferência realizada!</h2>
          <p className="text-muted-foreground mb-6">
            R$ {parseFloat(amount).toFixed(2).replace('.', ',')} enviado via PIX
          </p>
          <div className="space-y-2 mb-6 text-left bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Destinatário</span>
              <span className="text-sm font-medium text-foreground">{pixKey}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Data</span>
              <span className="text-sm font-medium text-foreground">{new Date().toLocaleString('pt-BR')}</span>
            </div>
            {description && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Descrição</span>
                <span className="text-sm font-medium text-foreground">{description}</span>
              </div>
            )}
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
            <h1 className="text-xl font-bold text-foreground">Confirmar transferência</h1>
          </div>
        </header>

        <main className="max-w-md mx-auto p-4 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Detalhes da transferência</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Valor</p>
                <p className="text-3xl font-bold text-foreground">
                  R$ {parseFloat(amount).toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div className="pt-4 border-t border-border space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Chave PIX</p>
                  <p className="font-medium text-foreground">{pixKey}</p>
                </div>
                {description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Descrição</p>
                    <p className="font-medium text-foreground">{description}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("form")} className="flex-1">
              Voltar
            </Button>
            <Button onClick={handleTransfer} className="flex-1">
              Confirmar transferência
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
          <h1 className="text-xl font-bold text-foreground">Transferir via PIX</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <Tabs value={keyType} onValueChange={(v) => setKeyType(v as typeof keyType)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cpf">
              <User size={16} />
            </TabsTrigger>
            <TabsTrigger value="phone">
              <Phone size={16} />
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail size={16} />
            </TabsTrigger>
            <TabsTrigger value="random">
              <CreditCard size={16} />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cpf" className="space-y-4 mt-6">
            <div>
              <Label htmlFor="cpf">CPF/CNPJ</Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="phone" className="space-y-4 mt-6">
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4 mt-6">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="random" className="space-y-4 mt-6">
            <div>
              <Label htmlFor="random">Chave aleatória</Label>
              <Input
                id="random"
                placeholder="00000000-0000-0000-0000-000000000000"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div>
          <Label htmlFor="amount">Valor</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0,00"
              className="pl-10"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Descrição (opcional)</Label>
          <Input
            id="description"
            placeholder="Ex: Aluguel, Presente..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Button className="w-full" size="lg" onClick={handleConfirm}>
          Continuar
        </Button>

        <div className="text-center">
          <Button variant="outline" className="w-full" onClick={() => toast({ title: "Em breve!", description: "Leitura de QR Code disponível em breve" })}>
            <QrCode className="mr-2" size={20} />
            Ler QR Code
          </Button>
        </div>
      </main>
    </div>
  );
};

export default PixTransfer;
