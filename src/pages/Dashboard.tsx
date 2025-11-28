import { BalanceCard } from "@/components/BalanceCard";
import { TransactionItem } from "@/components/TransactionItem";
import { BottomNav } from "@/components/BottomNav";
import { PredictiveAssistant } from "@/components/PredictiveAssistant";
import { ContextualInsights } from "@/components/ContextualInsights";
import { AIPersonalizedInsights } from "@/components/AIPersonalizedInsights";
import { FinancialChatBot } from "@/components/FinancialChatBot";
import { AchievementBadges } from "@/components/AchievementBadges";
import { PersonalizedRecommendations } from "@/components/PersonalizedRecommendations";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight, Sparkles, MessageCircle, Home, Trophy, Lightbulb, HelpCircle, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useTransactions } from "@/hooks/useTransactions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, loading } = useUserProfile();
  const { transactions, loading: transactionsLoading } = useTransactions();
  
  const userName = profile?.full_name || "Usuário";
  const userInitial = profile?.full_name?.charAt(0).toUpperCase() || "U";

  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-background pb-20 relative overflow-hidden">
      <header className="bg-card/95 backdrop-blur-sm border-b-4 border-foreground p-6 animate-fade-in shadow-xl relative z-10">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/")}
            className="border-4 border-foreground hover:bg-foreground hover:text-background transition-all"
            aria-label="Ir para início"
          >
            <Home size={24} />
          </Button>
          <div className="flex-1">
            <h1 className="text-5xl font-black text-black mb-1 drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              {loading ? "OLÁ! 👋" : `OLÁ, ${userName.toUpperCase()}! 👋`}
            </h1>
            <p className="text-lg font-bold text-black/80 drop-shadow">Gerencie suas finanças com inteligência</p>
          </div>
          <Avatar className="w-14 h-14 border-4 border-foreground cursor-pointer hover:scale-110 transition-transform shadow-lg" onClick={() => navigate("/profile")}>
            <AvatarImage src={profile?.avatar_url || undefined} alt="Avatar" />
            <AvatarFallback className="bg-foreground text-background text-xl font-black">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6 animate-fade-in">
        <div className="animate-scale-in">
          <BalanceCard balance={balance} income={totalIncome} expenses={totalExpenses} />
        </div>

        <AddTransactionDialog />

        {/* Card de Indicações */}
        <div 
          onClick={() => navigate("/referrals")}
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 border-4 border-foreground shadow-xl cursor-pointer hover:scale-[1.02] transition-all duration-300 active:scale-95"
        >
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Gift className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black">INDICAÇÕES</h3>
                <p className="text-sm font-bold opacity-90">Compartilhe e ganhe emblemas!</p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Seção de Personalização: IA, Conquistas, Recomendações, Chat e FAQ */}
        <div className="bg-card rounded-2xl p-1 border-4 border-foreground shadow-xl">
          <Tabs defaultValue="ia" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-3 bg-card border-2 border-foreground">
              <TabsTrigger value="ia" className="text-xs font-black text-foreground data-[state=active]:bg-foreground data-[state=active]:text-background">
                <Sparkles size={14} className="mr-1" />
                IA
              </TabsTrigger>
              <TabsTrigger value="conquistas" className="text-xs font-black text-foreground data-[state=active]:bg-foreground data-[state=active]:text-background">
                <Trophy size={14} className="mr-1" />
                BADGES
              </TabsTrigger>
              <TabsTrigger value="dicas" className="text-xs font-black text-foreground data-[state=active]:bg-foreground data-[state=active]:text-background">
                <Lightbulb size={14} className="mr-1" />
                DICAS
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-xs font-black text-foreground data-[state=active]:bg-foreground data-[state=active]:text-background">
                <MessageCircle size={14} className="mr-1" />
                CHAT
              </TabsTrigger>
              <TabsTrigger value="faq" className="text-xs font-black text-foreground data-[state=active]:bg-foreground data-[state=active]:text-background">
                <HelpCircle size={14} className="mr-1" />
                FAQ
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ia" className="mt-0 px-3 pb-3 space-y-4">
              <AIPersonalizedInsights 
                transactions={transactions} 
                currentBalance={balance}
              />
              <ContextualInsights transactions={transactions} />
            </TabsContent>
            
            <TabsContent value="conquistas" className="mt-0 px-3 pb-3">
              <AchievementBadges transactions={transactions} />
            </TabsContent>
            
            <TabsContent value="dicas" className="mt-0 px-3 pb-3">
              <PersonalizedRecommendations 
                transactions={transactions}
              />
              <div className="mt-4">
                <PredictiveAssistant 
                  transactions={transactions} 
                  currentBalance={balance}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="chat" className="mt-0 px-3 pb-3">
              <FinancialChatBot 
                transactions={transactions}
                currentBalance={balance}
              />
            </TabsContent>
            
            <TabsContent value="faq" className="mt-0 px-3 pb-3">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-3 rounded-2xl bg-foreground">
                    <HelpCircle className="text-background" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-foreground">PERGUNTAS FREQUENTES</h2>
                    <p className="text-sm font-bold text-foreground/70">Tire suas dúvidas sobre o FinHub</p>
                  </div>
                </div>
                
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="item-0" className="bg-card rounded-lg px-4 border-2 border-foreground shadow-sm">
                    <AccordionTrigger className="text-left font-bold text-foreground hover:no-underline text-sm">
                      O que é o FinHub?
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/70 text-sm">
                      FinHub é um hub financeiro completo que une controle de gastos, extrato inteligente e diversos serviços financeiros em um único aplicativo. Gerencie suas finanças com tecnologia de IA que categoriza automaticamente suas despesas e oferece insights personalizados.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-1" className="bg-card rounded-lg px-4 border-2 border-foreground shadow-sm">
                    <AccordionTrigger className="text-left font-bold text-foreground hover:no-underline text-sm">
                      Como funciona a categorização automática?
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/70 text-sm">
                      Nossa IA analisa cada transação e categoriza automaticamente seus gastos em categorias como Alimentação, Transporte, Saúde, Entretenimento e outras. Você também pode ajustar manualmente as categorias quando necessário.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="bg-card rounded-lg px-4 border-2 border-foreground shadow-sm">
                    <AccordionTrigger className="text-left font-bold text-foreground hover:no-underline text-sm">
                      Quais serviços financeiros estão disponíveis?
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/70 text-sm">
                      Oferecemos PIX, pagamento de contas, recarga de celular, cashback em compras, seguros personalizados e empréstimos com taxas competitivas. Todos integrados em uma única plataforma segura.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="bg-card rounded-lg px-4 border-2 border-foreground shadow-sm">
                    <AccordionTrigger className="text-left font-bold text-foreground hover:no-underline text-sm">
                      Como funcionam os insights da IA?
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/70 text-sm">
                      Nossa IA analisa seus padrões de gastos e gera insights personalizados sobre sua saúde financeira, oportunidades de economia, alertas de gastos elevados e recomendações práticas para melhorar suas finanças.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="bg-card rounded-lg px-4 border-2 border-foreground shadow-sm">
                    <AccordionTrigger className="text-left font-bold text-foreground hover:no-underline text-sm">
                      O chat financeiro é seguro?
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/70 text-sm">
                      Sim! Todas as conversas são criptografadas e seus dados financeiros são protegidos. O chat usa IA para responder suas perguntas sobre finanças de forma personalizada, analisando apenas suas próprias transações.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5" className="bg-card rounded-lg px-4 border-2 border-foreground shadow-sm">
                    <AccordionTrigger className="text-left font-bold text-foreground hover:no-underline text-sm">
                      Como ganho badges e conquistas?
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/70 text-sm">
                      Você ganha badges ao atingir marcos importantes: registrar sua primeira transação, alcançar metas de economia, usar os serviços integrados e manter uma saúde financeira positiva. Quanto mais você usa o app, mais conquistas desbloqueia!
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6" className="bg-card rounded-lg px-4 border-2 border-foreground shadow-sm">
                    <AccordionTrigger className="text-left font-bold text-foreground hover:no-underline text-sm">
                      Posso exportar meus dados?
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/70 text-sm">
                      Sim! Você pode exportar seu extrato completo e relatórios financeiros a qualquer momento. Seus dados são seus e você tem controle total sobre eles.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7" className="bg-card rounded-lg px-4 border-2 border-foreground shadow-sm">
                    <AccordionTrigger className="text-left font-bold text-foreground hover:no-underline text-sm">
                      Como funciona o cashback?
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/70 text-sm">
                      Ao usar nosso serviço de cashback integrado, você recebe uma porcentagem de volta em compras elegíveis. O dinheiro retorna diretamente para sua conta e pode ser usado para novas transações.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8" className="bg-card rounded-lg px-4 border-2 border-foreground shadow-sm">
                    <AccordionTrigger className="text-left font-bold text-foreground hover:no-underline text-sm">
                      Meus dados bancários estão seguros?
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/70 text-sm">
                      Totalmente! Usamos criptografia de nível bancário e nunca armazenamos senhas de bancos. Todas as transações são processadas através de canais seguros e certificados.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-9" className="bg-card rounded-lg px-4 border-2 border-foreground shadow-sm">
                    <AccordionTrigger className="text-left font-bold text-foreground hover:no-underline text-sm">
                      Como criar metas financeiras?
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/70 text-sm">
                      Acesse a seção de metas no seu dashboard, defina um objetivo (viagem, compra, economia) e um valor alvo. O FinHub vai acompanhar seu progresso e sugerir quanto economizar mensalmente para atingir sua meta.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-black" size={28} />
            <h2 className="text-3xl font-black text-black drop-shadow-md" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}>GASTOS DO MÊS</h2>
          </div>
          <p className="text-lg font-bold text-black/70">Novembro</p>
        </div>

        <div className="bg-card rounded-2xl p-4 border-4 border-foreground shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base font-black text-foreground">LIMITE DE GASTOS</span>
            <span className="text-base font-black text-foreground">65% USADO</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 border-2 border-foreground">
            <div className="bg-foreground h-full rounded-full" style={{ width: "65%" }}></div>
          </div>
          <p className="text-sm font-bold text-foreground/70 mt-2">R$ 1.452,18 de R$ 2.200,00</p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-black text-black drop-shadow-md" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}>TRANSAÇÕES RECENTES</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/transactions")}
              className="text-black font-bold hover:bg-foreground/10"
            >
              Ver todas <ArrowRight size={18} className="ml-1" />
            </Button>
          </div>
          
          <div className="bg-card rounded-2xl divide-y-2 divide-foreground border-4 border-foreground shadow-lg">
            {transactionsLoading ? (
              <div className="p-6 text-center text-foreground/70 font-bold">
                Carregando transações...
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-6 text-center text-foreground/70 font-bold">
                Nenhuma transação ainda. Adicione sua primeira!
              </div>
            ) : (
              transactions.slice(0, 8).map((transaction, index) => (
                <TransactionItem key={transaction.id || index} {...transaction} />
              ))
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
