
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useVoiceChat = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const speakText = async (text: string, voiceId: string = 'EXAVITQu4vr4xnSDxMaL') => {
    if (isSpeaking) return;
    
    try {
      setIsSpeaking(true);
      
      // Call ElevenLabs text-to-speech
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: text.slice(0, 500), // Limit text length
          voiceId 
        })
      });

      if (!response.ok) {
        throw new Error('Text-to-speech failed');
      }

      const { audioContent } = await response.json();
      
      // Create audio element and play
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio(`data:audio/mp3;base64,${audioContent}`);
      audioRef.current.onended = () => setIsSpeaking(false);
      audioRef.current.onerror = () => {
        setIsSpeaking(false);
        toast({
          title: "Audio playback failed",
          description: "Could not play generated speech",
          variant: "destructive",
        });
      };
      
      await audioRef.current.play();
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      setIsSpeaking(false);
      toast({
        title: "Speech generation failed",
        description: "Could not generate speech from text",
        variant: "destructive",
      });
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
  };

  return {
    isSpeaking,
    isListening,
    speakText,
    stopSpeaking,
    setIsListening
  };
};
