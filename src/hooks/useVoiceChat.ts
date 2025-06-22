
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useVoiceChat = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('EXAVITQu4vr4xnSDxMaL'); // Sarah
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const availableVoices = [
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Professional female voice' },
    { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria', description: 'Clear female voice' },
    { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger', description: 'Professional male voice' },
    { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', description: 'Mature male voice' },
    { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', description: 'Young male voice' },
    { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', description: 'Friendly female voice' }
  ];

  const speakText = async (text: string) => {
    if (isSpeaking) return;
    
    try {
      setIsSpeaking(true);
      console.log('🔊 Starting TTS with voice:', selectedVoice, 'Text:', text.slice(0, 50) + '...');
      
      // Call the Supabase edge function with better error handling
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: text.slice(0, 1000), // Increase limit slightly
          voiceId: selectedVoice 
        }
      });

      if (error) {
        console.error('❌ Supabase function error:', error);
        throw new Error(`TTS service error: ${error.message || 'Unknown error'}`);
      }

      if (!data) {
        throw new Error('No response from TTS service');
      }

      if (data.error) {
        throw new Error(`TTS API error: ${data.error}`);
      }

      if (!data.audioContent) {
        throw new Error('No audio content received from TTS service');
      }

      console.log('✅ TTS response received, audio length:', data.audioContent.length);
      
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      
      // Create and play new audio
      const audioUrl = `data:audio/mp3;base64,${data.audioContent}`;
      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.onended = () => {
        console.log('🔊 Audio playback finished');
        setIsSpeaking(false);
      };
      
      audioRef.current.onerror = (e) => {
        console.error('❌ Audio playback error:', e);
        setIsSpeaking(false);
        toast({
          title: "Audio playback failed",
          description: "Could not play generated speech. Check your browser audio settings.",
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
      
      let errorMessage = "Could not generate speech from text";
      if (error instanceof Error) {
        if (error.message.includes('API key') || error.message.includes('Unauthorized')) {
          errorMessage = "ElevenLabs API key not configured or invalid. Please check your API key.";
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          errorMessage = "ElevenLabs API quota exceeded. Please check your account limits.";
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = "Network error - check your internet connection";
        } else if (error.message.toLowerCase().includes('audio')) {
          errorMessage = "Audio playback failed - check your browser settings";
        } else {
          errorMessage = `Speech generation failed: ${error.message}`;
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
      audioRef.current.currentTime = 0;
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
    setIsListening,
    selectedVoice,
    setSelectedVoice,
    availableVoices
  };
};
