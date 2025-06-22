
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
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
  const [voiceInputEnabled, setVoiceInputEnabled] = useState(true);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    if (!voiceInputEnabled) {
      toast({
        title: "Voice input disabled",
        description: "Enable voice input in settings to use this feature",
        variant: "destructive",
      });
      return;
    }

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
    if (!voiceOutputEnabled) return;
    
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
        disabled={isListening || !voiceInputEnabled}
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
            {voiceInputEnabled ? "Voice" : "Disabled"}
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowSettings(!showSettings)}
        className="flex items-center gap-2"
      >
        <Settings className="w-4 h-4" />
      </Button>

      {showSettings && (
        <Card className="absolute top-12 right-0 z-10 w-64">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="voice-input">Voice Input</Label>
              <Switch
                id="voice-input"
                checked={voiceInputEnabled}
                onCheckedChange={setVoiceInputEnabled}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="voice-output">Voice Output</Label>
              <Switch
                id="voice-output"
                checked={voiceOutputEnabled}
                onCheckedChange={setVoiceOutputEnabled}
              />
            </div>
            <div className="text-xs text-gray-500">
              Toggle voice features on/off for text-only mode
            </div>
          </CardContent>
        </Card>
      )}

      {isRecording && voiceInputEnabled && (
        <Badge variant="destructive" className="animate-pulse">
          🔴 Recording
        </Badge>
      )}

      {isSpeaking && voiceOutputEnabled && (
        <Badge variant="secondary" className="animate-pulse">
          🔊 Speaking
        </Badge>
      )}

      {!voiceInputEnabled && !voiceOutputEnabled && (
        <Badge variant="outline">
          📝 Text Only
        </Badge>
      )}
    </div>
  );
};
