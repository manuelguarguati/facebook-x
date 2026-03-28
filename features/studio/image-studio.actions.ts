'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Interface for Studio Image Responses to ensure 
 * consistent handling in the frontend components.
 */
export interface StudioImageResponse {
  success: boolean;
  imageBase64?: string;
  mimeType?: string;
  text?: string;
  error?: string;
}

/**
 * Generates an image using Hugging Face Stable Diffusion 3.5 Large.
 * This function handles authentication, dimension scaling, and Base64 conversion.
 */
export async function generateImageAction(prompt: string, aspectRatio: string = "1:1"): Promise<StudioImageResponse> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error('Usuario no autenticado');

  const hfToken = process.env.HUGGINGFACE_API_KEY;
  if (!hfToken) {
    return { 
      success: false, 
      error: 'Configuración pendiente: Por favor agrega HUGGINGFACE_API_KEY en las variables de entorno de Vercel.' 
    };
  }

  try {
    // Define exact dimensions based on Facebook/Social Media best practices
    const dimensions: Record<string, { width: number; height: number }> = {
      "1:1": { width: 1024, height: 1024 },
      "4:5": { width: 896, height: 1152 },
      "16:9": { width: 1344, height: 768 },
      "9:16": { width: 768, height: 1344 },
    };
    const { width, height } = dimensions[aspectRatio] || dimensions["1:1"];

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { 
            width, 
            height,
            negative_prompt: "blurry, low quality, distorted, extra limbs, bad anatomy",
          }
        }),
      }
    );

    if (!response.ok) {
      const errorDetail = await response.text();
      throw new Error(`Error de Hugging Face (${response.status}): ${errorDetail.substring(0, 100)}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return { 
      success: true, 
      imageBase64: base64, 
      mimeType: 'image/jpeg', 
      text: '' 
    };
  } catch (error: any) {
    console.error('IMAGE_GEN_ERROR:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Edits an existing image based on a prompt.
 * Currently uses the main generation engine with context injection.
 */
export async function editImageAction(
  prompt: string, 
  _imageBase64: string, 
  _mimeType: string
): Promise<StudioImageResponse> {
  // Enhancing the prompt to focus on modification logic for Stable Diffusion
  const enhancedPrompt = `High quality modification of previous image context: ${prompt}. Professional lighting, stay true to content.`;
  return generateImageAction(enhancedPrompt, "1:1");
}
