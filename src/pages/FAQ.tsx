import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BottomNav } from "@/components/BottomNav";

const FAQ = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "O que é o FinHub?",
      answer: "FinHub é um hub financeiro completo que une controle de gastos, extrato inteligente e diversos serviços financeiros em um único aplicativo. Gerencie suas finanças com tecnologia de IA que categoriza automaticamente suas despesas e oferece insights personalizados."
    },
    {
      question: "Como funciona a categorização automática?",
      answer: "Nossa IA analisa cada transação e categoriza automaticamente seus gastos em categorias como Alimentação, Transporte, Saúde, Entretenimento e outras. Você também pode ajustar manualmente as categorias quando necessário."
    },
    {
      question: "Quais serviços financeiros estão disponíveis?",
      answer: "Oferecemos PIX, pagamento de contas, recarga de celular, cashback em compras, seguros personalizados e empréstimos com taxas competitivas. Todos integrados em uma única plataforma segura."
    },
    {
      question: "Como funcionam os insights da IA?",
      answer: "Nossa IA analisa seus padrões de gastos e gera insights personalizados sobre sua saúde financeira, oportunidades de economia, alertas de gastos elevados e recomendações práticas para melhorar suas finanças."
    },
    {
      question: "O chat financeiro é seguro?",
      answer: "Sim! Todas as conversas são criptografadas e seus dados financeiros são protegidos. O chat usa IA para responder suas perguntas sobre finanças de forma personalizada, analisando apenas suas próprias transações."
    },
    {
      question: "Como ganho badges e conquistas?",
      answer: "Você ganha badges ao atingir marcos importantes: registrar sua primeira transação, alcançar metas de economia, usar os serviços integrados e manter uma saúde financeira positiva. Quanto mais você usa o app, mais conquistas desbloqueia!"
    },
    {
      question: "Posso exportar meus dados?",
      answer: "Sim! Você pode exportar seu extrato completo e relatórios financeiros a qualquer momento. Seus dados são seus e você tem controle total sobre eles."
    },
    {
      question: "Como funciona o cashback?",
      answer: "Ao usar nosso serviço de cashback integrado, você recebe uma porcentagem de volta em compras elegíveis. O dinheiro retorna diretamente para sua conta e pode ser usado para novas transações."
    },
    {
      question: "Meus dados bancários estão seguros?",
      answer: "Totalmente! Usamos criptografia de nível bancário e nunca armazenamos senhas de bancos. Todas as transações são processadas através de canais seguros e certificados."
    },
    {
      question: "Como criar metas financeiras?",
      answer: "Acesse a seção de metas no seu dashboard, defina um objetivo (viagem, compra, economia) e um valor alvo. O FinHub vai acompanhar seu progresso e sugerir quanto economizar mensalmente para atingir sua meta."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 pb-20">
      <div className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Perguntas Frequentes</h1>
        </div>
        <p className="text-sm opacity-90">
          Tire suas dúvidas sobre o FinHub
        </p>
      </div>

      <div className="p-6">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card rounded-lg px-4 border-none shadow-sm"
            >
              <AccordionTrigger className="text-left font-bold text-foreground hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <BottomNav />
    </div>
  );
};

export default FAQ;
