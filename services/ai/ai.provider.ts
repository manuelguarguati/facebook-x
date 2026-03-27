import { cookies } from 'next/headers';
import { OpenAIService } from './openai.service';
import { GeminiService } from './gemini.service';

export interface ContentGenerationParams {
  topic: string;
  tone: 'professional' | 'casual' | 'viral' | 'informative';
  context?: string;
  language?: string;
  raw?: boolean;
}

export interface AIProvider {
  generateContent(params: ContentGenerationParams): Promise<string>;
  analyzeMetrics(data: unknown): Promise<unknown>;
}

export async function generateWithFallback(params: ContentGenerationParams): Promise<string> {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'es';
  const resolvedLanguage = locale === 'en' ? 'English' : 'Spanish';
  const enhancedParams = { ...params, language: resolvedLanguage };

  // 1. Try Gemini first
  try {
    const gemini = new GeminiService();
    return await gemini.generateContent(enhancedParams);
  } catch (error) {
    console.error('Gemini failed, falling back to OpenAI...', error);
    
    // 2. Try OpenAI as fallback
    try {
      const openai = new OpenAIService();
      return await openai.generateContent(enhancedParams);
    } catch (openaiError) {
      console.error('OpenAI also failed:', openaiError);
      throw new Error('Todos los proveedores de IA fallaron.');
    }
  }
}
