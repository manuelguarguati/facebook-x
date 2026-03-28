import fs from 'fs';

async function listModels() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=(.*)/);
    const apiKey = match ? match[1].trim().replace(/^["']|["']$/g, '') : null;

    if (!apiKey) {
      console.error('Error: GEMINI_API_KEY no encontrada en .env.local');
      return;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!response.ok) {
      const err = await response.json();
      console.error('API Error:', err);
      return;
    }

    const data = await response.json();
    const imageModels = data.models
      ?.filter(m => m.name.toLowerCase().includes('image') || m.supportedGenerationMethods.includes('generateContent'))
      .map(m => m.name);

    console.log('--- MODELOS DISPONIBLES ---');
    console.log(JSON.stringify(imageModels, null, 2));
  } catch (err) {
    console.error('Error fatal:', err.message);
  }
}

listModels();
