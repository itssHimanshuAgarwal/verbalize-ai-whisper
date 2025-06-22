
// Advanced Opik integration with Self-Optimizing Prompt Agent
const OPIK_API_KEY = 'KlJBFBe13Q5Zc5BPC7Tdb2CX3';
const OPIK_API_URL = 'https://www.comet.com/opik/api/v1/traces';
const OPIK_EXPERIMENTS_URL = 'https://www.comet.com/opik/api/v1/experiments';
const OPIK_EVALUATIONS_URL = 'https://www.comet.com/opik/api/v1/evaluations';

export interface ConversationLog {
  sessionId: string;
  userMessage: string;
  aiResponse: string;
  timestamp: Date;
  negotiationType: string;
  persona: string;
  promptVersion?: string;
  experimentId?: string;
  metrics?: {
    confidence?: number;
    clarity?: number;
    persuasiveness?: number;
  };
}

export interface PromptExperiment {
  id: string;
  name: string;
  variants: PromptVariant[];
  status: 'active' | 'completed' | 'paused';
  winningVariant?: string;
}

export interface PromptVariant {
  id: string;
  name: string;
  prompt: string;
  weight: number;
  metrics: {
    successRate: number;
    averageScore: number;
    totalRuns: number;
  };
}

// Current active experiments
let currentExperiments: PromptExperiment[] = [];

// A/B Testing Prompts for negotiation scenarios
const promptVariants = {
  salary: [
    {
      id: 'salary_v1',
      name: 'Professional Approach',
      prompt: "I see you're asking for quite a bit above our initial offer. What specific value do you bring that justifies this increase?",
      weight: 0.5
    },
    {
      id: 'salary_v2', 
      name: 'Collaborative Approach',
      prompt: "That's an interesting salary expectation. Let's work together to understand how we can align your compensation with the value you'll bring to our team.",
      weight: 0.5
    }
  ],
  business: [
    {
      id: 'business_v1',
      name: 'Direct Challenge',
      prompt: "That's a compelling point. However, I'm concerned about the implementation timeline. How do you plan to address that?",
      weight: 0.5
    },
    {
      id: 'business_v2',
      name: 'Supportive Inquiry',
      prompt: "I appreciate your proposal. To help us move forward, could you walk me through your implementation strategy and timeline?",
      weight: 0.5
    }
  ]
};

export const logConversation = async (data: ConversationLog) => {
  console.log('🚀 Logging conversation to Opik with advanced features...');
  
  // Select prompt variant for A/B testing
  const selectedVariant = await selectPromptVariant(data.negotiationType);
  
  const payload = {
    name: "conversation-trace",
    input: {
      user_message: data.userMessage,
      prompt_variant: selectedVariant?.id,
      experiment_id: data.experimentId
    },
    output: {
      ai_response: data.aiResponse,
      selected_prompt: selectedVariant?.prompt
    },
    metadata: {
      persona: data.persona,
      session_id: data.sessionId,
      negotiation_type: data.negotiationType,
      timestamp: data.timestamp.toISOString(),
      app: 'verbalize-ai',
      prompt_version: selectedVariant?.name,
      a_b_test: true
    },
    tags: ['negotiation', 'conversation', 'a-b-test']
  };

  console.log('📤 Advanced payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(OPIK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPIK_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    console.log('📥 Response status:', response.status);

    if (response.ok) {
      try {
        const result = JSON.parse(responseText);
        console.log('✅ Successfully logged to Opik with A/B testing:', result);
        
        // Update experiment metrics
        await updateExperimentMetrics(selectedVariant?.id, data.metrics);
        
        return { success: true, result, variant: selectedVariant };
      } catch (parseError) {
        console.log('✅ Success but no JSON response:', responseText);
        return { success: true, result: responseText, variant: selectedVariant };
      }
    } else {
      console.error('❌ Opik API error:', response.status, responseText);
      return { success: false, error: `${response.status}: ${responseText}` };
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return { success: false, error: error.message };
  }
};

// Select prompt variant based on A/B testing weights
const selectPromptVariant = async (negotiationType: string): Promise<PromptVariant | null> => {
  const variants = promptVariants[negotiationType];
  if (!variants) return null;

  // Weighted random selection for A/B testing
  const random = Math.random();
  let cumulativeWeight = 0;
  
  for (const variant of variants) {
    cumulativeWeight += variant.weight;
    if (random <= cumulativeWeight) {
      console.log(`🎯 Selected variant: ${variant.name} for ${negotiationType}`);
      return {
        id: variant.id,
        name: variant.name,
        prompt: variant.prompt,
        weight: variant.weight,
        metrics: {
          successRate: 0,
          averageScore: 0,
          totalRuns: 0
        }
      };
    }
  }
  
  return variants[0]; // Fallback to first variant
};

// Update experiment metrics for prompt optimization
const updateExperimentMetrics = async (variantId: string, metrics?: { confidence?: number; clarity?: number; persuasiveness?: number; }) => {
  if (!variantId || !metrics) return;

  const payload = {
    variant_id: variantId,
    metrics: {
      confidence: metrics.confidence || 0,
      clarity: metrics.clarity || 0,
      persuasiveness: metrics.persuasiveness || 0,
      overall_score: ((metrics.confidence || 0) + (metrics.clarity || 0) + (metrics.persuasiveness || 0)) / 3
    },
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(OPIK_EVALUATIONS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPIK_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log('📊 Experiment metrics updated successfully');
    }
  } catch (error) {
    console.error('❌ Failed to update experiment metrics:', error);
  }
};

// Create new A/B test experiment
export const createExperiment = async (name: string, negotiationType: string, variants: PromptVariant[]) => {
  const payload = {
    name,
    description: `A/B test for ${negotiationType} negotiation prompts`,
    negotiation_type: negotiationType,
    variants: variants.map(v => ({
      id: v.id,
      name: v.name,
      prompt: v.prompt,
      weight: v.weight
    })),
    status: 'active',
    created_at: new Date().toISOString()
  };

  try {
    const response = await fetch(OPIK_EXPERIMENTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPIK_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('🧪 Experiment created successfully:', result);
      return { success: true, experiment: result };
    }
  } catch (error) {
    console.error('❌ Failed to create experiment:', error);
  }

  return { success: false };
};

// Evaluate and promote winning variants (Self-Optimizing)
export const evaluateAndOptimize = async () => {
  console.log('🤖 Running self-optimization evaluation...');
  
  try {
    const response = await fetch(`${OPIK_EVALUATIONS_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPIK_API_KEY}`
      },
      body: JSON.stringify({
        min_samples: 10,
        confidence_threshold: 0.95,
        auto_promote: true
      })
    });

    if (response.ok) {
      const results = await response.json();
      console.log('🏆 Optimization results:', results);
      
      // Auto-update weights based on performance
      if (results.winning_variants) {
        await updatePromptWeights(results.winning_variants);
      }
      
      return { success: true, results };
    }
  } catch (error) {
    console.error('❌ Optimization failed:', error);
  }

  return { success: false };
};

