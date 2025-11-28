import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Gift, TrendingUp, Percent, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Cashback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activatedCategories, setActivatedCategories] = useState<Set<string>>(new Set());

  const cashbackCategories = [
    {
      id: "alimentacao",
      category: "Alimentação",
      icon: Store,
      cashbackRate: 5,
      color: "bg-orange-500",
      description: "Restaurantes e supermercados"
    },
    {
      id: "transporte",
      category: "Transporte",
      icon: TrendingUp,
      cashbackRate: 3,
      color: "bg-blue-500",
      description: "Uber, 99, combustível"
    },
    {
      id: "saude",
      category: "Saúde",
      icon: Gift,
      cashbackRate: 4,
      color: "bg-green-500",
      description: "Farmácias e consultas"
    },
    {
      id: "lazer",
      category: "Lazer",
      icon: Percent,
      cashbackRate: 2,
      color: "bg-purple-500",
      description: "Cinema, shows, eventos"
    }
  ];

  const handleToggleCashback = (categoryId: string, categoryName: string, rate: number) => {
    const newActivated = new Set(activatedCategories);
    
    if (newActivated.has(categoryId)) {
      newActivated.delete(categoryId);
      toast({
        title: "Cashback desativado",
        description: `${categoryName} não receberá mais cashback`,
      });
    } else {
      newActivated.add(categoryId);
      toast({
        title: "🎉 Cashback ativado!",
        description: `Ganhe ${rate}% de volta em ${categoryName}`,
      });
    }
    
    setActivatedCategories(newActivated);
  };

  const totalPotentialCashback = cashbackCategories
    .filter(cat => activatedCategories.has(cat.id))
    .reduce((sum, cat) => sum + cat.cashbackRate, 0);

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
          <h1 className="text-3xl font-black text-foreground">CASHBACK</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-6 space-y-6">
        {/* Resumo de Cashback */}
        <Card className="p-6 border-4 border-foreground bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="text-center space-y-2">
            <Gift className="mx-auto text-orange-600" size={48} strokeWidth={3} />
            <h2 className="text-2xl font-black text-foreground">SEU CASHBACK ATIVO</h2>
            <div className="text-5xl font-black text-orange-600">
              {totalPotentialCashback}%
            </div>
            <p className="text-sm font-bold text-foreground/70">
              {activatedCategories.size} {activatedCategories.size === 1 ? 'categoria ativada' : 'categorias ativadas'}
            </p>
          </div>
        </Card>

        {/* Informativo */}
        <Card className="p-4 bg-foreground text-background border-4 border-foreground">
          <p className="text-sm font-bold">
            💰 <strong>COMO FUNCIONA:</strong> Ative as categorias abaixo e receba cashback automático em todas as suas compras nessas categorias. O valor retorna direto para sua conta!
          </p>
        </Card>

        {/* Categorias de Cashback */}
        <div className="space-y-4">
          <h3 className="text-xl font-black text-foreground">CATEGORIAS DISPONÍVEIS</h3>
          
          {cashbackCategories.map((item, index) => {
            const isActive = activatedCategories.has(item.id);
            const Icon = item.icon;
            
            return (
              <Card 
                key={item.id}
                className={`p-5 border-4 transition-all hover:shadow-xl ${
                  isActive 
                    ? 'border-green-500 bg-green-50 shadow-lg' 
                    : 'border-foreground bg-card hover:-translate-y-1'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-3 rounded-xl ${item.color}`}>
                      <Icon className="text-white" size={24} strokeWidth={3} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-black text-foreground mb-1">
                        {item.category}
                      </h4>
                      <p className="text-sm font-bold text-foreground/70 mb-2">
                        {item.description}
                      </p>
                      <Badge className={`${item.color} text-white font-black`}>
                        {item.cashbackRate}% DE VOLTA
                      </Badge>
                    </div>
                  </div>
                  
                  <Switch
                    checked={isActive}
                    onCheckedChange={() => handleToggleCashback(item.id, item.category, item.cashbackRate)}
                    className="mt-2"
                  />
                </div>
                
                {isActive && (
                  <div className="mt-4 pt-4 border-t-2 border-green-200">
                    <p className="text-xs font-bold text-green-800">
                      ✓ Cashback ativo! Todas as compras em {item.category} receberão {item.cashbackRate}% de volta
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Histórico simulado */}
        {activatedCategories.size > 0 && (
          <Card className="p-5 border-4 border-foreground">
            <h3 className="text-lg font-black text-foreground mb-4">
              💵 CASHBACK DO MÊS
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
                <span className="font-bold text-sm">Total ganho</span>
                <span className="font-black text-xl text-green-600">R$ 45.30</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                <span className="font-bold text-sm">A receber</span>
                <span className="font-black text-xl text-blue-600">R$ 12.80</span>
              </div>
            </div>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Cashback;
