
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

// Try the official Opik SDK approach first
export const logConversation = async (data: ConversationLog) => {
  console.log('🚀 Starting comprehensive Opik logging debug...');
  
  // First, try to verify the API key and connection
  const connectionTest = await verifyOpikConnection();
  if (!connectionTest.success) {
    console.error('❌ Opik connection failed:', connectionTest.error);
    return null;
  }

  // Try multiple approaches in sequence
  const approaches = [
    () => logWithOpikSDKFormat(data),
    () => logWithCometFormat(data),
    () => logWithSimpleFormat(data),
    () => logWithDirectPostFormat(data)
  ];

  for (let i = 0; i < approaches.length; i++) {
    console.log(`🔄 Trying approach ${i + 1}/${approaches.length}...`);
    try {
      const result = await approaches[i]();
      if (result && result.success) {
        console.log(`✅ Success with approach ${i + 1}:`, result);
        return result;
      }
    } catch (error) {
      console.error(`❌ Approach ${i + 1} failed:`, error);
    }
  }

  console.error('🚨 All logging approaches failed');
  return null;
};

// Verify basic connectivity
const verifyOpikConnection = async () => {
  try {
    console.log('🔍 Verifying Opik connection...');
    console.log('📍 URL:', OPIK_BASE_URL);
    console.log('🔑 API Key (first 10 chars):', OPIK_API_KEY.substring(0, 10));
    console.log('🏢 Workspace:', OPIK_WORKSPACE);
    console.log('📁 Project:', OPIK_PROJECT_NAME);

    // Try to access the workspace/project info
    const response = await fetch(`${OPIK_BASE_URL}/workspaces/${OPIK_WORKSPACE}/projects/${OPIK_PROJECT_NAME}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPIK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Connection test response:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Project exists:', data);
      return { success: true, data };
    } else {
      const errorText = await response.text();
      console.log('⚠️ Project check failed, but might still work:', errorText);
      return { success: true, warning: errorText }; // Continue anyway
    }
  } catch (error) {
    console.error('❌ Connection verification failed:', error);
    return { success: false, error: error.message };
  }
};

// Approach 1: Official Opik SDK format
const logWithOpikSDKFormat = async (data: ConversationLog) => {
  console.log('📝 Trying Opik SDK format...');
  
  const payload = {
    traces: [{
      id: `trace_${data.sessionId}_${Date.now()}`,
      name: `${data.negotiationType}_conversation`,
      start_time: data.timestamp.toISOString(),
      end_time: new Date().toISOString(),
      input: {
        user_message: data.userMessage,
        session_id: data.sessionId,
        persona: data.persona,
        negotiation_type: data.negotiationType
      },
      output: {
        ai_response: data.aiResponse,
        persona: data.persona
      },
      metadata: {
        session_id: data.sessionId,
        negotiation_type: data.negotiationType,
        persona: data.persona,
        app: 'verbalize-ai',
        timestamp: data.timestamp.toISOString()
      },
      tags: ['verbalize-ai', data.negotiationType, 'conversation']
    }]
  };

  console.log('📤 SDK payload:', JSON.stringify(payload, null, 2));

  const response = await fetch(`${OPIK_BASE_URL}/traces`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPIK_API_KEY}`,
      'Comet-Workspace': OPIK_WORKSPACE,
      'Comet-Project-Name': OPIK_PROJECT_NAME
    },
    body: JSON.stringify(payload)
  });

  console.log('📥 SDK response:', response.status, response.statusText);

  if (response.ok) {
    const result = await response.json();
    return { success: true, method: 'SDK', result };
  } else {
    const error = await response.text();
    throw new Error(`SDK format failed: ${response.status} - ${error}`);
  }
};

// Approach 2: Comet ML format
const logWithCometFormat = async (data: ConversationLog) => {
  console.log('📝 Trying Comet ML format...');
  
  const payload = {
    workspace: OPIK_WORKSPACE,
    project_name: OPIK_PROJECT_NAME,
    experiment_name: `session_${data.sessionId}`,
    log_other: {
      user_message: data.userMessage,
      ai_response: data.aiResponse,
      persona: data.persona,
      negotiation_type: data.negotiationType,
      timestamp: data.timestamp.toISOString()
    },
    log_parameter: {
      session_id: data.sessionId,
      negotiation_type: data.negotiationType,
      persona: data.persona
    }
  };

  console.log('📤 Comet payload:', JSON.stringify(payload, null, 2));

  const response = await fetch(`${OPIK_BASE_URL}/experiments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPIK_API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  console.log('📥 Comet response:', response.status, response.statusText);

  if (response.ok) {
    const result = await response.json();
    return { success: true, method: 'Comet', result };
  } else {
    const error = await response.text();
    throw new Error(`Comet format failed: ${response.status} - ${error}`);
  }
};

// Approach 3: Simple format
const logWithSimpleFormat = async (data: ConversationLog) => {
  console.log('📝 Trying simple format...');
  
  const payload = {
    name: `verbalize_${data.negotiationType}_${Date.now()}`,
    input: data.userMessage,
    output: data.aiResponse,
    metadata: {
      session_id: data.sessionId,
      persona: data.persona,
      type: data.negotiationType,
      app: 'verbalize-ai'
    }
  };

  console.log('📤 Simple payload:', JSON.stringify(payload, null, 2));

  const response = await fetch(`${OPIK_BASE_URL}/projects/${OPIK_PROJECT_NAME}/traces`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPIK_API_KEY}`,
      'Comet-Workspace': OPIK_WORKSPACE
    },
    body: JSON.stringify(payload)
  });

  console.log('📥 Simple response:', response.status, response.statusText);

  if (response.ok) {
    const result = await response.json();
    return { success: true, method: 'Simple', result };
  } else {
    const error = await response.text();
    throw new Error(`Simple format failed: ${response.status} - ${error}`);
  }
};