// Update prompt weights based on performance
const updatePromptWeights = async (winningVariants: any[]) => {
  for (const winner of winningVariants) {
    const negotiationType = winner.negotiation_type;
    const variantId = winner.variant_id;
    
    if (promptVariants[negotiationType]) {
      const variants = promptVariants[negotiationType];
      const winningVariant = variants.find(v => v.id === variantId);
      
      if (winningVariant) {
        // Increase weight of winning variant
        winningVariant.weight = Math.min(0.8, winningVariant.weight + 0.1);
        
        // Decrease weight of others
        variants.forEach(v => {
          if (v.id !== variantId) {
            v.weight = Math.max(0.2, v.weight - 0.05);
          }
        });
        
        console.log(`⚖️ Updated weights for ${negotiationType}:`, variants);
      }
    }
  }
};

export const logSessionMetrics = async (sessionId: string, metrics: {
  confidence: number;
  clarity: number;
  persuasiveness: number;
  overallScore: number;
}) => {
  console.log('📊 Logging session metrics with advanced evaluation...');
  
  return await logConversation({
    sessionId: `metrics_${sessionId}`,
    userMessage: 'Session completed',
    aiResponse: `Session metrics - Confidence: ${metrics.confidence}, Clarity: ${metrics.clarity}, Persuasiveness: ${metrics.persuasiveness}, Overall: ${metrics.overallScore}`,
    timestamp: new Date(),
    negotiationType: 'session_metrics',
    persona: 'System',
    metrics: {
      confidence: metrics.confidence,
      clarity: metrics.clarity,
      persuasiveness: metrics.persuasiveness
    }
  });
};

export const testOpikConnection = async () => {
  console.log('🧪 Testing advanced Opik connection...');
  
  const testResult = await logConversation({
    sessionId: `test_${Date.now()}`,
    userMessage: 'Test message for advanced Opik integration',
    aiResponse: 'Test response - Advanced Opik with A/B testing working!',
    timestamp: new Date(),
    negotiationType: 'connection_test',
    persona: 'Test Bot',
    metrics: {
      confidence: 85,
      clarity: 90,
      persuasiveness: 80
    }
  });

  console.log('🏁 Advanced connection test result:', testResult);
  
  // Run optimization check
  setTimeout(() => {
    evaluateAndOptimize();
  }, 2000);
  
  return testResult;
};

// Initialize experiments on startup
export const initializeExperiments = async () => {
  console.log('🚀 Initializing self-optimizing prompt experiments...');
  
  // Create experiments for each negotiation type
  for (const [type, variants] of Object.entries(promptVariants)) {
    await createExperiment(`${type}_negotiation_optimization`, type, variants.map(v => ({
      id: v.id,
      name: v.name,
      prompt: v.prompt,
      weight: v.weight,
      metrics: { successRate: 0, averageScore: 0, totalRuns: 0 }
    })));
  }
  
  // Schedule periodic optimization
  setInterval(evaluateAndOptimize, 300000); // Every 5 minutes
};

// Auto-initialize on import
initializeExperiments().catch(console.error);
