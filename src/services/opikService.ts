
// Using Opik REST API since JavaScript SDK is not publicly available yet
const OPIK_API_URL = 'https://api.opik.dev/v1/traces';
const OPIK_API_KEY = 'KlJBFBe13Q5Zc5BPC7Tdb2CX3';

export interface ConversationLog {
  sessionId: string;
  userMessage: string;
  aiResponse: string;
  timestamp: Date;
  negotiationType: string;
  persona: string;
  metrics?: {
    confidence?: number;
    clarity?: number;
    persuasiveness?: number;
  };
}

export const logConversation = async (data: ConversationLog) => {
  try {
    const payload = {
      name: `negotiation-${data.negotiationType}`,
      input: {
        userMessage: data.userMessage,
        persona: data.persona,
        sessionId: data.sessionId,
        negotiationType: data.negotiationType
      },
      output: {
        aiResponse: data.aiResponse
      },
      metadata: {
        negotiationType: data.negotiationType,
        timestamp: data.timestamp.toISOString(),
        metrics: data.metrics,
        app: 'verbalize-ai'
      },
      tags: ['negotiation', 'practice', data.negotiationType]
    };

    console.log('Logging to Opik:', payload);

    const response = await fetch(OPIK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPIK_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Opik API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Conversation logged to Opik successfully:', data.sessionId, result);
    return result;
  } catch (error) {
    console.warn('⚠️ Failed to log conversation to Opik:', error);
    // Don't throw - we don't want logging failures to break the app
    return null;
  }
};

export const logSessionMetrics = async (sessionId: string, metrics: {
  confidence: number;
  clarity: number;
  persuasiveness: number;
  overallScore: number;
}) => {
  try {
    const payload = {
      name: `session-metrics-${sessionId}`,
      input: { 
        sessionId,
        type: 'session_summary'
      },
      output: { 
        metrics,
        summary: `Session completed with overall score: ${metrics.overallScore}%`
      },
      metadata: {
        timestamp: new Date().toISOString(),
        type: 'session_summary',
        app: 'verbalize-ai'
      },
      tags: ['metrics', 'session-summary']
    };

    console.log('Logging session metrics to Opik:', payload);

    const response = await fetch(OPIK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPIK_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Opik API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Session metrics logged to Opik successfully:', sessionId, result);
    return result;
  } catch (error) {
    console.warn('⚠️ Failed to log session metrics to Opik:', error);
    return null;
  }
};
