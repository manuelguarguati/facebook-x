import { AIProvider, ContentGenerationParams } from './ai.provider';
import OpenAI from 'openai';

export class OpenAIService implements AIProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async generateContent({ topic, tone, context, language, raw, image }: ContentGenerationParams): Promise<string> {
    const messages: any[] = [];
    
    if (raw) {
      const content: any[] = [{ type: 'text', text: context || topic }];
      if (image?.inlineData) {
        content.push({
          type: 'image_url',
          image_url: { url: `data:${image.inlineData.mimeType};base64,${image.inlineData.data}` }
        });
      } else if (image?.url) {
        content.push({
          type: 'image_url',
          image_url: { url: image.url }
        });
      }
      messages.push({ role: 'user', content });
    } else {
      messages.push({ 
        role: 'system', 
        content: `You are an expert social media AI. Target tone: ${tone}. IMPORTANT: You must write EVERYTHING in ${language || 'Spanish'} language.` 
      });
      
      const userContent: any[] = [{ type: 'text', text: `Write an engaging post about: ${topic}. Context: ${context || 'None'}` }];
      if (image?.inlineData) {
        userContent.push({
          type: 'image_url',
          image_url: { url: `data:${image.inlineData.mimeType};base64,${image.inlineData.data}` }
        });
      } else if (image?.url) {
        userContent.push({
          type: 'image_url',
          image_url: { url: image.url }
        });
      }
      messages.push({ role: 'user', content: userContent });
    }

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages
    });
    
    return response.choices[0].message.content || '';
  }

  async analyzeMetrics(data: unknown): Promise<unknown> {
    return { inferred_sentiment: 'positive', data };
  }
}