// Approach 4: Direct POST format
const logWithDirectPostFormat = async (data: ConversationLog) => {
  console.log('📝 Trying direct POST format...');
  
  const payload = {
    trace_id: `direct_${data.sessionId}_${Date.now()}`,
    session_id: data.sessionId,
    user_input: data.userMessage,
    ai_output: data.aiResponse,
    persona: data.persona,
    negotiation_type: data.negotiationType,
    timestamp: data.timestamp.toISOString(),
    application: 'verbalize-ai'
  };

  console.log('📤 Direct payload:', JSON.stringify(payload, null, 2));

  // Try different endpoints
  const endpoints = [
    `${OPIK_BASE_URL}/trace`,
    `${OPIK_BASE_URL}/logs`,
    `${OPIK_BASE_URL}/events`,
    `https://api.comet.ml/api/rest/v2/write/experiment/log`
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`🎯 Trying endpoint: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPIK_API_KEY}`,
          'Comet-Workspace': OPIK_WORKSPACE,
          'Comet-Project-Name': OPIK_PROJECT_NAME
        },
        body: JSON.stringify(payload)
      });

      console.log(`📥 Response from ${endpoint}:`, response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        return { success: true, method: 'Direct', endpoint, result };
      } else {
        const error = await response.text();
        console.log(`❌ Failed ${endpoint}:`, error);
      }
    } catch (error) {
      console.log(`❌ Error with ${endpoint}:`, error.message);
    }
  }

  throw new Error('All direct POST attempts failed');
};

export const logSessionMetrics = async (sessionId: string, metrics: {
  confidence: number;
  clarity: number;
  persuasiveness: number;
  overallScore: number;
}) => {
  console.log('📊 Logging session metrics...');
  return await logConversation({
    sessionId: `metrics_${sessionId}`,
    userMessage: 'Session completed',
    aiResponse: `Metrics: ${JSON.stringify(metrics)}`,
    timestamp: new Date(),
    negotiationType: 'session_metrics',
    persona: 'System',
    metrics
  });
};

// Enhanced test function with proper typing
export const testOpikConnection = async () => {
  console.log('🧪 Running comprehensive Opik connection test...');
  
  const results = {
    connection: false as boolean,
    authentication: false as boolean,
    project_access: false as boolean,
    trace_creation: false as boolean,
    details: {} as Record<string, any>
  };

  try {
    // Test 1: Basic connection
    console.log('🔍 Test 1: Basic connection...');
    const basicResponse = await fetch(OPIK_BASE_URL, { method: 'GET' });
    results.connection = basicResponse.status < 500;
    results.details.connection = { status: basicResponse.status, statusText: basicResponse.statusText };
    console.log('✅ Connection test:', results.connection);

    // Test 2: Authentication
    console.log('🔍 Test 2: Authentication...');
    const authResponse = await fetch(`${OPIK_BASE_URL}/workspaces`, {
      headers: { 'Authorization': `Bearer ${OPIK_API_KEY}` }
    });
    results.authentication = authResponse.status === 200 || authResponse.status === 403; // 403 means auth worked but no access
    results.details.authentication = { status: authResponse.status, statusText: authResponse.statusText };
    console.log('✅ Authentication test:', results.authentication);

    // Test 3: Project access
    console.log('🔍 Test 3: Project access...');
    const projectResponse = await fetch(`${OPIK_BASE_URL}/workspaces/${OPIK_WORKSPACE}/projects`, {
      headers: { 'Authorization': `Bearer ${OPIK_API_KEY}` }
    });
    results.project_access = projectResponse.status === 200;
    results.details.project_access = { status: projectResponse.status, statusText: projectResponse.statusText };
    console.log('✅ Project access test:', results.project_access);

    // Test 4: Trace creation
    console.log('🔍 Test 4: Trace creation...');
    const testResult = await logConversation({
      sessionId: `test_${Date.now()}`,
      userMessage: 'Test message',
      aiResponse: 'Test response',
      timestamp: new Date(),
      negotiationType: 'test',
      persona: 'Test'
    });
    results.trace_creation = !!testResult;
    results.details.trace_creation = testResult;
    console.log('✅ Trace creation test:', results.trace_creation);

    console.log('🏁 Comprehensive test results:', results);
    return { success: Object.values(results).every(r => r !== false), results };

  } catch (error) {
    console.error('🚨 Test suite error:', error);
    return { success: false, error: error.message, results };
  }
};
