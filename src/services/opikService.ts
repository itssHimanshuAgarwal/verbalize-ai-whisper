
// Using Opik REST API since JavaScript SDK is not publicly available yet
const OPIK_API_URL = 'https://api.opik.dev/v1/traces'; // Replace with your actual Opik API URL
const OPIK_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key (recommend using env variables)

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
    const response = await fetch(OPIK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPIK_API_KEY}`
      },
      body: JSON.stringify({
        name: `negotiation-${data.negotiationType}`,
        input: {
          userMessage: data.userMessage,
          persona: data.persona,
          sessionId: data.sessionId
        },
        output: {
          aiResponse: data.aiResponse
        },
        metadata: {
          negotiationType: data.negotiationType,
          timestamp: data.timestamp.toISOString(),
          metrics: data.metrics
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Opik API error: ${response.statusText}`);
    }

    console.log('Conversation logged to Opik:', data.sessionId);
  } catch (error) {
    console.error('Failed to log conversation to Opik:', error);
  }
};

export const logSessionMetrics = async (sessionId: string, metrics: {
  confidence: number;
  clarity: number;
  persuasiveness: number;
  overallScore: number;
}) => {
  try {
    const response = await fetch(OPIK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPIK_API_KEY}`
      },
      body: JSON.stringify({
        name: `session-metrics-${sessionId}`,
        input: { sessionId },
        output: { metrics },
        metadata: {
          timestamp: new Date().toISOString(),
          type: 'session_summary'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Opik API error: ${response.statusText}`);
    }
    
    console.log('Session metrics logged to Opik:', sessionId);
  } catch (error) {
    console.error('Failed to log session metrics to Opik:', error);
  }
};
