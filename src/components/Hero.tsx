import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, TrendingUp, FileText, Play, Sparkles, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface HeroProps {
  onStartPractice: () => void;
}

export const Hero = ({ onStartPractice }: HeroProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative">
        <div className="text-center mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            AI-Powered Negotiation Coach
          </div>

          <h1 className="text-4xl lg:text-7xl font-bold text-gray-900 mb-6 animate-fade-in">
            AI-powered{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              negotiation training
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              experiences
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in">
            Verbalize AI is the complete platform for building & deploying AI negotiation 
            training tools for your career success.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in">
            <Button 
              onClick={onStartPractice}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              {user ? 'Start Practicing Now' : 'Start Free Practice'}
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/transcripts')}
                className="px-6 py-6 text-lg rounded-full border-2 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
              >
                <FileText className="mr-2 h-5 w-5" />
                Transcripts
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/progress')}
                className="px-6 py-6 text-lg rounded-full border-2 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Progress
              </Button>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 mb-16">
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-blue-500" />
              Instant feedback
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Professional results
            </div>
            <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-medium">Opik passes successfully</span>
            </div>
          </div>
        </div>

        {/* Feature cards with hover effects */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Purpose-built for negotiations</h3>
              <p className="text-gray-600 leading-relaxed">
                AI personas with advanced reasoning capabilities for effective responses to complex negotiation scenarios.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Designed for simplicity</h3>
              <p className="text-gray-600 leading-relaxed">
                Create, manage, and deploy negotiation training easily, even without technical skills.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Engineered for success</h3>
              <p className="text-gray-600 leading-relaxed">
                Enjoy peace of mind with enterprise-grade security and strict compliance standards.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo section */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 lg:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            An end-to-end solution for conversational AI negotiation training
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-4xl mx-auto">
            With Verbalize AI, your practice sessions can effortlessly find improvement areas, resolve 
            confidence issues, and take meaningful actions through seamless and engaging AI-powered conversations.
          </p>
          
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="ml-auto text-sm text-gray-500">verbalize.ai</div>
            </div>
            <div className="text-left space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm">I understand you're looking for a salary increase. What specific accomplishments would you like to highlight?</p>
                </div>
              </div>
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs">
                  <p className="text-sm">I've increased our team's productivity by 40% this quarter...</p>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">You</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
