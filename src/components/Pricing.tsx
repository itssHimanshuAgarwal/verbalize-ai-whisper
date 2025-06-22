
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with negotiation practice",
      features: [
        "5 practice sessions per month",
        "Basic AI personas",
        "Standard feedback reports",
        "Progress tracking",
        "Email support"
      ],
      buttonText: "Get Started Free",
      popular: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "For professionals serious about improving their negotiation skills",
      features: [
        "Unlimited practice sessions",
        "Advanced AI personas",
        "Detailed feedback & analytics",
        "Custom scenarios",
        "Real-time coaching",
        "Priority support",
        "Export transcripts"
      ],
      buttonText: "Start Pro Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For teams and organizations wanting to scale negotiation training",
      features: [
        "Everything in Pro",
        "Team management",
        "Custom AI personas",
        "Advanced analytics dashboard",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
        "SSO & security features"
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          Choose Your Plan
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Start free and upgrade as you grow. All plans include our core AI-powered negotiation training.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card key={index} className={`relative h-full hover:shadow-xl transition-all duration-300 border-0 ${
            plan.popular 
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white transform scale-105' 
              : 'bg-white shadow-lg'
          }`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-400 text-black font-semibold px-4 py-1">
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className={`text-2xl mb-2 ${plan.popular ? 'text-white' : 'text-gray-800'}`}>
                {plan.name}
              </CardTitle>
              <div className="mb-4">
                <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ml-1 ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                  {plan.period}
                </span>
              </div>
              <p className={`text-sm ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                {plan.description}
              </p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className={`h-5 w-5 mr-3 mt-0.5 ${
                      plan.popular ? 'text-green-300' : 'text-green-500'
                    }`} />
                    <span className={`text-sm ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full text-lg py-6 ${
                  plan.popular 
                    ? 'bg-white text-blue-600 hover:bg-gray-100' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Card className="bg-white shadow-lg border-0 max-w-2xl mx-auto">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">30-Day Money Back Guarantee</h3>
            <p className="text-gray-600 mb-6">
              Try our Pro plan risk-free. If you're not completely satisfied within 30 days, 
              we'll refund your money, no questions asked.
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <span>✓ No setup fees</span>
              <span>✓ Cancel anytime</span>
              <span>✓ 24/7 support</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
