import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Trash2, Loader2, Bot, User, Volume2 } from "lucide-react";
import { useFinancialChat } from "@/hooks/useFinancialChat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  amount: number;
  type: "income" | "expense";
  category: string;
  title: string;
  date: string;
}

interface FinancialChatBotProps {
  transactions: Transaction[];
  currentBalance: number;
}

export const FinancialChatBot = ({ transactions = [], currentBalance = 0 }: FinancialChatBotProps) => {
  const [input, setInput] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Garantir dados seguros
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const safeBalance = typeof currentBalance === 'number' && !isNaN(currentBalance) ? currentBalance : 0;

  const handleAssistantResponse = async (text: string) => {
    // Auto-play audio for assistant response
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text,
          voiceId: 'TX3LPaxmHKxFdv7VOQHJ' // Liam voice - better for Portuguese
        }
      });

      if (error) throw error;

      if (data?.audioContent) {
        const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
        audioRef.current = audio;

        audio.onended = () => {
          setIsPlayingAudio(false);
        };

        audio.onerror = () => {
          console.error('Error playing audio');
          setIsPlayingAudio(false);
        };

        setIsPlayingAudio(true);
        await audio.play();
      }
    } catch (error) {
      console.error('Error generating audio:', error);
    }
  };

  const { messages, sendMessage, isLoading, clearChat } = useFinancialChat(handleAssistantResponse);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    try {
      const messageText = input;
      setInput("");
      await sendMessage(messageText, safeTransactions, safeBalance);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "Como está minha saúde financeira?",
    "Onde estou gastando mais?",
    "Dicas para economizar?",
    "Posso comprar algo de R$ 500?",
  ];

  return (
    <Card className="flex flex-col min-h-[500px] h-[75vh] md:h-[600px] max-h-[80vh] bg-gradient-to-br from-card to-card/50 border-4 border-foreground shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border-b-4 border-foreground">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="p-2 sm:p-3 rounded-2xl bg-foreground flex-shrink-0">
            <MessageCircle className="text-background" size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-black text-foreground text-base sm:text-lg">FINASSIST</h3>
            <p className="text-xs sm:text-sm font-bold text-foreground/70 truncate">Seu assistente financeiro inteligente</p>
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end flex-shrink-0">
          <Badge variant="secondary" className="text-[10px] sm:text-xs font-black bg-foreground text-background px-2 sm:px-3 py-1 flex-shrink-0 whitespace-nowrap">
            {isPlayingAudio ? (
              <span className="flex items-center gap-1">
                <Volume2 size={10} className="animate-pulse sm:w-3 sm:h-3" />
                FALANDO
              </span>
            ) : (
              "IA TEMPO REAL"
            )}
          </Badge>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              disabled={isLoading}
              className="hover:bg-foreground/10 flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 p-0"
            >
              <Trash2 size={14} className="sm:w-4 sm:h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-3 sm:p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 sm:space-y-4 py-2">
            <div className="p-3 sm:p-4 rounded-full bg-foreground">
              <Bot size={32} className="text-background sm:w-12 sm:h-12" />
            </div>
            <div className="px-3 sm:px-4">
              <h4 className="font-black text-foreground mb-2 text-base sm:text-xl">
                OLÁ! SOU O FINASSIST 👋
              </h4>
              <p className="text-xs sm:text-base font-bold text-foreground/70 mb-3 sm:mb-4">
                Pergunte qualquer coisa sobre suas finanças e receba respostas em tempo real
              </p>
            </div>
            <div className="w-full px-2 sm:px-4 space-y-2">
              <p className="text-xs font-black text-foreground/80 mb-2">PERGUNTAS RÁPIDAS:</p>
              <div className="grid grid-cols-1 gap-2 w-full">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm h-auto py-3 px-3 whitespace-normal text-left font-bold border-2 border-foreground hover:bg-foreground hover:text-background transition-all w-full"
                    onClick={() => setInput(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 sm:gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="p-2 rounded-full bg-primary/10 h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-primary sm:w-4 sm:h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 border-2 border-foreground ${
                    message.role === "user"
                      ? "bg-foreground text-background"
                      : "bg-card text-foreground"
                  }`}
                >
                  <p className="text-xs sm:text-sm whitespace-pre-wrap font-semibold leading-relaxed">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <div className="p-2 rounded-full bg-foreground h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center flex-shrink-0">
                    <User size={14} className="text-background sm:w-4 sm:h-4" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 sm:gap-3 justify-start">
                <div className="p-2 rounded-full bg-foreground h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center">
                  <Bot size={14} className="text-background sm:w-4 sm:h-4" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta sobre finanças..."
            disabled={isLoading}
            className="flex-1 text-sm sm:text-base"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="bg-foreground hover:bg-foreground/90 text-background font-black border-2 border-foreground shadow-lg h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0"
          >
            <Send size={18} className="sm:w-5 sm:h-5" />
          </Button>
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 text-center">
          Pressione Enter para enviar • Shift+Enter para nova linha
        </p>
      </div>
    </Card>
  );
};
