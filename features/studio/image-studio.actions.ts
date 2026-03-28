'use server';

import { createClient } from '@/lib/supabase/server';

export interface StudioImageResponse {
  success: boolean;
  imageBase64?: string;
  mimeType?: string;
  text?: string;
  error?: string;
}

export async function generateImageAction(prompt: string, aspectRatio: string = "1:1"): Promise<StudioImageResponse> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error('No autenticado');

  try {
    const dimensions: Record<string, { width: number; height: number }> = {
      "1:1": { width: 1024, height: 1024 },
      "4:5": { width: 896, height: 1152 },
      "16:9": { width: 1344, height: 768 },
      "9:16": { width: 768, height: 1344 },
    };
    const { width, height } = dimensions[aspectRatio] || dimensions["1:1"];

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { width, height }
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Error al generar imagen: ${err}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return { success: true, imageBase64: base64, mimeType: 'image/jpeg', text: '' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function editImageAction(prompt: string, imageBase64: string, mimeType: string): Promise<StudioImageResponse> {
  // Pivot: Editing via IA usually requires more complex tools. 
  // For now, we will use the same Pollinations engine but focus on the 'edit' prompt logic.
  // Real image-to-image usually needs a different endpoint.
  // We'll redirect to generation for now to maintain uptime.
  return generateImageAction(`Modificar imagen original con esta instrucción: ${prompt}`, "1:1");
}
