"use server";

import { generateWithFallback } from '@/services/ai/ai.provider';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { PageRepository } from '@/repositories/page.repository';
import { ScheduledPostRepository } from '@/repositories/scheduled-post.repository';

export async function generatePost(formData: FormData) {
  try {
    const contentType = formData.get('contentType') as string;
    const details = formData.get('details') as string || 'General';
    const tone = formData.get('tone') as string || 'viral';
    const platform = formData.get('platform') as string || 'Facebook';

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Inicia sesión para usar la IA' };
    }

    const prompts: Record<string, string> = {
      // Noticias y Tendencias
      'Noticia viral del día': `Crea un post viral sobre noticias actuales. Tono: ${tone}. Plataforma: ${platform}. Detalles: ${details}. Incluye gancho inicial impactante, desarrollo y llamada a la acción.`,
      'Opinión sobre tendencia': `Escribe una opinión persuasiva sobre una tendencia actual. Tono: ${tone}. Plataforma: ${platform}. Tendencia: ${details}. Estructura: Postura, argumentos clave y pregunta para debate.`,
      'Resumen de noticias tech': `Resume noticias tecnológicas recientes de forma concisa. Tono: ${tone}. Plataforma: ${platform}. Temas: ${details}. Formato: Puntos clave + impacto para el usuario.`,

      // Negocios y Emprendimiento
      'Consejo de negocios': `Crea un post con un consejo de negocios práctico y accionable. Tono: ${tone}. Plataforma: ${platform}. Contexto: ${details}. Formato: consejo directo + explicación + ejemplo real.`,
      'Historia de éxito': `Narra una historia de éxito inspiradora. Tono: ${tone}. Plataforma: ${platform}. Protagonista/Logro: ${details}. Resalta los obstáculos superados y la lección final.`,
      'Tip de productividad': `Comparte un tip de productividad de alto impacto. Tono: ${tone}. Plataforma: ${platform}. Área: ${details}. Estructura: El problema, la solución (tip) y cómo implementarlo.`,
      'Motivación empresarial': `Escribe un post motivacional para emprendedores. Tono: ${tone}. Plataforma: ${platform}. Mensaje: ${details}. Usa lenguaje empoderador e invita a la acción inmediata.`,

      // Educativo e Informativo
      'Tutorial paso a paso': `Crea un post educativo en formato tutorial. Tono: ${tone}. Plataforma: ${platform}. Tema: ${details}. Formato: título llamativo + pasos numerados + conclusión.`,
      'Dato curioso': `Presenta un dato curioso o "fun fact" sorprendente. Tono: ${tone}. Plataforma: ${platform}. Tema: ${details}. Hazlo entretenido y fácil de digerir.`,
      'Mito vs realidad': `Desmiente un mito común sobre un tema. Tono: ${tone}. Plataforma: ${platform}. Tema: ${details}. Formato: El mito, la realidad (con datos) y por qué importa.`,
      'Pregunta reflexiva': `Plantea una pregunta profunda que invite a la reflexión. Tono: ${tone}. Plataforma: ${platform}. Contexto: ${details}. Acompañala de una breve reflexión propia.`,

      // Entretenimiento
      'Meme textual': `Crea contenido de entretenimiento ligero y divertido. Plataforma: ${platform}. Contexto: ${details}. Hazlo relatable, con humor inteligente y que invite a compartir.`,
      'Historia graciosa': `Cuenta una anécdota corta y graciosa. Tono: ${tone}. Plataforma: ${platform}. Situación: ${details}. Enfócate en el remate (punchline) final.`,
      'Pregunta para engagement': `Crea una pregunta diseñada para generar muchos comentarios. Tono: ${tone}. Plataforma: ${platform}. Tema: ${details}. Hazla simple y fácil de responder.`,
      'Encuesta/Poll': `Diseña una encuesta interactiva. Plataforma: ${platform}. Tema: ${details}. Incluye la pregunta principal y 3-4 opciones de respuesta atractivas.`,

      // Lifestyle y Motivación
      'Frase motivacional': `Crea una frase corta y poderosa para inspirar el día. Tono: ${tone}. Plataforma: ${platform}. Inspiración: ${details}. Acompáñala de un breve desarrollo.`,
      'Rutina diaria': `Sugiere una rutina diaria optimizada. Tono: ${tone}. Plataforma: ${platform}. Objetivo: ${details}. Enfócate en hábitos saludables y manejo del tiempo.`,
      'Consejo de vida': `Comparte una lección de vida valiosa. Tono: ${tone}. Plataforma: ${platform}. Tema: ${details}. Usa un tono empático y sabio.`,
      'Reflexión personal': `Escribe una reflexión honesta sobre un aspecto de la vida. Tono: ${tone}. Plataforma: ${platform}. Pensamiento: ${details}. Fomenta la vulnerabilidad y conexión.`,

      // Ventas y Promoción
      'Promoción de producto': `Crea un post de ventas persuasivo pero no invasivo. Plataforma: ${platform}. Producto/servicio: ${details}. Incluye: beneficio principal + prueba social + llamada a la acción clara.`,
      'Testimonio de cliente': `Redacta un testimonio de cliente de forma natural. Plataforma: ${platform}. Experiencia: ${details}. Resalta el antes y el después de usar el servicio.`,
      'Oferta especial': `Anuncia una oferta o descuento irresistible. Plataforma: ${platform}. Oferta: ${details}. Crea sentido de urgencia y explica cómo aprovecharla.`,
      'Lanzamiento de producto': `Genera expectativas para un nuevo lanzamiento. Plataforma: ${platform}. Novedad: ${details}. Resalta la exclusividad y los beneficios clave.`,

      // Social y Comunidad
      'Causa social': `Escribe un post apoyando una causa o iniciativa social. Tono: ${tone}. Plataforma: ${platform}. Causa: ${details}. Enfócate en la empatía y cómo ayudar.`,
      'Celebración de fecha especial': `Redacta un saludo para una fecha especial o festividad. Tono: ${tone}. Plataforma: ${platform}. Fecha: ${details}. Hazlo cálido y comunitario.`,
      'Pregunta a la comunidad': `Lanza una pregunta para conocer mejor a tus seguidores. Tono: ${tone}. Plataforma: ${platform}. Interés: ${details}. Promueve un ambiente positivo.`,
      'Agradecimiento a seguidores': `Escribe un mensaje genuino de agradecimiento a tu audiencia. Tono: ${tone}. Plataforma: ${platform}. Razón: ${details}. Celebra un hito o simplemente la lealtad.`,
    };

    const basePrompt = prompts[contentType] || `Genera contenido para redes sociales sobre ${details}. Tono: ${tone}. Plataforma: ${platform}.`;
    
    const content = await generateWithFallback({ 
      topic: contentType, 
      tone: tone as 'professional' | 'casual' | 'viral' | 'informative', 
      context: basePrompt 
    });

    return { success: true, content };
  } catch (error: unknown) {
    console.error('AI Generation Error:', error);
    return { success: false, error: 'Error al generar el contenido con IA' };
  }
}

