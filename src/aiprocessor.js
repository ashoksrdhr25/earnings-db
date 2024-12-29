// src/aiProcessor.js
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

class AIProcessor {
  constructor(model = "claude-3-sonnet-20240229") {
    this.client = null;
    this.model = model;
    console.log(`Initializing AIProcessor with model: ${model}`);

    // Validate environment variables
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY not found in environment variables");
    }

    try {
      // Initialize based on model type
      if (model.toLowerCase().includes('claude')) {
        this.client = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY
        });
        console.log("Initialized Anthropic client");
      } else {
        throw new Error(`Unsupported model: ${model}`);
      }

      if (!this.client) {
        throw new Error("Failed to initialize AI client");
      }

    } catch (error) {
      console.error("Initialization failed:", error);
      throw error;
    }
  }

  // Method to get available models
  static get availableModels() {
    return {
      CLAUDE_35_SONNET: "claude-3-sonnet-20240229",  // Latest Sonnet
      CLAUDE_3_OPUS: "claude-3-opus-20240229",       // More powerful but slower
      CLAUDE_3_HAIKU: "claude-3-haiku-20240307"      // Fastest, good for simple tasks
    };
  }

  // Validate model selection
  static isValidModel(model) {
    const validModels = Object.values(this.availableModels);
    return validModels.includes(model);
  }

  async generateMessage(systemPrompt, userPrompt, options = {}) {
    if (!this.client) {
      throw new Error("AI client not initialized");
    }

    try {
      const defaultOptions = {
        max_tokens: 4096,
        temperature: 0.7,
        ...options
      };

      const response = await this.client.messages.create({
        model: this.model,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
        ...defaultOptions
      });

      return response.content[0].text;
    } catch (error) {
      console.error("Error generating message:", error);
      throw error;
    }
  }

  async analyzeContext(formData) {
    const systemPrompt = `You are a strategic analyst specializing in competitive analysis and earnings interpretation.
    Your goal is to provide detailed, actionable insights based on company and competitor information.
    Focus on industry-specific nuances and competitive dynamics.`;

    const userPrompt = `Analyze the following company and its competitors:
    Company: ${JSON.stringify(formData.companyDetails)}
    Industry: ${formData.industry}
    Competitors: ${JSON.stringify(formData.competitors)}
    
    Provide strategic context for tracking these companies, including:
    1. Key competitive dynamics
    2. Industry-specific metrics importance
    3. Potential areas of differentiation
    4. Market positioning analysis`;

    return this.generateMessage(systemPrompt, userPrompt);
  }
}

// Test the initialization with different models
async function testAIProcessor() {
  try {
    console.log("Available models:", AIProcessor.availableModels);

    // Test with default (Sonnet)
    console.log("\nTesting with default model (Sonnet)...");
    const defaultProcessor = new AIProcessor();
    
    // Test with Opus
    console.log("\nTesting with Opus...");
    const opusProcessor = new AIProcessor(AIProcessor.availableModels.CLAUDE_3_OPUS);
    
    // Test with invalid model (should throw error)
    console.log("\nTesting with invalid model...");
    try {
      const invalidProcessor = new AIProcessor("invalid-model");
    } catch (error) {
      console.log("Successfully caught invalid model error:", error.message);
    }

    // Test analysis with default processor
    const testData = {
      companyDetails: {
        name: "Test Corp",
        industry: "Technology"
      },
      industry: "Technology",
      competitors: [
        { name: "Competitor A", ticker: "CMPA" }
      ]
    };

    console.log("\nTesting analysis...");
    const analysis = await defaultProcessor.analyzeContext(testData);
    console.log("Analysis result:", analysis);

  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run the test if this file is run directly
if (require.main === module) {
  testAIProcessor();
}

module.exports = {
   AIProcessor,
   processFormData
}