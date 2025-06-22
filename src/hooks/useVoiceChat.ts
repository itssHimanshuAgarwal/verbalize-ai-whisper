
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useVoiceChat = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const speakText = async (text: string, voiceId: string = 'EXAVITQu4vr4xnSDxMaL') => {
    if (isSpeaking) return;
    
    try {
      setIsSpeaking(true);
      console.log('🔊 Starting TTS for:', text.slice(0, 50) + '...');
      
      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: text.slice(0, 500), // Limit text length
          voiceId 
        }
      });

      if (error) {
        console.error('❌ Supabase function error:', error);
        throw new Error(`TTS API error: ${error.message}`);
      }

      if (!data?.audioContent) {
        throw new Error('No audio content received from TTS service');
      }

      console.log('✅ TTS response received, creating audio...');
      
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // Create and play new audio
      audioRef.current = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      
      audioRef.current.onended = () => {
        console.log('🔊 Audio playback finished');
        setIsSpeaking(false);
      };
      
      audioRef.current.onerror = (e) => {
        console.error('❌ Audio playback error:', e);
        setIsSpeaking(false);
        toast({
          title: "Audio playback failed",
          description: "Could not play generated speech",
          variant: "destructive",
        });
      };
      
      audioRef.current.onloadstart = () => {
        console.log('🔊 Audio loading started...');
      };
      
      audioRef.current.oncanplay = () => {
        console.log('🔊 Audio ready to play');
      };
      
      await audioRef.current.play();
      console.log('🔊 Audio playback started successfully');
      
    } catch (error) {
      console.error('❌ TTS Error details:', error);
      setIsSpeaking(false);
      
      // Show more specific error messages
      let errorMessage = "Could not generate speech from text";
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = "ElevenLabs API key not configured properly";
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = "Network error - check your connection";
        } else if (error.message.includes('audio')) {
          errorMessage = "Audio playback failed - check your browser settings";
        }
      }
      
      toast({
        title: "Speech generation failed",
        description: errorMessage,
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
    console.log('🔇 Speech stopped');
  };

  return {
    isSpeaking,
    isListening,
    speakText,
    stopSpeaking,
    setIsListening
  };
};
