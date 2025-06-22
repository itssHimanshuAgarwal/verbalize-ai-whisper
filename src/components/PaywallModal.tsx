
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionCount: number;
}

const plans = [
  {
    name: "Pro Monthly",
    price: "$9.99",
    priceId: "price_monthly",
    description: "Perfect for regular practice",
    features: [
      "Unlimited practice sessions",
      "All negotiation scenarios",
      "Detailed feedback reports",
      "SMS sharing",
      "Priority support"
    ]
  },
  {
    name: "Pro Yearly",
    price: "$99.99",
    priceId: "price_yearly",
    description: "Best value - 2 months free!",
    popular: true,
    features: [
      "Unlimited practice sessions",
      "All negotiation scenarios",
      "Detailed feedback reports",
      "SMS sharing",
      "Priority support",
      "Save $20 per year"
    ]
  }
];

export const PaywallModal = ({ isOpen, onClose, sessionCount }: PaywallModalProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpgrade = async (priceId: string) => {
    setLoading(priceId);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: "There was an error creating your checkout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Upgrade to Continue Practicing</DialogTitle>
        </DialogHeader>
        
        <div className="text-center mb-6">
          <p className="text-lg text-gray-600 mb-2">
            You've completed <strong>{sessionCount} out of 5</strong> free practice sessions!
          </p>
          <p className="text-gray-500">
            Upgrade to Pro to unlock unlimited practice sessions and advanced features.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <Card key={plan.priceId} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="text-3xl font-bold text-blue-600">{plan.price}</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleUpgrade(plan.priceId)}
                  disabled={loading === plan.priceId}
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {loading === plan.priceId ? "Processing..." : "Choose Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center text-sm text-gray-500 mt-4">
          <p>Secure payment processing by Stripe</p>
          <p>Cancel anytime from your account settings</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
