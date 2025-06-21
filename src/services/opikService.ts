
// Updated Opik API endpoints and authentication
const OPIK_BASE_URL = 'https://www.comet.com/api/rest/v1';
const OPIK_API_KEY = 'KlJBFBe13Q5Zc5BPC7Tdb2CX3';
const OPIK_WORKSPACE = 'himanshu-ramesh-agarwal';

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
    // Use the correct Opik API endpoint for traces
    const endpoint = `${OPIK_BASE_URL}/workspaces/${OPIK_WORKSPACE}/projects/verbalize-ai/traces`;
    
    const payload = {
      name: `negotiation-${data.negotiationType}-${data.sessionId}`,
      start_time: data.timestamp.toISOString(),
      end_time: data.timestamp.toISOString(),
      input: {
        message: data.userMessage,
        persona: data.persona,
        session_id: data.sessionId,
        type: data.negotiationType
      },
      output: {
        response: data.aiResponse
      },
      metadata: {
        negotiation_type: data.negotiationType,
        persona_name: data.persona,
        session_id: data.sessionId,
        timestamp: data.timestamp.toISOString(),
        metrics: data.metrics || {},
        application: 'verbalize-ai'
      },
      tags: ['negotiation', 'practice', data.negotiationType]
    };

    console.log('🚀 Logging to Opik:', endpoint, payload);

    const response = await fetch(endpoint, {
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
      console.error('❌ Opik API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        endpoint
      });
      
      // Try direct trace creation endpoint
      return await createTraceDirectly(data);
    }

    const result = await response.json();
    console.log('✅ Successfully logged to Opik:', result);
    return result;
  } catch (error) {
    console.warn('⚠️ Failed to log conversation to Opik:', error);
    // Try direct trace creation as fallback
    return await createTraceDirectly(data);
  }
};

// Alternative direct trace creation
const createTraceDirectly = async (data: ConversationLog) => {
  try {
    const directEndpoint = `${OPIK_BASE_URL}/traces`;
    
    const payload = {
      project_name: 'verbalize-ai',
      name: `${data.negotiationType}_${data.sessionId}`,
      start_time: data.timestamp.toISOString(),
      end_time: data.timestamp.toISOString(),
      input: data.userMessage,
      output: data.aiResponse,
      metadata: {
        workspace: OPIK_WORKSPACE,
        negotiation_type: data.negotiationType,
        persona: data.persona,
        session_id: data.sessionId,
        app: 'verbalize-ai'
      },
      tags: ['negotiation', data.negotiationType]
    };

    console.log('🔄 Trying direct trace creation:', directEndpoint);

    const response = await fetch(directEndpoint, {
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
      console.error('❌ Direct trace creation also failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return null;
    }

    const result = await response.json();
    console.log('✅ Successfully created trace directly:', result);
    return result;
  } catch (error) {
    console.warn('⚠️ Direct trace creation failed:', error);
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
    const endpoint = `${OPIK_BASE_URL}/workspaces/${OPIK_WORKSPACE}/projects/verbalize-ai/traces`;
    
    const payload = {
      name: `session-summary-${sessionId}`,
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
      input: { 
        session_id: sessionId,
        type: 'session_summary'
      },
      output: { 
        metrics,
        overall_score: metrics.overallScore
      },
      metadata: {
        session_id: sessionId,
        type: 'session_summary',
        application: 'verbalize-ai',
        workspace: OPIK_WORKSPACE
      },
      tags: ['metrics', 'session-summary']
    };

    console.log('🚀 Logging session metrics to Opik:', payload);

    const response = await fetch(endpoint, {
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
