
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, ArrowLeft, Send } from 'lucide-react';
import { getSessionResults } from '@/components/SessionResultSaver';
import { logConversation } from '@/services/opikService';
import { useNavigate } from 'react-router-dom';

interface SessionResult {
  sessionId: string;
  date: string;
  negotiationType: string;
  confidence: number;
  clarity: number;
  persuasiveness: number;
  overallScore: number;
  transcript?: string;
}

const TranscriptViewer = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionResult[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionResult | null>(null);
  const [question, setQuestion] = useState('');
  const [aiAnswers, setAiAnswers] = useState<Array<{ question: string; answer: string; timestamp: Date }>>([]);
  const [isAsking, setIsAsking] = useState(false);

  useEffect(() => {
    const loadSessions = () => {
      const sessionData = getSessionResults();
      console.log('📋 Loaded sessions for transcript viewer:', sessionData);
      setSessions(sessionData.filter(session => session.transcript));
    };

    loadSessions();
  }, []);

  const generateAIAnswer = (question: string, transcript: string) => {
    // Mock AI responses based on common transcript analysis questions
    const responses = {
      summary: [
        "This conversation showed good engagement with clear communication patterns. The user demonstrated active listening and asked relevant follow-up questions.",
        "The dialogue reveals a structured negotiation approach with both parties presenting their positions clearly and working toward compromise.",
        "This session shows progression in confidence, with the user becoming more assertive as the conversation developed."
      ],
      improvements: [
        "Consider being more specific with your initial proposals. Adding concrete numbers or examples strengthens your position.",
        "You could improve by acknowledging the other party's concerns more explicitly before presenting counter-arguments.",
        "Try to ask more open-ended questions to better understand the other person's underlying needs and motivations."
      ],
      strengths: [
        "Excellent use of active listening techniques and summarizing what you heard to confirm understanding.",
        "Strong confidence in presenting your position while remaining respectful and professional throughout.",
        "Good strategic thinking - you identified key leverage points and used them effectively in the negotiation."
      ],
      tone: [
        "Your tone remained professional and collaborative throughout the conversation, which helped maintain a positive atmosphere.",
        "The conversation tone was appropriately assertive without being aggressive - this balance is crucial for successful negotiations.",
        "You maintained emotional control even when faced with challenging responses, showing maturity in your communication style."
      ]
    };

    // Simple keyword matching to provide relevant responses
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('summary') || lowerQuestion.includes('what happened')) {
      return responses.summary[Math.floor(Math.random() * responses.summary.length)];
    } else if (lowerQuestion.includes('improve') || lowerQuestion.includes('better') || lowerQuestion.includes('advice')) {
      return responses.improvements[Math.floor(Math.random() * responses.improvements.length)];
    } else if (lowerQuestion.includes('strength') || lowerQuestion.includes('good') || lowerQuestion.includes('well')) {
      return responses.strengths[Math.floor(Math.random() * responses.strengths.length)];
    } else if (lowerQuestion.includes('tone') || lowerQuestion.includes('sound') || lowerQuestion.includes('came across')) {
      return responses.tone[Math.floor(Math.random() * responses.tone.length)];
    } else {
      return "Based on your transcript, I can see several interesting patterns in your communication style. Would you like me to focus on a specific aspect like your negotiation strategy, communication tone, or areas for improvement?";
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || !selectedSession) return;

    console.log('🤔 Processing question about transcript:', question);
    setIsAsking(true);

    // Simulate AI processing delay
    setTimeout(async () => {
      const aiResponse = generateAIAnswer(question, selectedSession.transcript || '');
      const newAnswer = {
        question: question,
        answer: aiResponse,
        timestamp: new Date()
      };

      setAiAnswers(prev => [...prev, newAnswer]);
      
      // Log this Q&A interaction to Opik
      console.log('📝 Logging transcript Q&A to Opik...');
      await logConversation({
        sessionId: `qa_${selectedSession.sessionId}_${Date.now()}`,
        userMessage: question,
        aiResponse: aiResponse,
        timestamp: new Date(),
        negotiationType: 'transcript_analysis',
        persona: 'AI Transcript Analyzer'
      });

      setQuestion('');
      setIsAsking(false);
    }, 1500);
  };

  const formatTranscript = (transcript: string) => {
    const lines = transcript.split('\n\n');
    return lines.map((line, index) => {
      const [speaker, ...messageParts] = line.split(': ');
      const message = messageParts.join(': ');
      const isUser = speaker === 'You';
      
      return (
        <div key={index} className={`mb-4 ${isUser ? 'text-right' : 'text-left'}`}>
          <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
            isUser 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            <div className="font-semibold text-sm mb-1">{speaker}</div>
            <div>{message}</div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Transcript Viewer & AI Assistant</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Your Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No practice sessions found. Complete a practice session to view transcripts.
                </p>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <Card 
                      key={session.sessionId}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedSession?.sessionId === session.sessionId ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => {
                        setSelectedSession(session);
                        setAiAnswers([]);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="capitalize">
                            {session.negotiationType.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm text-gray-500">{session.date}</span>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium text-gray-700">
                            Overall Score: {session.overallScore}%
                          </div>
                          <div className="text-gray-600 mt-1">
                            Click to view transcript
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {selectedSession ? (
              <>
                {/* Conversation Transcript */}
                <Card>
                  <CardHeader>
                    <CardTitle className="capitalize">
                      {selectedSession.negotiationType.replace('_', ' ')} Session - {selectedSession.date}
                    </CardTitle>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>Confidence: {selectedSession.confidence}%</span>
                      <span>Clarity: {selectedSession.clarity}%</span>
                      <span>Persuasiveness: {selectedSession.persuasiveness}%</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 overflow-y-auto bg-gray-50 p-4 rounded-lg">
                      {selectedSession.transcript ? 
                        formatTranscript(selectedSession.transcript) : 
                        <p className="text-gray-500">No transcript available</p>
                      }
                    </div>
                  </CardContent>
                </Card>

                {/* AI Q&A Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ask AI About Your Performance</CardTitle>
                    <p className="text-sm text-gray-600">
                      Ask questions about your conversation, get insights, and improve your skills.
                    </p>
                  </CardHeader>
                  <CardContent>
                    {/* Previous Q&A */}
                    {aiAnswers.length > 0 && (
                      <div className="mb-6 space-y-4">
                        {aiAnswers.map((qa, index) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <div className="font-medium text-gray-800 mb-2">
                              Q: {qa.question}
                            </div>
                            <div className="text-gray-600 mb-2">
                              A: {qa.answer}
                            </div>
                            <div className="text-xs text-gray-400">
                              {qa.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        ))}
                        <Separator />
                      </div>
                    )}

                    {/* Question Input */}
                    <div className="space-y-4">
                      <div className="flex gap-2 text-xs text-gray-500 flex-wrap">
                        <span className="bg-gray-100 px-2 py-1 rounded">💡 Try: "How did I do overall?"</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">💡 Try: "What can I improve?"</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">💡 Try: "How was my tone?"</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Textarea
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder="Ask a question about your conversation... e.g., 'How did I handle the negotiation?' or 'What were my strengths?'"
                          className="flex-1 resize-none"
                          rows={2}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleAskQuestion();
                            }
                          }}
                        />
                        <Button
                          onClick={handleAskQuestion}
                          disabled={!question.trim() || isAsking}
                          className="self-end"
                        >
                          {isAsking ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Thinking...
                            </div>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Ask AI
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Select a Session
                  </h3>
                  <p className="text-gray-500">
                    Choose a practice session from the left to view its transcript and ask AI questions about your performance.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptViewer;
