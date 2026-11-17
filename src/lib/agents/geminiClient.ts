import { GoogleGenerativeAI } from '@google/generative-ai';

let clients: GoogleGenerativeAI[] = [];
let activeKeyIndex = 0;
const DEFAULT_MODEL = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';

export function getGeminiClient(): GoogleGenerativeAI {
    if (clients.length === 0) {
        const apiKeyEnv = process.env.GEMINI_API_KEY;
        if (!apiKeyEnv) {
            throw new Error('GEMINI_API_KEY environment variable is not set');
        }

        const apiKeys = apiKeyEnv.split(',').map(key => key.trim()).filter(Boolean);
        if (apiKeys.length === 0) {
            throw new Error('No valid API keys found in GEMINI_API_KEY');
        }

        clients = apiKeys.map(key => new GoogleGenerativeAI(key));
    }
    return clients[activeKeyIndex];
}

export function rotateGeminiClient(): void {
    if (clients.length > 0) {
        activeKeyIndex = (activeKeyIndex + 1) % clients.length;
    }
}

function isRateLimitError(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) {
        return false;
    }

    const maybeError = error as { status?: number; message?: string };
    return (
        maybeError.status === 429 ||
        maybeError.message?.includes('429') === true ||
        maybeError.message?.toLowerCase().includes('quota') === true
    );
}

function isTransientProviderError(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) return false;
    const maybeError = error as { status?: number; message?: string };
    const status = maybeError.status;
    const message = maybeError.message?.toLowerCase() || '';
    return status === 429 || status === 500 || status === 502 || status === 503 || status === 504
        || /\b(429|500|502|503|504)\b|high demand|temporar(?:y|ily)|overload|unavailable/.test(message);
}

function waitForRetry(attempt: number): Promise<void> {
    const delay = Math.min(2_000, 400 * 2 ** attempt);
    return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function callGemini(prompt: string, systemInstruction?: string): Promise<string> {
    getGeminiClient(); // Ensure clients are initialized

    let attempts = 0;
    const maxAttempts = Math.max(3, clients.length * 2);

    while (attempts < maxAttempts) {
        const client = getGeminiClient();
        const model = client.getGenerativeModel({
            model: DEFAULT_MODEL,
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
        } catch (error: unknown) {
            if (isRateLimitError(error)) {
                console.warn(`[Gemini API] Key index ${activeKeyIndex} hit rate limit (429). Rotating key...`);
                rotateGeminiClient();
                attempts++;

                if (attempts >= maxAttempts) {
                    throw new Error('All available API keys have reached their quota limits. Please top up or add new keys to continue.');
                }
                await waitForRetry(attempts - 1);
                continue;
            }

            if (isTransientProviderError(error) && attempts < maxAttempts - 1) {
                console.warn(`[Gemini API] Temporary provider error; retrying (${attempts + 1}/${maxAttempts})...`);
                await waitForRetry(attempts);
                attempts++;
                continue;
            }

            throw error;
        }
    }

    throw new Error('Failed to generate content after exhausting all available keys.');
}
