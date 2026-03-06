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
        model: 'gemini-2.5-flash',
        ...(systemInstruction && {
            systemInstruction: {
                parts: [{ text: systemInstruction }],
                role: 'user',
            },
        }),
    });

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error: any) {
        const isRateLimit = error?.status === 429 || error?.message?.includes('429');

        if (isRateLimit) {
            throw new Error('your api key quota is over. top up with 5$ to continue service');
        }

        throw error;
    }
}
