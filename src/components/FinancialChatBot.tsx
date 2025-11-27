import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Trash2, Loader2, Bot, User } from "lucide-react";
import { useFinancialChat } from "@/hooks/useFinancialChat";

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

export const FinancialChatBot = ({ transactions, currentBalance }: FinancialChatBotProps) => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, isLoading, clearChat } = useFinancialChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const messageText = input;
    setInput("");
    await sendMessage(messageText, transactions, currentBalance);
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
    <Card className="flex flex-col h-[600px] bg-gradient-to-br from-card to-card/50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <MessageCircle className="text-primary" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-foreground">FinAssist</h3>
            <p className="text-xs text-muted-foreground">Seu assistente financeiro inteligente</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            IA em tempo real
          </Badge>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              disabled={isLoading}
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Bot size={48} className="text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Olá! Sou o FinAssist 👋
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Pergunte qualquer coisa sobre suas finanças e receba respostas em tempo real
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full max-w-md">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-2 px-3 whitespace-normal text-left"
                  onClick={() => setInput(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="p-2 rounded-full bg-primary/10 h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <div className="p-2 rounded-full bg-primary h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="p-2 rounded-full bg-primary/10 h-8 w-8 flex items-center justify-center">
                  <Bot size={16} className="text-primary" />
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
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta sobre finanças..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            <Send size={18} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Pressione Enter para enviar • Shift+Enter para nova linha
        </p>
      </div>
    </Card>
  );
};
