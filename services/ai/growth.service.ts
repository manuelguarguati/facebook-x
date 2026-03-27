import { GeminiService } from './gemini.service';
import { OpenAIService } from './openai.service';

export interface GrowthHeaderParams {
  niche: string;
  style: string;
  frequency: string;
  days: number;
  analytics?: string;
}

export class GrowthAIService {
  private readonly PROMPT_TEMPLATE = `Actúa como un sistema completo de crecimiento automático para páginas de Facebook.

No eres un generador de texto. Eres un estratega, creador de contenido, analista de datos y gestor de publicaciones TODO en uno.

Tu objetivo es hacer crecer una página de Facebook generando contenido altamente viral, optimizado y listo para ser publicado automáticamente.

---

CONTEXTO:

- Plataforma: Facebook (Reels + Posts)
- Público objetivo: Latinoamérica
- Nicho: {NICHO}
- Estilo de marca: {ESTILO}
- Frecuencia de publicación: {FRECUENCIA}
- Duración del plan: {DIAS} días

Datos de rendimiento previos (si existen):
{ANALYTICS}

Ejemplos de insights si no hay datos:
- Los posts con preguntas generan más comentarios
- Los videos cortos tienen mayor retención
- El contenido polémico genera más compartidos

---

TAREAS (DEBES HACER TODAS):

1. ESTRATEGIA DE CONTENIDO
Define una estrategia clara: tipos de contenido, distribución semanal, enfoque de crecimiento.

2. GENERACIÓN MASIVA DE CONTENIDO
Genera contenido para TODO el período ({DIAS}) según la frecuencia ({FRECUENCIA}).
Para cada día crea: tipo, hook (max 10 palabras), guion (max 60 seg), subtítulos clave, descripción optimizada (con CTA), emoción principal.

3. OPTIMIZACIÓN VIRAL
Atención en 3 seg, generar interacción, fácil de consumir en móvil, lenguaje natural latino.

4. VARIACIONES INTELIGENTES
Detecta los 5 mejores y crea 3 variaciones de cada uno.

5. GENERACIÓN DE HOOKS MASIVOS
Genera 30 hooks adicionales ultra virales.

6. RECOMENDACIONES DE FORMATO
Reel o Post y sugerencia visual.

7. PROGRAMACIÓN AUTOMÁTICA
Organiza todo en un calendario con Día, Hora recomendada y Tipo.

8. APRENDIZAJE BASADO EN DATOS
Ajusta según {ANALYTICS}.

9. MEJORA CONTINUA
Recomendaciones de crecimiento.

---

FORMATO DE SALIDA (JSON ESTRUCTURADO ESTRICTO):
{
  "estrategia": {
    "resumen": "string",
    "tipos_contenido": ["string"],
    "enfoque": "string"
  },
  "calendario": [
    {
      "dia": "number",
      "hora": "string",
      "tipo": "string",
      "hook": "string",
      "guion": "string",
      "subtitulos": ["string"],
      "descripcion": "string",
      "emocion": "string",
      "formato": "Reel | Post"
    }
  ],
  "mejores_contenidos": ["string"],
  "variaciones": [{"original": "string", "variacion": "string"}],
  "hooks_extra": ["string"],
  "recomendaciones": ["string"]
}

REGLAS: No generes contenido genérico. Todo práctico. Escribe como humano latino.
`;

  async generateStrategy({ niche, style, frequency, days, analytics }: GrowthHeaderParams) {
    const finalPrompt = this.PROMPT_TEMPLATE
      .replace('{NICHO}', niche)
      .replace('{ESTILO}', style)
      .replace('{FRECUENCIA}', frequency)
      .replace('{DIAS}', days.toString())
      .replace('{ANALYTICS}', analytics || 'No hay datos previos disponibles. Usa insights generales de viralidad.');

    // Try Gemini first, then OpenAI
    try {
      const gemini = new GeminiService();
      const response = await gemini.generateContent({
        topic: 'Growth Strategy JSON',
        tone: 'viral',
        context: finalPrompt,
        raw: true
      });
      return this.parseJSON(response);
    } catch (error) {
      console.error('Growth Strategy: Gemini failed, trying OpenAI...', error);
      const openai = new OpenAIService();
      const response = await openai.generateContent({
        topic: 'Growth Strategy JSON',
        tone: 'viral',
        context: finalPrompt,
        raw: true
      });
      return this.parseJSON(response);
    }
  }

  private parseJSON(text: string) {
    try {
      // Clean potential markdown blocks
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse AI JSON response:', text);
      throw new Error('La respuesta de la IA no tiene el formato correcto.');
    }
  }
}
