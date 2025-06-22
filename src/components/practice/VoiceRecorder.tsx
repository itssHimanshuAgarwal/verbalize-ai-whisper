
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Square } from 'lucide-react';

interface VoiceRecorderProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onTranscriptUpdate: (transcript: string) => void;
}

export const VoiceRecorder = ({ 
  isRecording, 
  onStartRecording, 
  onStopRecording, 
  onTranscriptUpdate 
}: VoiceRecorderProps) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onTranscriptUpdate(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      onStopRecording();
    };

    recognitionRef.current = recognition;
  }, [onTranscriptUpdate, onStopRecording]);

  const handleToggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      onStopRecording();
    } else {
      recognitionRef.current?.start();
      onStartRecording();
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Button
        onClick={handleToggleRecording}
        className={`relative h-16 w-16 rounded-full ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-blue-500 hover:bg-blue-600'
        } transition-all duration-300 shadow-lg`}
      >
        {isRecording ? (
          <Square className="h-6 w-6 text-white" />
        ) : (
          <Mic className="h-6 w-6 text-white" />
        )}
        {isRecording && (
          <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75" />
        )}
      </Button>
    </div>
  );
};
