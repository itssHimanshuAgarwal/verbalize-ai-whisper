
import { useState } from 'react';
import { Hero } from '@/components/Hero';
import { ScenarioSelector } from '@/components/ScenarioSelector';
import { PracticeSession } from '@/components/PracticeSession';
import { FeedbackReport } from '@/components/FeedbackReport';
import { Features } from '@/components/Features';
import { Testimonials } from '@/components/Testimonials';

export type NegotiationType = 'salary' | 'business' | 'customer_service' | 'job_interview' | 'landlord' | 'freelance';

export interface SessionData {
  type: NegotiationType;
  scenario: string;
  userGoal: string;
  transcript: string;
  feedback?: FeedbackData;
}

export interface FeedbackData {
  overallScore: number;
  confidence: number;
  persuasiveness: number;
  clarity: number;
  strengths: string[];
  improvements: string[];
  keyMoments: string[];
  nextSteps: string[];
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'scenario' | 'practice' | 'feedback'>('welcome');
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  const handleStartPractice = () => {
    setCurrentStep('scenario');
  };

  const handleScenarioSelected = (data: Omit<SessionData, 'transcript'>) => {
    setSessionData({ ...data, transcript: '' });
    setCurrentStep('practice');
  };

  const handlePracticeComplete = (transcript: string) => {
    if (sessionData) {
      const updatedSession = { ...sessionData, transcript };
      setSessionData(updatedSession);
      setCurrentStep('feedback');
    }
  };

  const handleStartOver = () => {
    setSessionData(null);
    setCurrentStep('welcome');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Hero onStartPractice={handleStartPractice} />
            <Features />
            <Testimonials />
          </div>
        );
      case 'scenario':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
            <ScenarioSelector onScenarioSelect={handleScenarioSelected} />
          </div>
        );
      case 'practice':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
            {sessionData && (
              <PracticeSession 
                sessionData={sessionData} 
                onComplete={handlePracticeComplete}
                onBack={() => setCurrentStep('scenario')}
              />
            )}
          </div>
        );
      case 'feedback':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
            {sessionData && (
              <FeedbackReport 
                sessionData={sessionData}
                onStartOver={handleStartOver}
                onNewSession={() => setCurrentStep('scenario')}
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return renderCurrentStep();
};

export default Index;
