import { OpenAIService } from './openai.service';
import { GeminiService } from './gemini.service';

export interface ContentGenerationParams {
  topic: string;
  tone: 'professional' | 'casual' | 'viral' | 'informative';
  context?: string;
}

export interface AIProvider {
  generateContent(params: ContentGenerationParams): Promise<string>;
  analyzeMetrics(data: unknown): Promise<unknown>;
}

export async function generateWithFallback(params: ContentGenerationParams): Promise<string> {
  // 1. Try Gemini first
  try {
    const gemini = new GeminiService();
    return await gemini.generateContent(params);
  } catch (error) {
    console.error('Gemini failed, falling back to OpenAI...', error);
    
    // 2. Try OpenAI as fallback
    try {
      const openai = new OpenAIService();
      return await openai.generateContent(params);
    } catch (openaiError) {
      console.error('OpenAI also failed:', openaiError);
      throw new Error('Todos los proveedores de IA fallaron.');
    }
  }
}
