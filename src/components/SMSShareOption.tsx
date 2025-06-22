
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FeedbackData } from '@/pages/Index';

interface SMSShareOptionProps {
  feedbackData: FeedbackData;
  scenarioType: string;
}

export const SMSShareOption = ({ feedbackData, scenarioType }: SMSShareOptionProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const formatFeedbackForSMS = () => {
    const message = `🎯 Your Negotiation Report
Overall Score: ${feedbackData.overallScore}/100
Scenario: ${scenarioType.replace('_', ' ')}

📊 Skills:
• Confidence ${feedbackData.confidence}%
• Persuasiveness ${feedbackData.persuasiveness}%
• Clarity ${feedbackData.clarity}%

✅ Top Strength: ${feedbackData.strengths[0]}

🎯 Key Improvement: ${feedbackData.improvements[0]}

💡 Next Step: ${feedbackData.nextSteps[0]}

Practice more at your negotiation app!`;

    return message;
  };

  const handleSendSMS = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    // Simple phone number validation
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number (e.g., +1234567890)",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          phoneNumber: phoneNumber,
          message: formatFeedbackForSMS(),
        },
      });

      if (error) {
        console.error('SMS Error:', error);
        toast({
          title: "Failed to send SMS",
          description: "There was an error sending your report. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "SMS sent successfully! 📱",
        description: "Your negotiation report has been sent to your phone.",
      });

      setPhoneNumber('');
    } catch (error) {
      console.error('SMS sending error:', error);
      toast({
        title: "Failed to send SMS",
        description: "There was an error sending your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          📱 Get Your Report via SMS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">
          Receive a summary of your negotiation performance directly on your phone!
        </p>
        <div className="flex gap-2">
          <Input
            type="tel"
            placeholder="Enter your phone number (e.g., +1234567890)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleSendSMS}
            disabled={isSending}
            className="bg-green-600 hover:bg-green-700 text-white px-6"
          >
            {isSending ? 'Sending...' : 'Send SMS'}
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Standard SMS rates may apply. We'll send a concise summary of your performance.
        </p>
      </CardContent>
    </Card>
  );
};
