
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
    console.log('Attempting to save session:', sessionData);
    
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
    console.log('Existing sessions from storage:', existingSessions);
    
    const sessions: SessionResult[] = existingSessions ? JSON.parse(existingSessions) : [];
    console.log('Parsed existing sessions:', sessions);
    
    // Add new session
    sessions.push(sessionResult);
    console.log('Sessions after adding new one:', sessions);
    
    // Save all sessions (don't limit to 10 for now so user can see all their data)
    localStorage.setItem('practiceSessionResults', JSON.stringify(sessions));
    
    // Verify it was saved
    const savedData = localStorage.getItem('practiceSessionResults');
    console.log('Verified saved data:', savedData);
    
    console.log('Session result saved successfully:', sessionResult);
    console.log('Total sessions now:', sessions.length);
    
    return sessionResult;
  } catch (error) {
    console.error('Error saving session result:', error);
    return null;
  }
};

export const getSessionResults = (): SessionResult[] => {
  try {
    const storedSessions = localStorage.getItem('practiceSessionResults');
    console.log('Loading session results:', storedSessions);
    return storedSessions ? JSON.parse(storedSessions) : [];
  } catch (error) {
    console.error('Error loading session results:', error);
    return [];
  }
};
