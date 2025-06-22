
// Updated Opik API endpoints and authentication
const OPIK_BASE_URL = 'https://www.comet.com/api/rest/v2';
const OPIK_API_KEY = 'KlJBFBe13Q5Zc5BPC7Tdb2CX3';
const OPIK_WORKSPACE = 'himanshu-ramesh-agarwal';
const OPIK_PROJECT_NAME = 'verbalize-ai';

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
    // Create a trace using the v2 API
    const tracePayload = {
      id: `trace_${data.sessionId}_${Date.now()}`,
      name: `${data.negotiationType}_session_${data.sessionId}`,
      start_time: data.timestamp.toISOString(),
      end_time: data.timestamp.toISOString(),
      input: {
        user_message: data.userMessage,
        persona: data.persona,
        negotiation_type: data.negotiationType
      },
      output: {
        ai_response: data.aiResponse
      },
      metadata: {
        session_id: data.sessionId,
        negotiation_type: data.negotiationType,
        persona_name: data.persona,
        application: 'verbalize-ai',
        timestamp: data.timestamp.toISOString()
      },
      tags: ['negotiation', 'practice', data.negotiationType, 'verbalize-ai']
    };

    console.log('🚀 Logging trace to Opik:', tracePayload);

    const response = await fetch(`${OPIK_BASE_URL}/traces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPIK_API_KEY}`,
        'Comet-Workspace': OPIK_WORKSPACE,
        'Comet-Project-Name': OPIK_PROJECT_NAME
      },
      body: JSON.stringify([tracePayload])
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Opik trace logging failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      // Try alternative endpoint
      return await logTraceAlternative(data);
    }

    const result = await response.json();
    console.log('✅ Successfully logged trace to Opik:', result);
    return result;
  } catch (error) {
    console.warn('⚠️ Failed to log conversation to Opik:', error);
    return await logTraceAlternative(data);
  }
};

// Alternative trace logging method
const logTraceAlternative = async (data: ConversationLog) => {
  try {
    const payload = {
      project_name: OPIK_PROJECT_NAME,
      traces: [{
        id: `alt_trace_${data.sessionId}_${Date.now()}`,
        name: `conversation_${data.negotiationType}`,
        start_time: data.timestamp.toISOString(),
        end_time: data.timestamp.toISOString(),
        input: data.userMessage,
        output: data.aiResponse,
        metadata: {
          session_id: data.sessionId,
          negotiation_type: data.negotiationType,
          persona: data.persona,
          app: 'verbalize-ai'
        },
        tags: ['verbalize-ai', data.negotiationType]
      }]
    };

    console.log('🔄 Trying alternative trace logging:', payload);

    const response = await fetch(`${OPIK_BASE_URL}/projects/${OPIK_PROJECT_NAME}/traces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPIK_API_KEY}`,
        'Comet-Workspace': OPIK_WORKSPACE
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Alternative trace logging also failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return null;
    }

    const result = await response.json();
    console.log('✅ Successfully logged via alternative method:', result);
    return result;
  } catch (error) {
    console.warn('⚠️ Alternative trace logging failed:', error);
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
    const tracePayload = {
      id: `metrics_${sessionId}_${Date.now()}`,
      name: `session_summary_${sessionId}`,
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
      input: { 
        session_id: sessionId,
        type: 'session_summary'
      },
      output: { 
        confidence: metrics.confidence,
        clarity: metrics.clarity,
        persuasiveness: metrics.persuasiveness,
        overall_score: metrics.overallScore
      },
      metadata: {
        session_id: sessionId,
        type: 'session_summary',
        application: 'verbalize-ai'
      },
      tags: ['metrics', 'session-summary', 'verbalize-ai']
    };

    console.log('🚀 Logging session metrics to Opik:', tracePayload);

    const response = await fetch(`${OPIK_BASE_URL}/traces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPIK_API_KEY}`,
        'Comet-Workspace': OPIK_WORKSPACE,
        'Comet-Project-Name': OPIK_PROJECT_NAME
      },
      body: JSON.stringify([tracePayload])
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Session metrics logging failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return null;
    }

    const result = await response.json();
    console.log('✅ Successfully logged session metrics:', result);
    return result;
  } catch (error) {
    console.warn('⚠️ Failed to log session metrics:', error);
    return null;
  }
};

// Test function to verify Opik connection
export const testOpikConnection = async () => {
  try {
    const testTrace = {
      id: `test_${Date.now()}`,
      name: 'connection_test',
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
      input: { test: 'connection' },
      output: { status: 'success' },
      metadata: { test: true, app: 'verbalize-ai' },
      tags: ['test', 'verbalize-ai']
    };

    console.log('🧪 Testing Opik connection...');

    const response = await fetch(`${OPIK_BASE_URL}/traces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPIK_API_KEY}`,
        'Comet-Workspace': OPIK_WORKSPACE,
        'Comet-Project-Name': OPIK_PROJECT_NAME
      },
      body: JSON.stringify([testTrace])
    });

    if (response.ok) {
      console.log('✅ Opik connection test successful');
      return true;
    } else {
      console.error('❌ Opik connection test failed:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Opik connection test error:', error);
    return false;
  }
};
