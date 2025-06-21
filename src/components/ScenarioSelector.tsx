
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { NegotiationType, SessionData } from '@/pages/Index';

interface ScenarioSelectorProps {
  onScenarioSelect: (data: Omit<SessionData, 'transcript'>) => void;
}

const scenarios = {
  salary: {
    title: "💼 Salary Negotiation",
    description: "Practice asking for a raise or negotiating job offers",
    persona: "Sarah, a tough but fair hiring manager",
    defaultScenario: "You're in a final-round interview for a senior developer position. You've done your research and know the market rate is $95,000-$110,000. They've offered $85,000. You want to negotiate to at least $100,000 plus benefits.",
    color: "bg-blue-100 text-blue-800"
  },
  business: {
    title: "🤝 Business Deal",
    description: "Navigate complex business negotiations and partnerships",
    persona: "Marcus, an experienced business executive",
    defaultScenario: "You're negotiating a partnership deal where your company will provide software services. The client wants a 20% discount on your standard rates, but you need to maintain at least 15% profit margin. Find a win-win solution.",
    color: "bg-green-100 text-green-800"
  },
  customer_service: {
    title: "📞 Customer Service",
    description: "Handle difficult customer situations and disputes",
    persona: "Jennifer, a frustrated customer",
    defaultScenario: "A customer is demanding a full refund for a product they've used for 2 months, claiming it doesn't work as advertised. Your company policy allows returns within 30 days. Find a solution that satisfies the customer while protecting company interests.",
    color: "bg-purple-100 text-purple-800"
  },
  job_interview: {
    title: "🎯 Job Interview",
    description: "Ace challenging interview questions and negotiations",
    persona: "David, a senior technical interviewer",
    defaultScenario: "You're interviewing for your dream job. The interviewer is asking tough questions about your experience gap and why you left your last job. You need to address their concerns while highlighting your strengths.",
    color: "bg-orange-100 text-orange-800"
  },
  landlord: {
    title: "🏠 Landlord Negotiation",
    description: "Negotiate rent, repairs, and lease terms",
    persona: "Patricia, a property manager",
    defaultScenario: "Your rent is being increased by 15%, but you've been a good tenant for 3 years. You want to negotiate a smaller increase and get some needed repairs done. The market rate is actually lower than your current rent.",
    color: "bg-indigo-100 text-indigo-800"
  },
  freelance: {
    title: "💻 Freelance Pricing",
    description: "Set rates and negotiate project terms confidently",
    persona: "Alex, a startup founder",
    defaultScenario: "A startup wants to hire you for a 3-month project. They're offering $50/hour but want to pay after project completion. You typically charge $75/hour with 50% upfront. Negotiate terms that work for both parties.",
    color: "bg-teal-100 text-teal-800"
  }
};

export const ScenarioSelector = ({ onScenarioSelect }: ScenarioSelectorProps) => {
  const [selectedType, setSelectedType] = useState<NegotiationType | null>(null);
  const [customScenario, setCustomScenario] = useState('');
  const [userGoal, setUserGoal] = useState('');

  const handleTypeSelect = (type: NegotiationType) => {
    setSelectedType(type);
    setCustomScenario(scenarios[type].defaultScenario);
    setUserGoal('');
  };

  const handleStartPractice = () => {
    if (selectedType && customScenario && userGoal) {
      onScenarioSelect({
        type: selectedType,
        scenario: customScenario,
        userGoal: userGoal
      });
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">Choose Your Practice Scenario</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the type of negotiation you want to practice, then customize the scenario to match your specific situation.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {Object.entries(scenarios).map(([key, scenario]) => (
          <Card 
            key={key}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedType === key ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
            }`}
            onClick={() => handleTypeSelect(key as NegotiationType)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{scenario.title}</CardTitle>
              <Badge className={scenario.color} variant="secondary">
                AI Persona: {scenario.persona}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">{scenario.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedType && (
        <Card className="max-w-4xl mx-auto bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>{scenarios[selectedType].title}</span>
              <Badge className={scenarios[selectedType].color} variant="secondary">
                Selected
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="scenario" className="text-base font-semibold text-gray-700">
                Scenario Details
              </Label>
              <p className="text-sm text-gray-500 mb-2">
                Customize this scenario to match your specific situation
              </p>
              <Textarea
                id="scenario"
                value={customScenario}
                onChange={(e) => setCustomScenario(e.target.value)}
                placeholder="Describe your negotiation scenario..."
                className="min-h-[120px] resize-none"
              />
            </div>

            <div>
              <Label htmlFor="goal" className="text-base font-semibold text-gray-700">
                Your Goal
              </Label>
              <p className="text-sm text-gray-500 mb-2">
                What do you want to achieve in this negotiation?
              </p>
              <Textarea
                id="goal"
                value={userGoal}
                onChange={(e) => setUserGoal(e.target.value)}
                placeholder="What's your ideal outcome? What are your minimum requirements?"
                className="min-h-[80px] resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleStartPractice}
                disabled={!customScenario || !userGoal}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
              >
                🚀 Start Practice Session
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedType(null)}
                className="px-6"
              >
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
