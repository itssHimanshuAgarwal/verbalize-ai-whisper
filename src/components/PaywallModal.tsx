
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionCount: number;
}

export const PaywallModal = ({ isOpen, onClose, sessionCount }: PaywallModalProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: 'price_monthly' }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: "Unable to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription>
            You've used {sessionCount} out of 5 free practice sessions. Upgrade to continue practicing unlimited!
          </DialogDescription>
        </DialogHeader>
        
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-center text-blue-800">
              Negotiation Practice Pro
            </CardTitle>
            <div className="text-center">
              <span className="text-3xl font-bold text-blue-900">$15</span>
              <span className="text-blue-700">/month</span>
            </div>
            <p className="text-center text-sm text-blue-600 italic">
              Worth 3 coffees/monthly - definitely worth it! ☕️
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Unlimited practice sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">All negotiation scenarios</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Detailed feedback reports</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">SMS sharing</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Priority support</span>
              </div>
            </div>
            
            <Button 
              onClick={handleUpgrade} 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Processing..." : "Upgrade Now"}
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={onClose} 
              className="w-full"
            >
              Maybe Later
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
