
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, TrendingUp, FileText, Brain, Target, Award } from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "AI-Powered Conversations",
      description: "Practice with intelligent AI personas that adapt to your negotiation style and provide realistic responses.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Brain,
      title: "Smart Feedback System",
      description: "Get detailed analysis of your performance with actionable insights to improve your negotiation skills.",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Target,
      title: "Scenario-Based Training",
      description: "Practice real-world scenarios from salary negotiations to business deals and customer service.",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your improvement over time with detailed analytics and performance metrics.",
      gradient: "from-orange-500 to-orange-600"
    },
    {
      icon: FileText,
      title: "Session Transcripts",
      description: "Review complete transcripts of your practice sessions to identify patterns and areas for improvement.",
      gradient: "from-pink-500 to-pink-600"
    },
    {
      icon: Award,
      title: "Professional Results",
      description: "Build confidence and achieve better outcomes in real-world negotiations with proven techniques.",
      gradient: "from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <div id="features" className="container mx-auto px-4 py-16 bg-white">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          Why Choose Verbalize AI?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our AI-powered platform provides comprehensive training tools designed to elevate your negotiation skills through practice and feedback.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="border-0 shadow-lg bg-white hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-8 text-center">
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
