import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { SessionData } from '@/pages/Index';
import { logConversation } from '@/services/opikService';
import { saveSessionResult } from '@/components/SessionResultSaver';

interface PracticeSessionProps {
  sessionData: SessionData;
  onComplete: (transcript: string) => void;
  onBack: () => void;
}

const personas = {
  salary: { name: "Sarah", role: "Hiring Manager", personality: "Professional, data-driven, but fair" },
  business: { name: "Marcus", role: "Business Executive", personality: "Experienced, results-focused" },
  customer_service: { name: "Jennifer", role: "Frustrated Customer", personality: "Emotional, demanding, but reasonable" },
  job_interview: { name: "David", role: "Senior Interviewer", personality: "Thorough, challenging, but respectful" },
  landlord: { name: "Patricia", role: "Property Manager", personality: "Business-minded, policy-focused" },
  freelance: { name: "Alex", role: "Startup Founder", personality: "Budget-conscious, relationship-focused" }
};

export const PracticeSession = ({ sessionData, onComplete, onBack }: PracticeSessionProps) => {
  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; content: string; timestamp: Date }>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const persona = personas[sessionData.type];

  useEffect(() => {
    if (!sessionStarted) {
      // Start with AI greeting
      const greeting = generateAIGreeting();
      setMessages([{ role: 'ai', content: greeting, timestamp: new Date() }]);
      setSessionStarted(true);
    }
  }, [sessionStarted]);

  const generateAIGreeting = () => {
    const greetings = {
      salary: "Hello! I'm Sarah, and I'll be conducting this interview today. I see you're interested in discussing the compensation package. Let's start - what are your salary expectations for this role?",
      business: "Good morning! I'm Marcus from the partnership development team. I understand you have a proposal for us. Tell me, what value do you believe your services can bring to our organization?",
      customer_service: "Hi, I'm Jennifer and I'm really frustrated with your product. I've been dealing with this issue for weeks and I want a full refund. I don't think this is too much to ask!",
      job_interview: "Good afternoon! I'm David, and I'll be your interviewer today. I've reviewed your resume and I have some questions about your background. Let's start with why you're interested in this position.",
      landlord: "Hello, this is Patricia from property management. I received your message about the rent increase. I understand your concerns, but we need to discuss the market conditions and property maintenance costs.",
      freelance: "Hey there! I'm Alex, founder of TechStart. We're really excited about potentially working with you on our project. However, I have to be honest - our budget is quite tight as a startup. Can we discuss your rates?"
    };
    
    return greetings[sessionData.type];
  };

  const generateAIResponse = (userMessage: string) => {
    const responses = {
      salary: [
        "I see you're asking for quite a bit above our initial offer. What specific value do you bring that justifies this increase?",
        "That's interesting. Can you tell me about your experience with similar projects and the results you achieved?",
        "I appreciate your research on market rates. However, we also need to consider your experience level and our budget constraints.",
        "Let me understand your perspective better. What would you say is your unique value proposition?"
      ],
      business: [
        "That's a compelling point. However, I'm concerned about the implementation timeline. How do you plan to address that?",
        "I like what I'm hearing, but our board is very cost-conscious right now. Can you work with us on the pricing?",
        "Interesting proposal. What guarantees can you provide for the results you're promising?",
        "I appreciate the detailed explanation. Let me present a counter-proposal that might work better for both parties."
      ],
      customer_service: [
        "I understand you're frustrated, but our policy is clear about the 30-day return window. However, let me see what else we can do.",
        "Look, I've been using this product for months! Surely there's something you can do to make this right?",
        "I'm not looking for excuses, I just want a solution. What other options do we have?",
        "Okay, I appreciate that you're trying to help. But I really need this resolved today. What's your best offer?"
      ],
      job_interview: [
        "That's a good start, but I'd like to dig deeper into your problem-solving approach. Can you give me a specific example?",
        "I notice there's a gap in your employment history. Can you walk me through what happened during that time?",
        "Your technical skills seem solid, but how do you handle working with difficult team members or stakeholders?",
        "That's helpful context. Now, what questions do you have for me about the role or the company?"
      ],
      landlord: [
        "I understand you've been a good tenant, but maintenance costs have increased significantly this year. We need to find a balance.",
        "The market has changed, and we need to adjust accordingly. However, I'm willing to discuss what repairs you think are most urgent.",
        "I appreciate your loyalty as a tenant. Let me see what flexibility I have with the increase amount.",
        "That's a fair point about the maintenance issues. If we address those, would you be more comfortable with a smaller increase?"
      ],
      freelance: [
        "I totally get that you have your standard rates, but as a startup, every dollar counts. Is there any flexibility in your pricing?",
        "What if we structured it differently? Maybe a lower hourly rate but with some equity or performance bonuses?",
        "I respect your experience and expertise. Help me understand what's included in your rate and where we might be able to optimize.",
        "That makes sense. What if we started with a smaller project to build trust, then discuss larger terms for future work?"
      ]
    };

    const possibleResponses = responses[sessionData.type];
    return possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMsg = { role: 'user' as const, content: currentMessage, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    
    // Log conversation to Opik
    await logConversation({
      sessionId,
      userMessage: currentMessage,
      aiResponse: '', // Will be updated when AI responds
      timestamp: new Date(),
      negotiationType: sessionData.type,
      persona: persona.name
    });

    setCurrentMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(async () => {
      const aiResponse = generateAIResponse(currentMessage);
      const aiMsg = { role: 'ai' as const, content: aiResponse, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      
      // Log AI response to Opik
      await logConversation({
        sessionId,
        userMessage: userMsg.content,
        aiResponse,
        timestamp: new Date(),
        negotiationType: sessionData.type,
        persona: persona.name
      });
      
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleEndSession = () => {
    console.log('Ending session with messages:', messages);
    
    const transcript = messages
      .map(msg => `${msg.role === 'ai' ? persona.name : 'You'}: ${msg.content}`)
      .join('\n\n');
    
    console.log('Generated transcript:', transcript);
    
    // Save session result to localStorage
    const savedResult = saveSessionResult({
      sessionId,
      negotiationType: sessionData.type,
      transcript
    });
    
    if (savedResult) {
      console.log('Session completed and saved successfully:', savedResult);
    } else {
      console.error('Failed to save session result');
    }
    
    onComplete(transcript);
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800">Practice Session</h2>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              🔴 Live Session
            </Badge>
            <Badge variant="outline">
              {messages.length} messages
            </Badge>
          </div>
        </div>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {persona.name[0]}
              </div>
              <div>
                <div className="font-semibold">{persona.name} - {persona.role}</div>
                <div className="text-sm text-gray-600">{persona.personality}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              <strong>Scenario:</strong> {sessionData.scenario}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 bg-white shadow-lg">
        <CardContent className="p-6">
          <div className="h-96 overflow-y-auto mb-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-4 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="font-medium text-sm mb-1">
                    {msg.role === 'user' ? 'You' : persona.name}
                  </div>
                  <div>{msg.content}</div>
                  <div className="text-xs opacity-70 mt-2">
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-4 rounded-lg max-w-[70%]">
                  <div className="font-medium text-sm mb-1">{persona.name}</div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type your response..."
              className="flex-1 resize-none"
              rows={3}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim()}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Send
              </Button>
              <Button
                onClick={handleEndSession}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                End Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          ← Back to Scenarios
        </Button>
        
        <div className="text-sm text-gray-500">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};
