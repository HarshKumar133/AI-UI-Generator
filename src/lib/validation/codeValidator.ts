import { ValidationResult } from '@/types';
import { validateComponentUsage } from './componentRegistry';

/**
 * Validate generated code before rendering
 */
export function validateGeneratedCode(code: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Check for empty code
  if (!code || code.trim().length === 0) {
    errors.push('Generated code is empty');
    return { isValid: false, errors, warnings };
  }

  // 2. Validate component usage (whitelist enforcement)
  const componentValidation = validateComponentUsage(code);
  if (!componentValidation.isValid) {
    errors.push(...componentValidation.violations);
  }

  // 3. Check for prohibited patterns
  const prohibitedPatterns = [
    { pattern: /import\s+.*from\s+['"](?!@\/components\/ui).*['"]/g, message: 'External library imports are prohibited. Only use components from @/components/ui' },
    { pattern: /<style[\s>]/gi, message: 'Style tags are prohibited' },
    { pattern: /document\.(write|cookie|location)/g, message: 'Direct DOM manipulation is prohibited' },
    { pattern: /eval\s*\(/g, message: 'eval() is prohibited for security reasons' },
    { pattern: /Function\s*\(/g, message: 'Function constructor is prohibited for security reasons' },
    { pattern: /dangerouslySetInnerHTML/g, message: 'dangerouslySetInnerHTML is prohibited for security reasons' },
  ];

  for (const { pattern, message } of prohibitedPatterns) {
    if (pattern.test(code)) {
      errors.push(message);
    }
  }

  // 4. Check for basic JSX validity (rough check)
  const openTags = (code.match(/<[A-Z][a-zA-Z0-9]*/g) || []).length;
  const closeTags = (code.match(/<\/[A-Z][a-zA-Z0-9]*>/g) || []).length;
  const selfClosing = (code.match(/\/>/g) || []).length;

  if (openTags > closeTags + selfClosing + 2) {
    warnings.push('Possible unclosed JSX tags detected');
  }

  // 5. Warning for no components used
  if (componentValidation.usedComponents.length === 0) {
    warnings.push('No deterministic components detected in the generated code');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Sanitize user prompt to prevent injection attacks
 */
export function sanitizePrompt(prompt: string): string {
  // Remove potential injection patterns
  let sanitized = prompt;

  // Remove attempts to override system prompts
  sanitized = sanitized.replace(/ignore\s+(previous|all|above)\s+(instructions|prompts|rules)/gi, '[filtered]');
  sanitized = sanitized.replace(/system\s*:/gi, '[filtered]');
  sanitized = sanitized.replace(/you\s+are\s+now/gi, '[filtered]');
  sanitized = sanitized.replace(/pretend\s+you/gi, '[filtered]');
  sanitized = sanitized.replace(/act\s+as\s+if/gi, '[filtered]');
  sanitized = sanitized.replace(/forget\s+(everything|all)/gi, '[filtered]');

  // Remove code blocks that might contain executable code
  sanitized = sanitized.replace(/```[\s\S]*?```/g, '[code block removed]');

  // Limit length
  if (sanitized.length > 2000) {
    sanitized = sanitized.substring(0, 2000) + '... [truncated]';
  }

  return sanitized.trim();
}