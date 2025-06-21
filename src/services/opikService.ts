
import { Opik } from '@opik/javascript-sdk';

// Initialize Opik client with error handling
let opik: Opik | null = null;

try {
  opik = new Opik({
    // API key will be handled via environment or user input
  });
} catch (error) {
  console.warn('Opik initialization failed:', error);
}

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
  if (!opik) {
    console.warn('Opik not initialized, skipping conversation log');
    return;
  }

  try {
    await opik.trace({
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
    });
    
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
  if (!opik) {
    console.warn('Opik not initialized, skipping session metrics log');
    return;
  }

  try {
    await opik.trace({
      name: `session-metrics-${sessionId}`,
      input: { sessionId },
      output: { metrics },
      metadata: {
        timestamp: new Date().toISOString(),
        type: 'session_summary'
      }
    });
    
    console.log('Session metrics logged to Opik:', sessionId);
  } catch (error) {
    console.error('Failed to log session metrics to Opik:', error);
  }
};
