// src/aiProcessor.js

export class AIProcessor {
  constructor(model = "claude-3-sonnet-20240229") {
    this.model = model;
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
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
               'x-api-key': process.env.ANTHROPIC_API_KEY,
               'anthropic-version': '2023-06-01'
             },
             body: JSON.stringify({
               model: this.model,
               system: systemPrompt,
               messages: [{ role: "user", content: userPrompt }],
               max_tokens: options.max_tokens || 4096,
               temperature: options.temperature || 0.7
             })
           });
      
           if (!response.ok) {
             throw new Error(`Anthropic API error: ${response.status}`);
           }
      const data = await response.json();

      return data.content[0].text;
    } catch (error) {
      console.error("Error generating message:", error);
      throw error;
    }
  }

  async analyzeContext(formData) {
    const systemPrompt = `You are a strategic analyst specializing in competitive analysis and earnings interpretation.
    Your goal is to provide detailed, actionable insights based on company and competitor information especially based on latest earnings reports.
    Focus on industry-specific nuances and competitive dynamics.`;

    const userPrompt = `Analyze the following company and its competitors:
    Company: ${JSON.stringify(formData.companyDetails)}
    Industry: ${formData.industry}
    Competitors: ${JSON.stringify(formData.competitors)}
    
    Provide strategic context for tracking these companies and focusing on latest earnings reports and transcripts, including:
    1. Key competitive dynamics
    2. Industry-specific metrics importance
    3. Potential areas of differentiation
    4. Market positioning analysis`;

    return this.generateMessage(systemPrompt, userPrompt);
  }
}

export async function processFormData(formData) {
  const processor = new AIProcessor();
  const analysis = await processor.analyzeContext(formData);
  return {
    trackingId: Date.now().toString(),
    analysis,
    ...formData
  };
}