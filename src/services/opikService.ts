
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
    console.log('🔧 Starting Opik conversation logging with data:', {
      sessionId: data.sessionId,
      negotiationType: data.negotiationType,
      persona: data.persona,
      messageLength: data.userMessage.length,
      responseLength: data.aiResponse.length
    });

    // Create a trace using the v2 API
    const tracePayload = {
      id: `conv_${data.sessionId}_${Date.now()}`,
      name: `${data.negotiationType}_conversation`,
      start_time: data.timestamp.toISOString(),
      end_time: new Date().toISOString(),
      input: {
        user_message: data.userMessage,
        persona: data.persona,
        negotiation_type: data.negotiationType,
        session_id: data.sessionId
      },
      output: {
        ai_response: data.aiResponse,
        persona: data.persona
      },
      metadata: {
        session_id: data.sessionId,
        negotiation_type: data.negotiationType,
        persona_name: data.persona,
        application: 'verbalize-ai',
        timestamp: data.timestamp.toISOString(),
        conversation_turn: true
      },
      tags: ['verbalize-ai', 'conversation', data.negotiationType, data.persona.toLowerCase()]
    };

    console.log('📤 Sending trace payload to Opik:', JSON.stringify(tracePayload, null, 2));
    console.log('🌐 API URL:', `${OPIK_BASE_URL}/traces`);
    console.log('🔑 Headers:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPIK_API_KEY.substring(0, 10)}...`,
      'Comet-Workspace': OPIK_WORKSPACE,
      'Comet-Project-Name': OPIK_PROJECT_NAME
    });

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

    console.log('📥 Opik response status:', response.status);
    console.log('📥 Opik response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Opik conversation logging failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url: response.url
      });
      
      // Try the alternative approach
      console.log('🔄 Trying alternative logging approach...');
      return await logConversationAlternative(data);
    }

    const result = await response.json();
    console.log('✅ Successfully logged conversation to Opik:', result);
    return result;
  } catch (error) {
    console.error('🚨 Error in logConversation:', error);
    console.log('🔄 Trying alternative logging approach...');
    return await logConversationAlternative(data);
  }
};

// Alternative conversation logging method
const logConversationAlternative = async (data: ConversationLog) => {
  try {
    // Try different endpoint structure
    const altPayload = {
      project_name: OPIK_PROJECT_NAME,
      traces: [{
        id: `alt_conv_${data.sessionId}_${Date.now()}`,
        name: `${data.negotiationType}_exchange`,
        start_time: data.timestamp.toISOString(),
        end_time: new Date().toISOString(),
        input: JSON.stringify({
          user_message: data.userMessage,
          persona: data.persona,
          type: data.negotiationType
        }),
        output: JSON.stringify({
          ai_response: data.aiResponse
        }),
        metadata: {
          session_id: data.sessionId,
          negotiation_type: data.negotiationType,
          persona: data.persona,
          app: 'verbalize-ai'
        },
        tags: ['verbalize-ai', data.negotiationType, 'conversation']
      }]
    };

    console.log('🔄 Trying alternative payload:', JSON.stringify(altPayload, null, 2));

    // Try posting to project-specific endpoint
    const altResponse = await fetch(`${OPIK_BASE_URL}/projects/${OPIK_PROJECT_NAME}/traces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPIK_API_KEY}`,
        'Comet-Workspace': OPIK_WORKSPACE
      },
      body: JSON.stringify(altPayload)
    });

    console.log('📥 Alternative response status:', altResponse.status);

    if (!altResponse.ok) {
      const errorText = await altResponse.text();
      console.error('❌ Alternative logging also failed:', {
        status: altResponse.status,
        statusText: altResponse.statusText,
        body: errorText
      });
      
      // Try one more approach - direct trace creation
      return await logWithDirectAPI(data);
    }

    const result = await altResponse.json();
    console.log('✅ Alternative logging successful:', result);
    return result;
  } catch (error) {
    console.error('🚨 Alternative logging error:', error);
    return await logWithDirectAPI(data);
  }
};

