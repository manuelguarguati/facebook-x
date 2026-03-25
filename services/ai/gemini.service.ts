import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIProvider, ContentGenerationParams } from './ai.provider';

export class GeminiService implements AIProvider {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  }

  async generateContent({ topic, tone, context }: ContentGenerationParams): Promise<string> {
    const prompt = `You are an expert social media AI. Target tone: ${tone}. 
    Write an engaging, viral post for social media about: ${topic}. 
    Context: ${context || 'None'}
    
    IMPORTANT: Return ONLY the content of the post, no explanations or extra text.`;
    
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  async analyzeMetrics(data: any): Promise<any> {
    return { inferred_sentiment: 'positive', data };
  }
}
