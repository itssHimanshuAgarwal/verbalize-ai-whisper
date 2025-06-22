import { useState } from 'react';
import { Hero } from '@/components/Hero';
import { ScenarioSelector } from '@/components/ScenarioSelector';
import { PracticeSession } from '@/components/PracticeSession';
import { FeedbackReport } from '@/components/FeedbackReport';
import { Features } from '@/components/Features';
import { Pricing } from '@/components/Pricing';
import { AuthModal } from '@/components/AuthModal';
import { PaywallModal } from '@/components/PaywallModal';
import { UserMenu } from '@/components/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  
  const { user, loading, sessionCount, isSubscribed } = useAuth();

  const handleStartPractice = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    // Check if user has reached the free session limit
    if (!isSubscribed && sessionCount >= 5) {
      setShowPaywallModal(true);
      return;
    }
    
    setCurrentStep('scenario');
  };

  const handleScenarioSelected = (data: Omit<SessionData, 'transcript'>) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    if (!isSubscribed && sessionCount >= 5) {
      setShowPaywallModal(true);
      return;
    }
    
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {user && (
              <div className="absolute top-4 right-4">
                <UserMenu />
              </div>
            )}
            {!user && (
              <div className="absolute top-4 right-4">
                <Button onClick={() => setShowAuthModal(true)} variant="outline">
                  Sign In
                </Button>
              </div>
            )}
            <Hero onStartPractice={handleStartPractice} />
            <Features />
            <Pricing />
          </div>
        );
      case 'scenario':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
            <div className="absolute top-4 right-4">
              <UserMenu />
            </div>
            <ScenarioSelector onScenarioSelect={handleScenarioSelected} />
          </div>
        );
      case 'practice':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
            <div className="absolute top-4 right-4">
              <UserMenu />
            </div>
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
            <div className="absolute top-4 right-4">
              <UserMenu />
            </div>
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

  return (
    <>
      {renderCurrentStep()}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <PaywallModal 
        isOpen={showPaywallModal} 
        onClose={() => setShowPaywallModal(false)}
        sessionCount={sessionCount}
      />
    </>
  );
};

export default Index;
