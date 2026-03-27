import { AIProvider, ContentGenerationParams } from './ai.provider';
import OpenAI from 'openai';

export class OpenAIService implements AIProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async generateContent({ topic, tone, context, language, raw }: ContentGenerationParams): Promise<string> {
    if (raw) {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: context || topic }
        ]
      });
      return response.choices[0].message.content || '';
    }

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: `You are an expert social media AI. Target tone: ${tone}. IMPORTANT: You must write EVERYTHING in ${language || 'Spanish'} language.` },
        { role: 'user', content: `Write an engaging post about: ${topic}. Context: ${context || 'None'}` }
      ]
    });
    return response.choices[0].message.content || '';
  }

  async analyzeMetrics(data: unknown): Promise<unknown> {
    return { inferred_sentiment: 'positive', data };
  }
}
