
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Features = () => {
  const features = [
    {
      icon: "🎭",
      title: "Realistic AI Personas",
      description: "Practice with AI characters that mimic real negotiation partners - from tough hiring managers to budget-conscious clients.",
      highlight: "Advanced AI Psychology"
    },
    {
      icon: "📊",
      title: "Instant Performance Analysis",
      description: "Get detailed feedback on your confidence, persuasiveness, and clarity with specific suggestions for improvement.",
      highlight: "AI-Powered Insights"
    },
    {
      icon: "🎯",
      title: "Scenario-Based Training",
      description: "Practice salary negotiations, business deals, customer service, and more with customizable scenarios.",
      highlight: "Real-World Practice"
    },
    {
      icon: "⚡",
      title: "Real-Time Coaching",
      description: "Receive live guidance during your practice sessions to improve your negotiation skills on the spot.",
      highlight: "Live Feedback"
    },
    {
      icon: "📈",
      title: "Progress Tracking",
      description: "Monitor your improvement over time with detailed analytics and personalized recommendations.",
      highlight: "Growth Metrics"
    },
    {
      icon: "🔐",
      title: "Safe Practice Environment",
      description: "Build confidence in a risk-free environment before your real high-stakes conversations.",
      highlight: "Zero Risk Training"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 bg-white">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          Why Choose Confidant AI?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our AI-powered platform provides everything you need to master the art of negotiation
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <Card key={index} className="h-full hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {feature.highlight}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center leading-relaxed">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-xl max-w-4xl mx-auto">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Negotiation Skills?</h3>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of professionals who have improved their negotiation confidence with Confidant AI
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                ✓ No Credit Card Required
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                ✓ Instant Feedback
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                ✓ Professional Results
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
