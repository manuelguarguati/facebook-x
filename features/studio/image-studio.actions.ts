'use server';

import { createClient } from '@/lib/supabase/server';

export async function generateImageAction(prompt: string, aspectRatio: string = "1:1") {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error('No autenticado');

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY no configurada');

  try {
    // Using current experimental Gemini 2.0 Flash Image Generation endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${prompt} (Aspect Ratio: ${aspectRatio})` }] }],
          generationConfig: { 
            responseModalities: ["TEXT", "IMAGE"] 
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Error al generar imagen');
    }

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts || [];

    let imageBase64 = '';
    let mimeType = 'image/png';
    let text = '';

    for (const part of parts) {
      if (part.inlineData) {
        imageBase64 = part.inlineData.data;
        mimeType = part.inlineData.mimeType || 'image/png';
      }
      if (part.text) text = part.text;
    }

    if (!imageBase64) throw new Error('No se generó ninguna imagen');

    return { success: true, imageBase64, mimeType, text };
  } catch (error: any) {
    console.error('Image Generation Error:', error);
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${apiKey}`,
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
