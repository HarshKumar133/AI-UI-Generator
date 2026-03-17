// ============================================
// CODE VALIDATOR
// Mode-aware safety + quality checks:
// - deterministic mode keeps strict component constraints
// - creative mode allows broader libraries with safety guardrails
// ============================================

import { COMPONENT_SCHEMA, ComponentType } from './componentRegistry';
import { GenerationMode, GenerationTarget } from '@/types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  componentCount: number;
}

export interface ValidationOptions {
  mode?: GenerationMode;
  target?: GenerationTarget;
}

const HARD_SECURITY_RULES = [
  { pattern: /eval\s*\(/g, message: 'eval() usage detected — security risk' },
  { pattern: /dangerouslySetInnerHTML/g, message: 'dangerouslySetInnerHTML detected — security risk' },
  { pattern: /innerHTML\s*=/g, message: 'innerHTML assignment detected — security risk' },
  { pattern: /document\.(cookie|write)/g, message: 'Direct DOM cookie/write usage detected — security risk' },
  { pattern: /<script/gi, message: 'Script tag detected — security risk' },
];

const RUNTIME_MISMATCH_RULES = [
  { pattern: /from\s+['"](?:fs|path|child_process|worker_threads|net|tls|dgram|os)['"]/g, message: 'Node-only module import detected in generated client code' },
  { pattern: /require\(['"](?:fs|path|child_process|worker_threads|net|tls|dgram|os)['"]\)/g, message: 'Node-only require() detected in generated client code' },
];

const REQUIRED_PATTERNS = [
  { pattern: /export\s+default/, message: 'Missing default export' },
];

export function validateGeneratedCode(code: string, options: ValidationOptions = {}): ValidationResult {
  const mode: GenerationMode = options.mode ?? 'creative';
  const target: GenerationTarget = options.target ?? 'web';
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!code || code.trim().length === 0) {
    return { isValid: false, errors: ['Generated code is empty'], warnings: [], componentCount: 0 };
  }

  for (const { pattern, message } of HARD_SECURITY_RULES) {
    pattern.lastIndex = 0;
    if (pattern.test(code)) {
      errors.push(message);
    }
  }

  for (const { pattern, message } of RUNTIME_MISMATCH_RULES) {
    pattern.lastIndex = 0;
    if (pattern.test(code)) {
      errors.push(message);
    }
  }

  // Inline styles are allowed in creative mode and partially allowed in deterministic mode.
  const hasInlineStyles = /style\s*=\s*\{/.test(code);
  if (hasInlineStyles) {
    if (mode === 'deterministic') {
      warnings.push('Inline styles detected (layout wrappers are acceptable, component-level styling should be minimized).');
    }
  }

  const importSources = extractImportSources(code);
  const unauthorizedImports = importSources.filter((source) => !isImportAllowed(source, mode, target));
  if (unauthorizedImports.length > 0) {
    const message = `Unauthorized imports detected: ${unauthorizedImports.join(', ')}`;
    if (mode === 'deterministic') {
      warnings.push(message);
    } else {
      warnings.push(`${message} (creative mode allows broad libraries, but review compatibility).`);
    }
  }

  // Stronger deterministic checks: fixed component set validation
  const allowedComponents = Object.keys(COMPONENT_SCHEMA) as ComponentType[];
  let componentCount = 0;
  for (const comp of allowedComponents) {
    const regex = new RegExp(`<${comp}[\\s/>]`, 'g');
    const matches = code.match(regex);
    if (matches) {
      componentCount += matches.length;
    }
  }

  if (mode === 'deterministic') {
    const jsxTagRegex = /<([A-Z][a-zA-Z]*)/g;
    let match: RegExpExecArray | null = null;
    const usedComponents = new Set<string>();
    while ((match = jsxTagRegex.exec(code)) !== null) {
      usedComponents.add(match[1]);
    }

    const deterministicExceptions = new Set(['React', 'Fragment', 'GeneratedUI']);
    for (const tag of usedComponents) {
      if (!allowedComponents.includes(tag as ComponentType) && !deterministicExceptions.has(tag)) {
        errors.push(`Unknown component used: <${tag}>. Only allowed: ${allowedComponents.join(', ')}`);
      }
    }

    if (componentCount === 0) {
      warnings.push('No allowed components detected in code');
    }
  } else if (target === 'web' && componentCount === 0) {
    warnings.push('No internal UI-kit components detected (acceptable in creative mode if external UI libraries are intentional).');
  }

  for (const { pattern, message } of REQUIRED_PATTERNS) {
    if (!pattern.test(code)) {
      warnings.push(message);
    }
  }

  if (target === 'web' && !/function\s+GeneratedUI|const\s+GeneratedUI/.test(code)) {
    warnings.push('Missing GeneratedUI function name for web preview compatibility');
  }

  if (code.length > 100000) {
    errors.push('Generated code exceeds maximum length (100KB)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    componentCount,
  };
}

function extractImportSources(code: string): string[] {
  const regex = /^\s*import[\s\S]*?from\s+['"]([^'"]+)['"];?/gm;
  const sources = new Set<string>();
  let match: RegExpExecArray | null = null;
  while ((match = regex.exec(code)) !== null) {
    if (match[1]) sources.add(match[1]);
  }
  return Array.from(sources);
}

function isImportAllowed(source: string, mode: GenerationMode, target: GenerationTarget): boolean {
  if (source === 'react' || source.startsWith('@/')) {
    return true;
  }

  if (mode === 'deterministic') {
    return source === '@/components/ui';
  }

  // Creative mode:
  // - Web: broad allowance (block only Node runtime imports via explicit mismatch checks).
  // - Expo: allow broad packages + react-native ecosystem.
  if (target === 'expo-rn') {
    return true;
  }

  return true;
}