export async function getPagesAction() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const repo = new PageRepository();
    const pages = await repo.getUserPages(user.id);
    return { success: true, pages };
  } catch {
    return { success: false, error: 'Error fetching pages' };
  }
}

export async function saveScheduledPostAction(data: {
  page_id: string;
  content: string;
  scheduled_for: string;
  media_url?: string;
}) {
  try {
    const repo = new ScheduledPostRepository();
    const result = await repo.scheduleNewPost({
      ...data,
      ai_generated: true
    });
    
    if (result.success) {
      revalidatePath('/dashboard/schedule');
    }
    return result;
  } catch (error) {
    return { success: false, error: 'Error saving scheduled post' };
  }
}

export async function analyzeImageAction(base64Image: string, mimeType: string) {
  try {
    const prompt = `Analiza esta imagen detalladamente y genera una descripción viral y atractiva para un post de Facebook. 
    Incluye un gancho inicial, el cuerpo del mensaje y algunos hashtags relevantes. 
    Responde UNICAMENTE con el contenido del post en español.`;

    const content = await generateWithFallback({
      topic: 'image analysis',
      tone: 'viral',
      context: prompt,
      raw: true,
      image: {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      }
    });

    return { success: true, content };
  } catch (error: any) {
    console.error('Image Analysis Error:', error);
    return { success: false, error: 'Error al analizar la imagen con IA' };
  }
}

export async function generateHashtags(content: string) {
  try {
    const prompt = `Genera 10-15 hashtags relevantes para el siguiente contenido de redes sociales. Devuelve solo los hashtags separados por espacios: \n\n${content}`;
    const hashtags = await generateWithFallback({ 
      topic: 'hashtags', 
      tone: 'professional', 
      context: prompt 
    });
    return { success: true, hashtags };
  } catch (error) {
    return { success: false, error: 'Error al generar hashtags' };
  }
}

export async function generateVideoIdeas(content: string) {
  try {
    const prompt = `Basado en este post, sugiere 3 ideas creativas para videos cortos (Reels/TikToks/Shorts). Para cada idea incluye: 1. Gancho 2. Desarrollo 3. Texto en pantalla. \n\nContenido: ${content}`;
    const ideas = await generateWithFallback({ 
      topic: 'video ideas', 
      tone: 'casual', 
      context: prompt 
    });
    return { success: true, ideas };
  } catch (error) {
    return { success: false, error: 'Error al generar ideas de video' };
  }
}
