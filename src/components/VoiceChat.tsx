
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface VoiceChatProps {
  onSpeechToText: (text: string) => void;
  onTextToSpeech: (text: string) => void;
  isListening?: boolean;
  isSpeaking?: boolean;
}

export const VoiceChat = ({ 
  onSpeechToText, 
  onTextToSpeech, 
  isListening = false, 
  isSpeaking = false 
}: VoiceChatProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioToText(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak now, click stop when done",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioToText = async (audioBlob: Blob) => {
    try {
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      // Call speech-to-text service
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: base64Audio })
      });
      
      if (!response.ok) {
        throw new Error('Speech-to-text failed');
      }
      
      const { text } = await response.json();
      if (text.trim()) {
        onSpeechToText(text);
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Speech recognition failed",
        description: "Could not convert speech to text",
        variant: "destructive",
      });
    }
  };

  const handleTextToSpeech = async (text: string) => {
    if (!audioEnabled) return;
    
    try {
      onTextToSpeech(text);
    } catch (error) {
      console.error('Error with text-to-speech:', error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isRecording ? "destructive" : "outline"}
        size="sm"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isListening}
        className="flex items-center gap-2"
      >
        {isRecording ? (
          <>
            <MicOff className="w-4 h-4" />
            Stop
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            Voice
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setAudioEnabled(!audioEnabled)}
        className="flex items-center gap-2"
      >
        {audioEnabled ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </Button>

      {isRecording && (
        <Badge variant="destructive" className="animate-pulse">
          🔴 Recording
        </Badge>
      )}

      {isSpeaking && audioEnabled && (
        <Badge variant="secondary" className="animate-pulse">
          🔊 Speaking
        </Badge>
      )}
    </div>
  );
};
