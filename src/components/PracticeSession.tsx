
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SessionData } from '@/pages/Index';
import { VoiceRecorder } from './practice/VoiceRecorder';
import { ChatMessage } from './practice/ChatMessage';
import { PracticeHeader } from './practice/PracticeHeader';
import { Loader2, Send } from 'lucide-react';

interface PracticeSessionProps {
  sessionData: SessionData;
  onComplete: (transcript: string) => void;
  onBack: () => void;
}

const AI_PERSONAS = {
  salary: { name: "Sarah", role: "HR Manager", personality: "Professional, analytical" },
  business: { name: "Marcus", role: "Business Owner", personality: "Assertive, results-driven" },
  customer_service: { name: "Emma", role: "Customer", personality: "Frustrated, demanding resolution" },
  job_interview: { name: "David", role: "Hiring Manager", personality: "Thorough, evaluative" },
  landlord: { name: "Patricia", role: "Property Manager", personality: "Business-minded, policy-focused" },
  freelance: { name: "Alex", role: "Startup Founder", personality: "Budget-conscious, relationship-focused" }
};

export const PracticeSession = ({ sessionData, onComplete, onBack }: PracticeSessionProps) => {
  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; content: string; timestamp: Date }>>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const persona = AI_PERSONAS[sessionData.type];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startSession = async () => {
    setSessionStarted(true);
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/start-negotiation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: sessionData.type,
          scenario: sessionData.scenario,
          userGoal: sessionData.userGoal,
          persona: persona
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([{
          role: 'ai',
          content: data.message,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Error",
        description: "Failed to start the practice session. Please try again.",
        className: "bg-red-50 border-red-200 text-red-800"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    const userMsg = {
      role: 'user' as const,
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/continue-negotiation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: messages,
          sessionData: sessionData
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          role: 'ai',
          content: data.message,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        className: "bg-red-50 border-red-200 text-red-800"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteSession = () => {
    const fullTranscript = messages
      .map(msg => `${msg.role === 'user' ? 'You' : persona.name}: ${msg.content}`)
      .join('\n\n');
    
    onComplete(fullTranscript);
  };

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <PracticeHeader
          sessionType={sessionData.type}
          scenario={sessionData.scenario}
          userGoal={sessionData.userGoal}
          persona={persona}
          onBack={onBack}
        />
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white font-bold">{persona.name[0]}</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Practice with {persona.name}?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {persona.name} is a {persona.role} who is {persona.personality.toLowerCase()}. 
                Take your time to think about your approach and remember your goal.
              </p>
            </div>

            <Card className="p-8 bg-white shadow-xl border-0">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Quick Tips</h3>
                <ul className="text-left space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Stay confident and maintain eye contact (even in practice)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Listen actively to understand their perspective
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Use specific examples to support your points
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Be prepared to find win-win solutions
                  </li>
                </ul>
              </div>
              
              <Button 
                onClick={startSession}
                disabled={isProcessing}
                className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Starting Session...
                  </>
                ) : (
                  'Start Practice Session'
                )}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <PracticeHeader
        sessionType={sessionData.type}
        scenario={sessionData.scenario}
        userGoal={sessionData.userGoal}
        persona={persona}
        onBack={onBack}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Card className="h-[600px] flex flex-col bg-white shadow-xl border-0 rounded-2xl">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                  persona={message.role === 'ai' ? persona : undefined}
                />
              ))}
              {isProcessing && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  </div>
                  <Card className="p-4 bg-gray-100 rounded-2xl rounded-bl-md">
                    <p className="text-sm text-gray-600">{persona.name} is thinking...</p>
                  </Card>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t bg-gray-50 p-6 rounded-b-2xl">
              <div className="flex items-center justify-center gap-4">
                <VoiceRecorder
                  isRecording={isRecording}
                  onStartRecording={() => setIsRecording(true)}
                  onStopRecording={() => setIsRecording(false)}
                  onTranscriptUpdate={setCurrentTranscript}
                />
                
                <Button
                  onClick={() => {
                    if (currentTranscript.trim()) {
                      sendMessage(currentTranscript);
                      setCurrentTranscript('');
                    }
                  }}
                  disabled={!currentTranscript.trim() || isProcessing}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {currentTranscript && (
                <div className="mt-4 p-3 bg-white rounded-lg border">
                  <p className="text-sm text-gray-700">{currentTranscript}</p>
                </div>
              )}
              
              <div className="mt-4 text-center">
                <Button
                  onClick={handleCompleteSession}
                  variant="outline"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Complete Session & Get Feedback
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
