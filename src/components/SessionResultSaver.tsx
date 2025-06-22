
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

    // Get existing sessions with multiple attempts for robustness
    let existingSessions = null;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts && existingSessions === null) {
      try {
        const stored = localStorage.getItem('practiceSessionResults');
        console.log(`Attempt ${attempts + 1} - Existing sessions from storage:`, stored);
        existingSessions = stored;
        break;
      } catch (e) {
        console.warn(`Attempt ${attempts + 1} failed to read localStorage:`, e);
        attempts++;
      }
    }
    
    const sessions: SessionResult[] = existingSessions ? JSON.parse(existingSessions) : [];
    console.log('Parsed existing sessions:', sessions);
    
    // Check if this session already exists (prevent duplicates)
    const existingIndex = sessions.findIndex(s => s.sessionId === sessionData.sessionId);
    if (existingIndex >= 0) {
      console.log('Session already exists, updating:', sessionData.sessionId);
      sessions[existingIndex] = sessionResult;
    } else {
      console.log('Adding new session:', sessionData.sessionId);
      sessions.push(sessionResult);
    }
    
    console.log('Sessions after adding/updating:', sessions);
    
    // Save with retry logic
    let saved = false;
    attempts = 0;
    
    while (attempts < maxAttempts && !saved) {
      try {
        localStorage.setItem('practiceSessionResults', JSON.stringify(sessions));
        
        // Verify it was saved
        const verifyData = localStorage.getItem('practiceSessionResults');
        if (verifyData) {
          const verifyParsed = JSON.parse(verifyData);
          if (verifyParsed.length === sessions.length) {
            console.log('Session saved and verified successfully');
            saved = true;
            break;
          }
        }
      } catch (e) {
        console.warn(`Save attempt ${attempts + 1} failed:`, e);
        attempts++;
      }
    }
    
    if (!saved) {
      throw new Error('Failed to save session after multiple attempts');
    }
    
    console.log('Session result saved successfully:', sessionResult);
    console.log('Total sessions now:', sessions.length);
    
    // Trigger a storage event for other tabs/windows
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'practiceSessionResults',
      oldValue: existingSessions,
      newValue: JSON.stringify(sessions),
      url: window.location.href
    }));
    
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
    
    if (!storedSessions) {
      console.log('No stored sessions found');
      return [];
    }
    
    const parsed = JSON.parse(storedSessions);
    console.log('Parsed session results:', parsed);
    
    // Sort by date (newest first) for better UX
    return parsed.sort((a: SessionResult, b: SessionResult) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error('Error loading session results:', error);
    return [];
  }
};

// Helper function to clear all sessions (for debugging)
export const clearAllSessions = () => {
  try {
    localStorage.removeItem('practiceSessionResults');
    console.log('All sessions cleared');
    return true;
  } catch (error) {
    console.error('Error clearing sessions:', error);
    return false;
  }
};
