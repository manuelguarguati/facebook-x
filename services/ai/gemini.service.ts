import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { AIProvider, ContentGenerationParams } from './ai.provider';

export class GeminiService implements AIProvider {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({ model: "gemma-3-1b-it" });
  }

  async generateContent({ topic, tone, context, language, raw }: ContentGenerationParams): Promise<string> {
    if (raw) {
      const result = await this.model.generateContent(context || topic);
      const response = await result.response;
      return response.text();
    }

    const prompt = `You are an expert social media AI. Target tone: ${tone}. 
    Write an engaging, viral post for social media about: ${topic}. 
    Context: ${context || 'None'}
    
    IMPORTANT: Return ONLY the content of the post in ${language || 'Spanish'}, no explanations or extra text.`;
    
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  async analyzeMetrics(data: unknown): Promise<unknown> {
    return { inferred_sentiment: 'positive', data };
  }
}
