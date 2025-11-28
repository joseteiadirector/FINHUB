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
            className="rounded-full shadow-lg animate-pulse hover:animate-none"
            title="Ouvir mensagem de boas-vindas"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isPlaying ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">🎙️ Mensagem de Boas-Vindas</p>
          <p className="text-xs text-muted-foreground">Clique para ouvir</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
