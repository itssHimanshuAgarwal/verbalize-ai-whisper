

// Using Opik REST API since JavaScript SDK is not publicly available yet
const OPIK_API_URL = 'https://www.comet.com/api/rest/v2/opik/traces';
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
    // Use the Opik traces API format
    const payload = {
      project_name: OPIK_WORKSPACE,
      name: `negotiation-${data.negotiationType}-${data.sessionId}`,
      start_time: data.timestamp.toISOString(),
      end_time: data.timestamp.toISOString(),
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
        metrics: data.metrics || {},
        app: 'verbalize-ai',
        workspace: OPIK_WORKSPACE
      },
      tags: ['negotiation', 'practice', data.negotiationType, 'verbalize-ai']
    };

    console.log('🚀 Logging to Opik workspace:', OPIK_WORKSPACE, payload);

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
      console.error('❌ Opik API error details:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText,
        url: OPIK_API_URL
      });
      
      // Try alternative endpoint if the first one fails
      if (response.status === 404) {
        console.log('🔄 Trying alternative Opik API endpoint...');
        return await logToAlternativeEndpoint(data);
      }
      
      throw new Error(`Opik API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Successfully logged to Opik workspace:', OPIK_WORKSPACE, 'Session:', data.sessionId, result);
    return result;
  } catch (error) {
    console.warn('⚠️ Failed to log conversation to Opik workspace:', OPIK_WORKSPACE, error);
    // Try alternative logging method
    return await logToAlternativeEndpoint(data);
  }
};

// Alternative endpoint for Opik logging
const logToAlternativeEndpoint = async (data: ConversationLog) => {
  try {
    const alternativeUrl = `https://www.comet.com/api/rest/v1/opik/projects/${OPIK_WORKSPACE}/traces`;
    
    const payload = {
      name: `negotiation-${data.negotiationType}-${data.sessionId}`,
      start_time: data.timestamp.toISOString(),
      end_time: data.timestamp.toISOString(),
      input: data.userMessage,
      output: data.aiResponse,
      metadata: {
        negotiationType: data.negotiationType,
        persona: data.persona,
        sessionId: data.sessionId,
        app: 'verbalize-ai'
      },
      tags: ['negotiation', 'practice', data.negotiationType]
    };

    console.log('🔄 Trying alternative Opik endpoint:', alternativeUrl);

    const response = await fetch(alternativeUrl, {
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
      console.error('❌ Alternative Opik API also failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url: alternativeUrl
      });
      return null;
    }

    const result = await response.json();
    console.log('✅ Successfully logged to alternative Opik endpoint:', result);
    return result;
  } catch (error) {
    console.warn('⚠️ Alternative Opik logging also failed:', error);
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
      project_name: OPIK_WORKSPACE,
      name: `session-metrics-${sessionId}`,
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
      input: { 
        sessionId,
        type: 'session_summary',
        workspace: OPIK_WORKSPACE
      },
      output: { 
        metrics,
        summary: `Session completed with overall score: ${metrics.overallScore}%`
      },
      metadata: {
        timestamp: new Date().toISOString(),
        type: 'session_summary',
        app: 'verbalize-ai',
        workspace: OPIK_WORKSPACE
      },
      tags: ['metrics', 'session-summary', 'verbalize-ai']
    };

    console.log('🚀 Logging session metrics to Opik workspace:', OPIK_WORKSPACE, payload);

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
      console.error('❌ Opik API error details:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText
      });
      throw new Error(`Opik API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Successfully logged session metrics to Opik workspace:', OPIK_WORKSPACE, 'Session:', sessionId, result);
    return result;
  } catch (error) {
    console.warn('⚠️ Failed to log session metrics to Opik workspace:', OPIK_WORKSPACE, error);
    return null;
  }
};

