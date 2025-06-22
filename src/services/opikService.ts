
// Simplified Opik REST API implementation for hackathon
const OPIK_API_KEY = 'KlJBFBe13Q5Zc5BPC7Tdb2CX3';
const OPIK_API_URL = 'https://www.comet.com/opik/api/v1/traces';

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
  console.log('🚀 Logging conversation to Opik with simplified REST API...');
  
  const payload = {
    name: "conversation-trace",
    input: {
      user_message: data.userMessage
    },
    output: {
      ai_response: data.aiResponse
    },
    metadata: {
      persona: data.persona,
      session_id: data.sessionId,
      negotiation_type: data.negotiationType,
      timestamp: data.timestamp.toISOString(),
      app: 'verbalize-ai'
    }
  };

  console.log('📤 Sending payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(OPIK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPIK_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    console.log('📥 Opik response:', response.status, response.statusText);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Successfully logged to Opik:', result);
      return { success: true, result };
    } else {
      const errorText = await response.text();
      console.error('❌ Opik API error:', errorText);
      return { success: false, error: errorText };
    }
  } catch (error) {
    console.error('❌ Network error logging to Opik:', error);
    return { success: false, error: error.message };
  }
};

export const logSessionMetrics = async (sessionId: string, metrics: {
  confidence: number;
  clarity: number;
  persuasiveness: number;
  overallScore: number;
}) => {
  console.log('📊 Logging session metrics to Opik...');
  
  return await logConversation({
    sessionId: `metrics_${sessionId}`,
    userMessage: 'Session completed',
    aiResponse: `Session metrics - Confidence: ${metrics.confidence}, Clarity: ${metrics.clarity}, Persuasiveness: ${metrics.persuasiveness}, Overall: ${metrics.overallScore}`,
    timestamp: new Date(),
    negotiationType: 'session_metrics',
    persona: 'System',
    metrics
  });
};

export const testOpikConnection = async () => {
  console.log('🧪 Testing Opik connection with simple test trace...');
  
  const testResult = await logConversation({
    sessionId: `test_${Date.now()}`,
    userMessage: 'Test message for hackathon demo',
    aiResponse: 'Test response - Opik integration working!',
    timestamp: new Date(),
    negotiationType: 'connection_test',
    persona: 'Test Bot'
  });

  console.log('🏁 Connection test result:', testResult);
  return testResult;
};
