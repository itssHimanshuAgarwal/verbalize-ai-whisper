interface SessionResult {
  sessionId: string;
  date: string;
  negotiationType: string;
  confidence: number;
  clarity: number;
  persuasiveness: number;
  overallScore: number;
  transcript?: string;
}

export const saveSessionResult = (sessionData: {
  sessionId: string;
  negotiationType: string;
  transcript: string;
}) => {
  try {
    // Generate mock scores based on session length and content quality
    const messageCount = sessionData.transcript.split('\n\n').length;
    const transcriptLength = sessionData.transcript.length;
    
    // Simple scoring algorithm based on engagement
    const baseScore = Math.min(60 + (messageCount * 5) + (transcriptLength / 100), 95);
    const variation = () => Math.random() * 20 - 10; // -10 to +10 variation
    
    const confidence = Math.max(10, Math.min(100, Math.round(baseScore + variation())));
    const clarity = Math.max(10, Math.min(100, Math.round(baseScore + variation())));
    const persuasiveness = Math.max(10, Math.min(100, Math.round(baseScore + variation())));
    const overallScore = Math.round((confidence + clarity + persuasiveness) / 3);

    const sessionResult: SessionResult = {
      sessionId: sessionData.sessionId,
      date: new Date().toISOString().split('T')[0],
      negotiationType: sessionData.negotiationType,
      confidence,
      clarity,
      persuasiveness,
      overallScore,
      transcript: sessionData.transcript
    };

    // Get existing sessions
    const existingSessions = localStorage.getItem('practiceSessionResults');
    const sessions: SessionResult[] = existingSessions ? JSON.parse(existingSessions) : [];
    
    // Add new session
    sessions.push(sessionResult);
    
    // Keep only last 10 sessions
    const recentSessions = sessions.slice(-10);
    
    // Save back to localStorage
    localStorage.setItem('practiceSessionResults', JSON.stringify(recentSessions));
    
    console.log('Session result saved:', sessionResult);
    console.log('Total sessions:', recentSessions.length);
    
    return sessionResult;
  } catch (error) {
    console.error('Error saving session result:', error);
    return null;
  }
};

export const getSessionResults = (): SessionResult[] => {
  try {
    const storedSessions = localStorage.getItem('practiceSessionResults');
    return storedSessions ? JSON.parse(storedSessions) : [];
  } catch (error) {
    console.error('Error loading session results:', error);
    return [];
  }
};
