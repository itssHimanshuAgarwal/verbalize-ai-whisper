
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Target, MessageCircle } from 'lucide-react';

interface SessionData {
  sessionId: string;
  date: string;
  confidence: number;
  clarity: number;
  persuasiveness: number;
  overallScore: number;
}

interface ProgressChartsProps {
  sessions: SessionData[];
}

export const ProgressCharts = ({ sessions }: ProgressChartsProps) => {
  const chartConfig = {
    confidence: {
      label: "Confidence",
      color: "#3b82f6",
    },
    clarity: {
      label: "Clarity", 
      color: "#10b981",
    },
    persuasiveness: {
      label: "Persuasiveness",
      color: "#f59e0b",
    },
  };

  const chartData = sessions.map((session, index) => ({
    session: `Session ${index + 1}`,
    confidence: session.confidence,
    clarity: session.clarity,
    persuasiveness: session.persuasiveness,
  }));

  const latestSession = sessions[sessions.length - 1];
  const averages = {
    confidence: Math.round(sessions.reduce((sum, s) => sum + s.confidence, 0) / sessions.length),
    clarity: Math.round(sessions.reduce((sum, s) => sum + s.clarity, 0) / sessions.length),
    persuasiveness: Math.round(sessions.reduce((sum, s) => sum + s.persuasiveness, 0) / sessions.length),
  };

  return (
    <div className="space-y-6">
      {/* Current Progress Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confidence</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{latestSession?.confidence || averages.confidence}%</div>
            <Progress value={latestSession?.confidence || averages.confidence} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Average: {averages.confidence}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clarity</CardTitle>
            <MessageCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{latestSession?.clarity || averages.clarity}%</div>
            <Progress value={latestSession?.clarity || averages.clarity} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Average: {averages.clarity}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Persuasiveness</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{latestSession?.persuasiveness || averages.persuasiveness}%</div>
            <Progress value={latestSession?.persuasiveness || averages.persuasiveness} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Average: {averages.persuasiveness}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      {sessions.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Progress Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={chartData}>
                <XAxis dataKey="session" />
                <YAxis domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="confidence" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="clarity" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: "#10b981" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="persuasiveness" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ fill: "#f59e0b" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Bar Chart for Latest Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Latest Session Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={[{
              name: 'Latest Session',
              confidence: latestSession?.confidence || averages.confidence,
              clarity: latestSession?.clarity || averages.clarity,
              persuasiveness: latestSession?.persuasiveness || averages.persuasiveness,
            }]}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="confidence" fill="#3b82f6" />
              <Bar dataKey="clarity" fill="#10b981" />
              <Bar dataKey="persuasiveness" fill="#f59e0b" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
