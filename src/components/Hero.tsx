
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, TrendingUp, Users, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  onStartPractice: () => void;
}

export const Hero = ({ onStartPractice }: HeroProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Master the Art of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Negotiation
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Practice real-world negotiation scenarios with AI-powered personas. Get instant feedback, 
            track your progress, and build confidence in any conversation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={onStartPractice}
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Start Practicing Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/transcripts')}
              className="px-8 py-6 text-lg"
            >
              <FileText className="mr-2 h-5 w-5" />
              View My Transcripts
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/progress')}
              className="px-8 py-6 text-lg"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              View Progress
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Practice</h3>
              <p className="text-gray-600">
                Practice with realistic AI personas that adapt to your negotiation style and provide challenging scenarios.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
              <p className="text-gray-600">
                Monitor your improvement across confidence, clarity, and persuasiveness with detailed analytics.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-World Scenarios</h3>
              <p className="text-gray-600">
                From salary negotiations to business deals, practice the conversations that matter most to your career.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
