declare var process: any;

const API_KEY = process.env.EXPO_PUBLIC_ELEVEN_LABS_API_KEY;
const VOICE_ID = process.env.EXPO_PUBLIC_ELEVEN_LABS_VOICE_ID;

export const generateSpeech = async (text: string): Promise<string> => {
  if (!API_KEY || !VOICE_ID) {
    console.error("Missing ElevenLabs Config. Check your .env file!");
    throw new Error("API Configuration missing");
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API returned ${response.status}`);
    }

    // --- NEW MOBILE-FRIENDLY LOGIC ---
    // 1. Get audio as an ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();
    
    // 2. Convert ArrayBuffer to Base64
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    const base64Audio = btoa(binary);

    // 3. Return as a Data URI that expo-av understands
    return `data:audio/mpeg;base64,${base64Audio}`;
    
  } catch (error) {
    console.error("Voice Generation Error:", error);
    throw error;
  }
};