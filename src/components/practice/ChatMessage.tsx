
import { Card } from '@/components/ui/card';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  role: 'ai' | 'user';
  content: string;
  timestamp: Date;
  persona?: {
    name: string;
    role: string;
    personality: string;
  };
}

export const ChatMessage = ({ role, content, timestamp, persona }: ChatMessageProps) => {
  const isUser = role === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'
      }`}>
        {isUser ? (
          <User className="h-5 w-5 text-white" />
        ) : (
          <Bot className="h-5 w-5 text-white" />
        )}
      </div>
      
      <div className={`flex-1 max-w-xs md:max-w-md ${isUser ? 'text-right' : 'text-left'}`}>
        <Card className={`p-4 ${
          isUser 
            ? 'bg-blue-500 text-white ml-auto' 
            : 'bg-white border shadow-sm'
        } rounded-2xl ${isUser ? 'rounded-br-md' : 'rounded-bl-md'}`}>
          {!isUser && persona && (
            <div className="text-sm font-medium text-gray-600 mb-1">
              {persona.name} • {persona.role}
            </div>
          )}
          <p className={`text-sm ${isUser ? 'text-white' : 'text-gray-800'}`}>
            {content}
          </p>
        </Card>
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
