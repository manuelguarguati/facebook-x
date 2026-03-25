import { OpenAIService } from './openai.service';
// import { ClaudeService } from './claude.service';

export interface ContentGenerationParams {
  topic: string;
  tone: 'professional' | 'casual' | 'viral' | 'informative';
  context?: string;
}

export interface AIProvider {
  generateContent(params: ContentGenerationParams): Promise<string>;
  analyzeMetrics(data: any): Promise<any>;
}

export const getAIProvider = (): AIProvider => {
  const provider = process.env.ACTIVE_AI_PROVIDER || 'openai';
  
  switch (provider) {
    case 'openai': return new OpenAIService();
    // case 'claude': return new ClaudeService();
    default: return new OpenAIService();
  }
}
