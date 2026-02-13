import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function callGemini(prompt: string, systemInstruction?: string): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({
    model: 'gemini-2.0-flash',
    ...(systemInstruction && {
      systemInstruction: {
        parts: [{ text: systemInstruction }],
        role: 'user',
      },
    }),
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}