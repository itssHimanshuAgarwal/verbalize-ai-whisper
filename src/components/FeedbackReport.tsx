import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SessionData, FeedbackData } from '@/pages/Index';
import { SMSShareOption } from '@/components/SMSShareOption';

interface FeedbackReportProps {
  sessionData: SessionData;
  onStartOver: () => void;
  onNewSession: () => void;
}

export const FeedbackReport = ({ sessionData, onStartOver, onNewSession }: FeedbackReportProps) => {
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    // Simulate AI analysis
    setTimeout(() => {
      const analyzedFeedback = generateFeedback(sessionData);
      setFeedback(analyzedFeedback);
      setIsAnalyzing(false);
    }, 3000);
  }, [sessionData]);

  const generateFeedback = (data: SessionData): FeedbackData => {
    // Simulate AI analysis based on transcript
    const transcriptLength = data.transcript.length;
    const messageCount = data.transcript.split('\n\n').length;
    
    // Mock analysis based on scenario type and transcript
    const baseScore = 65 + Math.random() * 25;
    
    return {
      overallScore: Math.round(baseScore),
      confidence: Math.round(baseScore + (Math.random() - 0.5) * 20),
      persuasiveness: Math.round(baseScore + (Math.random() - 0.5) * 15),
      clarity: Math.round(baseScore + (Math.random() - 0.5) * 10),
      strengths: [
        "Strong opening statement that clearly established your position",
        "Good use of data and research to support your arguments",
        "Maintained professional tone throughout the conversation",
        "Showed flexibility and willingness to find win-win solutions"
      ],
      improvements: [
        "Could have asked more clarifying questions to understand the other party's constraints",
        "Missed opportunities to build rapport and establish common ground",
        "Could have been more assertive when presenting your key requirements",
        "Consider preparing more specific examples to illustrate your points"
      ],
      keyMoments: [
        "Excellent recovery when the hiring manager questioned your experience",
        "Strong negotiation tactic when you presented market research data",
        "Good compromise suggestion that addressed both parties' concerns",
        "Effective use of silence to let the other party respond"
      ],
      nextSteps: [
        "Practice your opening statement to make it more compelling",
        "Research common objections and prepare responses",
        "Work on active listening skills to better understand the other party",
        "Practice ending negotiations with clear next steps and timelines"
      ]
    };
  };

  if (isAnalyzing) {
    return (
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
            <h3 className="text-2xl font-bold mb-4">Analyzing Your Performance...</h3>
            <p className="text-gray-600 mb-6">
              Our AI is analyzing your conversation to provide personalized feedback
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Processing transcript...</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!feedback) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">Your Negotiation Report</h2>
        <p className="text-lg text-gray-600">
          Personalized feedback based on your practice session
        </p>
        <Badge className="mt-2 bg-blue-100 text-blue-800">
          Session completed • {new Date().toLocaleDateString()}
        </Badge>
      </div>

      {/* Add SMS Share Option before the other cards */}
      <div className="mb-8">
        <SMSShareOption 
          feedbackData={feedback} 
          scenarioType={sessionData.type} 
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg text-gray-700">Overall Score</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(feedback.overallScore)}`}>
              {feedback.overallScore}
            </div>
            <div className="text-gray-600 mb-4">out of 100</div>
            <Badge className={getScoreBadge(feedback.overallScore)}>
              {feedback.overallScore >= 80 ? 'Excellent' : feedback.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Skill Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Confidence</span>
                <span className={`text-sm font-bold ${getScoreColor(feedback.confidence)}`}>
                  {feedback.confidence}%
                </span>
              </div>
              <Progress value={feedback.confidence} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Persuasiveness</span>
                <span className={`text-sm font-bold ${getScoreColor(feedback.persuasiveness)}`}>
                  {feedback.persuasiveness}%
                </span>
              </div>
              <Progress value={feedback.persuasiveness} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Clarity</span>
                <span className={`text-sm font-bold ${getScoreColor(feedback.clarity)}`}>
                  {feedback.clarity}%
                </span>
              </div>
              <Progress value={feedback.clarity} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Session Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Scenario Type</span>
              <Badge variant="outline">{sessionData.type.replace('_', ' ')}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Duration</span>
              <span className="text-sm font-medium">~8 minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Messages</span>
              <span className="text-sm font-medium">{sessionData.transcript.split('\n\n').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Date</span>
              <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              ✅ Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              🎯 Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {feedback.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              💡 Key Moments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {feedback.keyMoments.map((moment, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{moment}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              🚀 Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {feedback.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onNewSession}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold"
        >
          🎯 Practice Another Scenario
        </Button>
        
        <Button
          variant="outline"
          onClick={onStartOver}
          className="border-2 border-gray-300 px-8 py-3 text-lg font-semibold"
        >
          📊 View All Features
        </Button>
      </div>
    </div>
  );
};