// Direct API approach
const logWithDirectAPI = async (data: ConversationLog) => {
  try {
    console.log('🔧 Trying direct API approach...');
    
    const directPayload = {
      name: `verbalize_${data.negotiationType}_${Date.now()}`,
      input: data.userMessage,
      output: data.aiResponse,
      start_time: data.timestamp.toISOString(),
      end_time: new Date().toISOString(),
      metadata: {
        session_id: data.sessionId,
        negotiation_type: data.negotiationType,
        persona: data.persona,
        source: 'verbalize-ai'
      }
    };

    console.log('📤 Direct API payload:', JSON.stringify(directPayload, null, 2));

    const directResponse = await fetch(`${OPIK_BASE_URL}/traces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPIK_API_KEY}`,
        'Comet-Workspace': OPIK_WORKSPACE,
        'Comet-Project-Name': OPIK_PROJECT_NAME
      },
      body: JSON.stringify(directPayload)
    });

    console.log('📥 Direct API response status:', directResponse.status);

    if (directResponse.ok) {
      const result = await directResponse.json();
      console.log('✅ Direct API logging successful:', result);
      return result;
    } else {
      const errorText = await directResponse.text();
      console.error('❌ All logging attempts failed. Final error:', {
        status: directResponse.status,
        body: errorText
      });
      return null;
    }
  } catch (error) {
    console.error('🚨 Direct API logging failed:', error);
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
    console.log('📊 Logging session metrics to Opik:', { sessionId, metrics });

    const metricsPayload = {
      id: `metrics_${sessionId}_${Date.now()}`,
      name: `session_summary_${sessionId}`,
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
      input: { 
        session_id: sessionId,
        type: 'session_metrics'
      },
      output: metrics,
      metadata: {
        session_id: sessionId,
        type: 'session_summary',
        application: 'verbalize-ai'
      },
      tags: ['verbalize-ai', 'metrics', 'session-summary']
    };

    console.log('📤 Metrics payload:', JSON.stringify(metricsPayload, null, 2));

    const response = await fetch(`${OPIK_BASE_URL}/traces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPIK_API_KEY}`,
        'Comet-Workspace': OPIK_WORKSPACE,
        'Comet-Project-Name': OPIK_PROJECT_NAME
      },
      body: JSON.stringify([metricsPayload])
    });

    console.log('📥 Metrics response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Session metrics logging failed:', {
        status: response.status,
        body: errorText
      });
      return null;
    }

    const result = await response.json();
    console.log('✅ Successfully logged session metrics:', result);
    return result;
  } catch (error) {
    console.error('🚨 Session metrics logging error:', error);
    return null;
  }
};

// Enhanced test function to verify Opik connection
export const testOpikConnection = async () => {
  try {
    console.log('🧪 Testing Opik connection...');
    console.log('🔧 Configuration:', {
      baseUrl: OPIK_BASE_URL,
      workspace: OPIK_WORKSPACE,
      project: OPIK_PROJECT_NAME,
      apiKeyPrefix: OPIK_API_KEY.substring(0, 10) + '...'
    });

    const testTrace = {
      id: `test_${Date.now()}`,
      name: 'connection_test',
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
      input: { test: 'connection', timestamp: new Date().toISOString() },
      output: { status: 'testing', app: 'verbalize-ai' },
      metadata: { 
        test: true, 
        app: 'verbalize-ai',
        connection_test: true
      },
      tags: ['test', 'verbalize-ai', 'connection-check']
    };

    console.log('📤 Test trace payload:', JSON.stringify(testTrace, null, 2));

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

    console.log('📥 Test response status:', response.status);
    console.log('📥 Test response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Opik connection test successful:', result);
      return { success: true, result };
    } else {
      const errorText = await response.text();
      console.error('❌ Opik connection test failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return { success: false, error: errorText, status: response.status };
    }
  } catch (error) {
    console.error('🚨 Opik connection test error:', error);
    return { success: false, error: error.message };
  }
};
