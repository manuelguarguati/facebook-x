import fs from 'fs';

async function listAll() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=(.*)/);
    const apiKey = match ? match[1].trim().replace(/^["']|["']$/g, '') : null;

    if (!apiKey) {
      console.error('Error: No API key found.');
      return;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const data = await response.json();

    if (data.models) {
      console.log('--- MODELOS DISPONIBLES ---');
      const simplified = data.models.map(m => ({
        name: m.name,
        methods: m.supportedGenerationMethods
      }));
      console.log(JSON.stringify(simplified, null, 2));
    } else {
      console.log('No models found or error response:', data);
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('Error: Timeout alcanzado al conectar con Gemini API.');
    } else {
      console.error('Error FATAL:', err.message);
    }
  }
}

listAll();
