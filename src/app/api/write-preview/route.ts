import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { validateGeneratedArtifact, validateGeneratedCode } from '@/lib/validation';

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
            if (/^(?:export\s+)?function\s+GeneratedUI\b/m.test(cleanCode)) {
                cleanCode = cleanCode.replace(/^(?:export\s+)?function\s+GeneratedUI\b/m, 'export default function GeneratedUI');
            } else if (/^(?:export\s+)?(?:const|let|class)\s+GeneratedUI\b/m.test(cleanCode)) {
                cleanCode += '\nexport default GeneratedUI;';
            }
        }

        const artifactValidation = validateGeneratedArtifact({ format: 'tsx', code: cleanCode }, 'tsx');
        const codeValidation = validateGeneratedCode(cleanCode, { mode: 'creative', target: 'web' });
        const validationErrors = [
            ...artifactValidation.errors,
            ...codeValidation.errors,
        ];
        if (validationErrors.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Generated preview was blocked because it failed schema, syntax, or safety validation.',
                    diagnostics: [...artifactValidation.errors, ...codeValidation.errors].join('\n'),
                },
                { status: 422 }
            );
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
