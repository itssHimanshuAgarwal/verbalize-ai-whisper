
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, BarChart3, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SessionMetrics {
  sessionId: string;
  date: string;
  negotiationType: string;
  confidence: number;
  clarity: number;
  persuasiveness: number;
  overallScore: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionMetrics[]>([]);
  const [averageMetrics, setAverageMetrics] = useState({
    confidence: 0,
    clarity: 0,
    persuasiveness: 0,
    overallScore: 0
  });

  useEffect(() => {
    // Mock data for now - in production this would fetch from Opik
    const mockSessions: SessionMetrics[] = [
      {
        sessionId: '1',
        date: '2024-06-20',
        negotiationType: 'salary',
        confidence: 85,
        clarity: 78,
        persuasiveness: 82,
        overallScore: 82
      },
      {
        sessionId: '2',
        date: '2024-06-19',
        negotiationType: 'business',
        confidence: 72,
        clarity: 85,
        persuasiveness: 79,
        overallScore: 79
      },
      {
        sessionId: '3',
        date: '2024-06-18',
        negotiationType: 'customer_service',
        confidence: 90,
        clarity: 88,
        persuasiveness: 75,
        overallScore: 84
      }
    ];

    setSessions(mockSessions);

    // Calculate averages
    const avgConfidence = mockSessions.reduce((sum, s) => sum + s.confidence, 0) / mockSessions.length;
    const avgClarity = mockSessions.reduce((sum, s) => sum + s.clarity, 0) / mockSessions.length;
    const avgPersuasiveness = mockSessions.reduce((sum, s) => sum + s.persuasiveness, 0) / mockSessions.length;
    const avgOverall = mockSessions.reduce((sum, s) => sum + s.overallScore, 0) / mockSessions.length;

    setAverageMetrics({
      confidence: Math.round(avgConfidence),
      clarity: Math.round(avgClarity),
      persuasiveness: Math.round(avgPersuasiveness),
      overallScore: Math.round(avgOverall)
    });
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">Performance Dashboard</h1>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <BarChart3 className="w-4 h-4 mr-1" />
            {sessions.length} Sessions Tracked
          </Badge>
        </div>

        {/* Average Metrics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Overall Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(averageMetrics.overallScore)}`}>
                {averageMetrics.overallScore}%
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <TrendingUp className="w-3 h-3" />
                Average across all sessions
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(averageMetrics.confidence)}`}>
                {averageMetrics.confidence}%
              </div>
              <div className="text-sm text-gray-500 mt-1">Your assertiveness level</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Clarity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(averageMetrics.clarity)}`}>
                {averageMetrics.clarity}%
              </div>
              <div className="text-sm text-gray-500 mt-1">Communication effectiveness</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Persuasiveness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(averageMetrics.persuasiveness)}`}>
                {averageMetrics.persuasiveness}%
              </div>
              <div className="text-sm text-gray-500 mt-1">Influence & negotiation skill</div>
            </CardContent>
          </Card>
        </div>

        {/* Session History */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Recent Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.sessionId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-medium capitalize">{session.negotiationType.replace('_', ' ')} Practice</div>
                      <div className="text-sm text-gray-500">{session.date}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Confidence</div>
                        <div className={`font-medium ${getScoreColor(session.confidence)}`}>
                          {session.confidence}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Clarity</div>
                        <div className={`font-medium ${getScoreColor(session.clarity)}`}>
                          {session.clarity}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Persuasiveness</div>
                        <div className={`font-medium ${getScoreColor(session.persuasiveness)}`}>
                          {session.persuasiveness}%
                        </div>
                      </div>
                    </div>
                    
                    <Badge variant={getScoreBadgeVariant(session.overallScore)}>
                      {session.overallScore}% Overall
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
