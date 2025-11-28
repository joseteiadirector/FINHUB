import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const WELCOME_TEXT = "Olá! Seja bem-vindo ao FinHub. Sua plataforma completa para gerenciar finanças de forma inteligente. Aqui você encontra categorização automática de despesas, análises personalizadas por IA e acesso a todos os serviços financeiros que você precisa. Se não tem acesso, crie ou faça seu login. Vamos começar?";

export const WelcomeAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const playWelcomeAudio = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: WELCOME_TEXT,
          voiceId: 'IKne3meq5aSn9XLyUdCD' // Charlie voice (young masculine, ~35 years)
        }
      });

      if (error) throw error;

      if (data?.audioContent) {
        const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
        audioRef.current = audio;

        audio.onended = () => {
          setIsPlaying(false);
        };

        audio.onerror = () => {
          toast({
            title: "Erro ao reproduzir áudio",
            description: "Não foi possível reproduzir a mensagem de boas-vindas.",
            variant: "destructive",
          });
          setIsPlaying(false);
        };

        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing welcome audio:', error);
      toast({
        title: "Erro ao carregar áudio",
        description: "Não foi possível carregar a mensagem de boas-vindas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={playWelcomeAudio}
            disabled={isLoading}
            className="rounded-full shadow-2xl border-4 border-primary/50 bg-primary/10 hover:bg-primary/20 hover:scale-110 transition-all animate-[pulse_1.5s_ease-in-out_infinite]"
            title="Ouvir mensagem de boas-vindas"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : isPlaying ? (
              <VolumeX className="h-6 w-6 text-primary" />
            ) : (
              <Volume2 className="h-6 w-6 text-primary animate-bounce" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-card border-4 border-primary shadow-xl">
          <p className="font-black text-base">🎙️ MENSAGEM DE BOAS-VINDAS</p>
          <p className="text-sm font-semibold text-foreground/80">Clique para ouvir nossa apresentação</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
