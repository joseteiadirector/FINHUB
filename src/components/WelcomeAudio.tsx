import { useState, useRef, useEffect } from "react";
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

const WELCOME_TEXT = "Bem-vindo ao FinHub! Controle suas finanças com inteligência. Vamos começar?";

export const WelcomeAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cachedAudioRef = useRef<string | null>(null);
  const { toast } = useToast();

  // Pre-load audio on component mount (with silent failure for public links)
  useEffect(() => {
    const preloadAudio = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('text-to-speech', {
          body: { 
            text: WELCOME_TEXT,
            voiceId: 'IKne3meq5aSn9XLyUdCD'
          }
        });

        if (!error && data?.audioContent) {
          cachedAudioRef.current = data.audioContent;
          setIsPreloaded(true);
        }
      } catch (error) {
        // Silent failure for public access - audio will load on demand
        setIsPreloaded(false);
      }
    };

    // Small delay to not block initial page load
    const timeoutId = setTimeout(preloadAudio, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  const playWelcomeAudio = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);

    try {
      let audioContent = cachedAudioRef.current;

      // If not cached, fetch it
      if (!audioContent) {
        const { data, error } = await supabase.functions.invoke('text-to-speech', {
          body: { 
            text: WELCOME_TEXT,
            voiceId: 'IKne3meq5aSn9XLyUdCD'
          }
        });

        if (error) {
          throw new Error('Não foi possível carregar o áudio');
        }
        audioContent = data?.audioContent;
        cachedAudioRef.current = audioContent;
      }

      if (audioContent) {
        const audio = new Audio(`data:audio/mpeg;base64,${audioContent}`);
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
      // Silent console log, only show toast to user
      toast({
        title: "Áudio indisponível",
        description: "A mensagem de boas-vindas não está disponível no momento.",
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
            className={`rounded-full shadow-2xl border-4 border-primary/50 bg-primary/10 hover:bg-primary/20 hover:scale-110 transition-all ${
              isPreloaded ? 'animate-[pulse_1.5s_ease-in-out_infinite]' : 'opacity-70'
            }`}
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
          <p className="text-sm font-semibold text-foreground/80">
            {isPreloaded ? 'Pronto! Clique para ouvir' : 'Carregando...'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
