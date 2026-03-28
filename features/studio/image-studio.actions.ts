'use server';

import { createClient } from '@/lib/supabase/server';

export async function generateImageAction(prompt: string, aspectRatio: string = "1:1") {
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
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&enhance=true&seed=${Date.now()}`;

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error('Error al generar imagen');

    const arrayBuffer = await imageResponse.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return { success: true, imageBase64: base64, mimeType: 'image/jpeg', text: '' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function editImageAction(prompt: string, imageBase64: string, mimeType: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error('No autenticado');

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY no configurada');

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inlineData: { mimeType, data: imageBase64 } }
            ]
          }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Error al editar imagen');
    }

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts || [];

    let resultBase64 = '';
    let resultMime = 'image/png';

    for (const part of parts) {
      if (part.inlineData) {
        resultBase64 = part.inlineData.data;
        resultMime = part.inlineData.mimeType || 'image/png';
      }
    }

    if (!resultBase64) throw new Error('No se generó ninguna imagen editada');

    return { success: true, imageBase64: resultBase64, mimeType: resultMime };
  } catch (error: any) {
    console.error('Image Edit Error:', error);
    return { success: false, error: error.message };
  }
}
