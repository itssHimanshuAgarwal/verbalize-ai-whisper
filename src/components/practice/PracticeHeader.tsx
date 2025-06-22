
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Target, User } from 'lucide-react';
import { NegotiationType } from '@/pages/Index';

interface PracticeHeaderProps {
  sessionType: NegotiationType;
  scenario: string;
  userGoal: string;
  persona: {
    name: string;
    role: string;
    personality: string;
  };
  onBack: () => void;
}

const typeLabels = {
  salary: 'Salary Negotiation',
  business: 'Business Deal',
  customer_service: 'Customer Service',
  job_interview: 'Job Interview',
  landlord: 'Landlord Discussion',
  freelance: 'Freelance Contract'
};

export const PracticeHeader = ({ 
  sessionType, 
  scenario, 
  userGoal, 
  persona, 
  onBack 
}: PracticeHeaderProps) => {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Scenarios
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {typeLabels[sessionType]}
            </h1>
            <p className="text-gray-600">Practice Session</p>
          </div>
          
          <div className="w-24" /> {/* Spacer for balance */}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-blue-900">Your Goal</h3>
            </div>
            <p className="text-sm text-blue-800">{userGoal}</p>
          </Card>

          <Card className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-purple-900">AI Persona</h3>
            </div>
            <p className="text-sm text-purple-800 font-medium">{persona.name}</p>
            <p className="text-xs text-purple-700">{persona.role} • {persona.personality}</p>
          </Card>

          <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <h3 className="font-semibold text-green-900">Scenario</h3>
            </div>
            <p className="text-sm text-green-800">{scenario}</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
