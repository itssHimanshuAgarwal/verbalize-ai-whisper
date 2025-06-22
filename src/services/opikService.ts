// Opik REST API implementation for hackathon
const OPIK_API_KEY = 'KlJBFBe13Q5Zc5BPC7Tdb2CX3';
// Updated to the correct Opik API endpoint
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
  console.log('🚀 Logging conversation to Opik...');
  
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

  console.log('📤 Sending to:', OPIK_API_URL);
  console.log('📤 Payload:', JSON.stringify(payload, null, 2));
  console.log('📤 Headers:', {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${OPIK_API_KEY}`
  });

  try {
    const response = await fetch(OPIK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPIK_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', response.headers);
    
    // Log the raw response
    const responseText = await response.text();
    console.log('📥 Raw response:', responseText);

    if (response.ok) {
      try {
        const result = JSON.parse(responseText);
        console.log('✅ Successfully logged to Opik:', result);
        return { success: true, result };
      } catch (parseError) {
        console.log('✅ Success but no JSON response:', responseText);
        return { success: true, result: responseText };
      }
    } else {
      console.error('❌ Opik API error:', response.status, responseText);
      return { success: false, error: `${response.status}: ${responseText}` };
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    console.error('❌ Error details:', error.message);
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
  console.log('🧪 Testing Opik connection...');
  
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
