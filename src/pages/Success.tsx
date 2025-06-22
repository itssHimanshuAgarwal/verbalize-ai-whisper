
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';

const Success = () => {
  const { checkSubscription } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Refresh subscription status after successful payment
    if (sessionId) {
      setTimeout(() => {
        checkSubscription();
      }, 2000);
    }
  }, [sessionId, checkSubscription]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Welcome to Negotiation Practice Pro! Your subscription is now active and you have unlimited access to all practice sessions.
          </p>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">What's included:</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>✓ Unlimited practice sessions</li>
              <li>✓ All negotiation scenarios</li>
              <li>✓ Detailed feedback reports</li>
              <li>✓ SMS sharing</li>
              <li>✓ Priority support</li>
            </ul>
          </div>
          <Button onClick={() => navigate('/')} className="w-full">
            Start Practicing <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
