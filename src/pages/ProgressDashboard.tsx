
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProgressCharts } from '@/components/ProgressCharts';

interface SessionData {
  sessionId: string;
  date: string;
  negotiationType: string;
  confidence: number;
  clarity: number;
  persuasiveness: number;
  overallScore: number;
}

const ProgressDashboard = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and fetch data
    const timer = setTimeout(() => {
      // Mock data - in production this would fetch from Opik or local storage
      const mockSessions: SessionData[] = [
        {
          sessionId: '1',
          date: '2024-06-17',
          negotiationType: 'salary',
          confidence: 72,
          clarity: 68,
          persuasiveness: 75,
          overallScore: 72
        },
        {
          sessionId: '2',
          date: '2024-06-18',
          negotiationType: 'business',
          confidence: 78,
          clarity: 82,
          persuasiveness: 71,
          overallScore: 77
        },
        {
          sessionId: '3',
          date: '2024-06-19',
          negotiationType: 'customer_service',
          confidence: 85,
          clarity: 79,
          persuasiveness: 83,
          overallScore: 82
        },
        {
          sessionId: '4',
          date: '2024-06-20',
          negotiationType: 'salary',
          confidence: 88,
          clarity: 85,
          persuasiveness: 86,
          overallScore: 86
        },
        {
          sessionId: '5',
          date: '2024-06-21',
          negotiationType: 'business',
          confidence: 91,
          clarity: 89,
          persuasiveness: 88,
          overallScore: 89
        }
      ];

      setSessions(mockSessions);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const EmptyState = () => (
    <div className="text-center py-12">
      <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Practice Sessions Yet</h3>
      <p className="text-gray-500 mb-6">
        Start your first negotiation practice session to see your progress here.
      </p>
      <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
        Start Practice Session
      </Button>
    </div>
  );

  const LoadingState = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    </div>
  );

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
            <h1 className="text-3xl font-bold text-gray-800">Progress Dashboard</h1>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <BarChart3 className="w-4 h-4 mr-1" />
            {sessions.length} Sessions Completed
          </Badge>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : sessions.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardContent>
              <EmptyState />
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-8">
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Keep Up the Great Work! 🎯</h2>
                      <p className="opacity-90">
                        You've completed {sessions.length} practice sessions. Your skills are improving!
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <ProgressCharts sessions={sessions} />

            <div className="mt-8 text-center">
              <Button 
                onClick={() => navigate('/')} 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Start Another Practice Session
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressDashboard;
