// ============================================
// CODE VALIDATOR
// Validates AI-generated code for safety and
// adherence to the deterministic component rules
// ============================================

import { COMPONENT_SCHEMA, ComponentType } from './componentRegistry';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  componentCount: number;
}

const PROHIBITED_PATTERNS = [
  { pattern: /style\s*=\s*\{/g, message: 'Inline styles detected on components (only layout wrappers allowed)' },
  { pattern: /import.*from\s+['"](?!react|@\/components\/ui)/g, message: 'External/unauthorized imports detected' },
  { pattern: /eval\s*\(/g, message: 'eval() usage detected — security risk' },
  { pattern: /dangerouslySetInnerHTML/g, message: 'dangerouslySetInnerHTML detected — security risk' },
  { pattern: /document\.(cookie|write)/g, message: 'Direct DOM manipulation detected — security risk' },
  { pattern: /window\.(location|open)/g, message: 'Window navigation detected — security risk' },
  { pattern: /fetch\s*\(|axios|XMLHttpRequest/g, message: 'Network requests in generated code — security risk' },
  { pattern: /localStorage|sessionStorage/g, message: 'Storage API usage detected — security risk' },
  { pattern: /innerHTML\s*=/g, message: 'innerHTML assignment detected — security risk' },
  { pattern: /<script/gi, message: 'Script tag detected — security risk' },
];

const REQUIRED_PATTERNS = [
  { pattern: /export\s+default/, message: 'Missing default export' },
  { pattern: /function\s+GeneratedUI|const\s+GeneratedUI/, message: 'Missing GeneratedUI function name' },
];

export function validateGeneratedCode(code: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!code || code.trim().length === 0) {
    return { isValid: false, errors: ['Generated code is empty'], warnings: [], componentCount: 0 };
  }

  // Check for prohibited patterns
  for (const { pattern, message } of PROHIBITED_PATTERNS) {
    pattern.lastIndex = 0; // Reset regex state
    if (pattern.test(code)) {
      // Inline styles on layout wrapper divs are acceptable
      if (message.includes('Inline styles') && /style\s*=\s*\{\s*\{[^}]*(?:display|flex|grid|gap|padding|margin|width|height|align|justify)/g.test(code)) {
        warnings.push(`${message} (layout wrappers may be acceptable)`);
      } else if (message.includes('security risk')) {
        errors.push(message);
      } else {
        warnings.push(message);
      }
    }
  }

  // Check required patterns
  for (const { pattern, message } of REQUIRED_PATTERNS) {
    if (!pattern.test(code)) {
      warnings.push(message);
    }
  }

  // Count and validate component usage
  const allowedComponents = Object.keys(COMPONENT_SCHEMA) as ComponentType[];
  let componentCount = 0;

  for (const comp of allowedComponents) {
    const regex = new RegExp(`<${comp}[\\s/>]`, 'g');
    const matches = code.match(regex);
    if (matches) {
      componentCount += matches.length;
    }
  }

  // Check for unknown components (JSX tags not in allowed list and not HTML)
  const jsxTagRegex = /<([A-Z][a-zA-Z]*)/g;
  let match;
  const usedComponents = new Set<string>();
  while ((match = jsxTagRegex.exec(code)) !== null) {
    usedComponents.add(match[1]);
  }

  const htmlLikeTags = new Set(['React', 'Fragment', 'GeneratedUI']);
  for (const tag of usedComponents) {
    if (!allowedComponents.includes(tag as ComponentType) && !htmlLikeTags.has(tag)) {
      errors.push(`Unknown component used: <${tag}>. Only allowed: ${allowedComponents.join(', ')}`);
    }
  }

  if (componentCount === 0) {
    warnings.push('No allowed components detected in code');
  }

  // Check code length (sanity check)
  if (code.length > 50000) {
    errors.push('Generated code exceeds maximum length (50KB)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    componentCount,
  };
}