import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const GENERATED_FILE_PATH = path.join(process.cwd(), 'src', 'generated', 'GeneratedUI.tsx');

export async function POST(request: NextRequest) {
    try {
        const { code } = await request.json();

        if (!code || typeof code !== 'string') {
            return NextResponse.json({ success: false, error: 'Code is required' }, { status: 400 });
        }

        // Basic sanity check — ensure it looks like a valid React component
        if (!code.includes('GeneratedUI') && !code.includes('function') && !code.includes('=>')) {
            return NextResponse.json({ success: false, error: 'Code does not appear to be a valid React component' }, { status: 400 });
        }

        // Clean the code — strip any errant markdown fences
        let cleanCode = code.trim();
        if (cleanCode.startsWith('```')) {
            cleanCode = cleanCode.replace(/^```(?:tsx?|jsx?)?\s*\n?/, '').replace(/\n?```\s*$/, '');
        }

        // Ensure it has a proper default export
        if (!cleanCode.includes('export default')) {
            cleanCode = cleanCode.replace(
                /^(export )?function GeneratedUI/m,
                'export default function GeneratedUI'
            );
            if (!cleanCode.includes('export default')) {
                cleanCode += '\nexport default GeneratedUI;';
            }
        }

        // Write the file synchronously so it's on disk before we return
        fs.writeFileSync(GENERATED_FILE_PATH, cleanCode, 'utf-8');

        return NextResponse.json({ success: true, path: GENERATED_FILE_PATH });
    } catch (error) {
        console.error('[/api/write-preview] Error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Write failed' },
            { status: 500 }
        );
    }
}
