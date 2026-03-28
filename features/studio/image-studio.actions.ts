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
    // Ultra-minimal URL to isolate the 400 error
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;

    console.log('FETCHING_URL:', imageUrl);

    const imageResponse = await fetch(imageUrl, {
      method: 'GET',
      headers: { 'Accept': 'image/jpeg' }
    });

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text().catch(() => 'No details');
      throw new Error(`API ${imageResponse.status}: ${errorText.substring(0, 100)}`);
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    if (arrayBuffer.byteLength < 1000) {
      throw new Error('La imagen generada es demasiado pequeña o inválida.');
    }
    
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return { success: true, imageBase64: base64, mimeType: 'image/jpeg', text: '' };
  } catch (error: any) {
    console.error('GEN_ERROR:', error);
    return { success: false, error: `Fallo Crítico: ${error.message}` };
  }
}

export async function editImageAction(prompt: string, imageBase64: string, mimeType: string) {
  // Pivot: Editing via IA usually requires more complex tools. 
  // For now, we will use the same Pollinations engine but focus on the 'edit' prompt logic.
  // Real image-to-image usually needs a different endpoint.
  // We'll redirect to generation for now to maintain uptime.
  return generateImageAction(`Modificar imagen original con esta instrucción: ${prompt}`, "1:1");
}
