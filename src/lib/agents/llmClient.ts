// ============================================
// LLM Client — Qubrid AI (OpenAI-compatible)
// ============================================

import OpenAI from 'openai';

let client: OpenAI | null = null;

function getClient(): OpenAI {
    if (!client) {
        const apiKey = process.env.QUBRID_API_KEY;
        if (!apiKey) {
            throw new Error('QUBRID_API_KEY environment variable is not set');
        }
        client = new OpenAI({
            baseURL: 'https://platform.qubrid.com/v1',
            apiKey,
        });
    }
    return client;
}

export async function callLLM(prompt: string, systemInstruction?: string): Promise<string> {
    const openai = getClient();

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

    if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
    }

    messages.push({ role: 'user', content: prompt });

    const completion = await openai.chat.completions.create({
        model: 'openai/gpt-oss-120b',
        messages,
        max_tokens: 4096,
        temperature: 0.7,
        top_p: 1,
    });

    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
        throw new Error('No response content from LLM');
    }

    return content;
}
