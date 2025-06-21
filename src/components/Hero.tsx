
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HeroProps {
  onStartPractice: () => void;
}

export const Hero = ({ onStartPractice }: HeroProps) => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium">
            🚀 AI-Powered Negotiation Coaching
          </Badge>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
          Verbalize AI
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
          Your Personal Negotiation Coach
        </p>
        
        <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
          Practice high-stakes conversations in a safe environment. Get instant, actionable feedback to negotiate with confidence and win.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button 
            onClick={onStartPractice}
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            🎯 Start Practice Session
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-semibold transition-all duration-300"
          >
            📊 View Demo
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Card className="p-8 text-center hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-md">
          <div className="text-4xl mb-4">💼</div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Salary Negotiations</h3>
          <p className="text-gray-600 leading-relaxed">
            Master the art of asking for a raise or negotiating job offers with confidence and data-backed strategies.
          </p>
        </Card>

        <Card className="p-8 text-center hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-md">
          <div className="text-4xl mb-4">🤝</div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Business Deals</h3>
          <p className="text-gray-600 leading-relaxed">
            Practice complex business negotiations, from contracts to partnerships, with AI-powered realistic scenarios.
          </p>
        </Card>

        <Card className="p-8 text-center hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-md">
          <div className="text-4xl mb-4">🎤</div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Customer Service</h3>
          <p className="text-gray-600 leading-relaxed">
            Handle difficult customer situations and disputes with proven techniques and real-time coaching.
          </p>
        </Card>
      </div>
    </div>
  );
};
