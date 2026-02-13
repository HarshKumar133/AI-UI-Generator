// ============================================
// COMPONENT REGISTRY
// Central registry of all allowed components
// and their valid props — single source of truth
// ============================================

export type ComponentType = 'Button' | 'Card' | 'Input' | 'Table' | 'Modal' | 'Sidebar' | 'Navbar' | 'Chart';

export interface ComponentSchema {
  name: ComponentType;
  description: string;
  allowedProps: string[];
}

export const COMPONENT_SCHEMA: Record<ComponentType, ComponentSchema> = {
  Button: {
    name: 'Button',
    description: 'A clickable button with variant, size, and disabled support',
    allowedProps: ['variant', 'size', 'disabled', 'onClick', 'children', 'type'],
  },
  Card: {
    name: 'Card',
    description: 'A content container with optional title, subtitle, and footer',
    allowedProps: ['title', 'subtitle', 'footer', 'children'],
  },
  Input: {
    name: 'Input',
    description: 'Text input field with label, placeholder, type, and error support',
    allowedProps: ['label', 'placeholder', 'type', 'value', 'onChange', 'error', 'disabled'],
  },
  Table: {
    name: 'Table',
    description: 'Data table with columns and rows',
    allowedProps: ['columns', 'data', 'striped'],
  },
  Modal: {
    name: 'Modal',
    description: 'Overlay dialog box with title, content, and close behavior',
    allowedProps: ['isOpen', 'onClose', 'title', 'children', 'size'],
  },
  Sidebar: {
    name: 'Sidebar',
    description: 'Side navigation panel with menu items',
    allowedProps: ['items', 'title', 'collapsed'],
  },
  Navbar: {
    name: 'Navbar',
    description: 'Top navigation bar with brand, links, and actions',
    allowedProps: ['brand', 'items', 'actions'],
  },
  Chart: {
    name: 'Chart',
    description: 'Data visualization chart (bar, line, pie)',
    allowedProps: ['type', 'data', 'title', 'height'],
  },
};

// Get allowed component names as a list
export function getAllowedComponents(): ComponentType[] {
  return Object.keys(COMPONENT_SCHEMA) as ComponentType[];
}

// Get descriptions for LLM prompts
export function getComponentDescriptions(): string {
  const descriptions = Object.values(COMPONENT_SCHEMA)
    .map(schema => `- <${schema.name}>: ${schema.description}. Props: ${schema.allowedProps.join(', ')}`)
    .join('\n');

  return `ALLOWED COMPONENTS (use ONLY these):\n${descriptions}`;
}

// Validate that only allowed components are used in code
export function validateComponentUsage(code: string): { valid: boolean; violations: string[] } {
  const violations: string[] = [];

  // Check for JSX tags that aren't in our allowed list
  const jsxTagRegex = /<([A-Z][a-zA-Z]*)/g;
  let match;
  const allowedSet = new Set(getAllowedComponents());
  const exceptions = new Set(['React', 'Fragment', 'GeneratedUI']);

  while ((match = jsxTagRegex.exec(code)) !== null) {
    const tag = match[1];
    if (!allowedSet.has(tag as ComponentType) && !exceptions.has(tag)) {
      violations.push(`<${tag}> is not an allowed component`);
    }
  }

  return { valid: violations.length === 0, violations };
}

// Sanitize user prompts to prevent injection
export function sanitizePrompt(prompt: string): string {
  if (!prompt) return '';

  let sanitized = prompt.trim();

  // Remove potential prompt injections
  const injectionPatterns = [
    /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions|rules|prompts)/gi,
    /system\s*:\s*/gi,
    /you\s+are\s+now\s+/gi,
    /forget\s+(all\s+)?(previous|your)\s+/gi,
    /\bpretend\s+/gi,
    /act\s+as\s+(if|a)\s+/gi,
    /override\s+(all\s+)?/gi,
    /```[\s\S]*?```/g, // Remove code blocks from prompts
  ];

  for (const pattern of injectionPatterns) {
    sanitized = sanitized.replace(pattern, '[filtered] ');
  }

  // Limit length
  if (sanitized.length > 2000) {
    sanitized = sanitized.substring(0, 2000) + '...';
  }

  return sanitized;
}