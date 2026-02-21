// ============================================
// COMPONENT REGISTRY
// Central registry of all allowed components
// and their valid props — single source of truth
// ============================================

export type ComponentType = 'Button' | 'Card' | 'Input' | 'Table' | 'Modal' | 'Sidebar' | 'Navbar' | 'Chart'
  | 'Badge' | 'Avatar' | 'Progress' | 'Stat' | 'Alert' | 'Toggle' | 'Tabs' | 'Divider' | 'Select';

export interface ComponentSchema {
  name: ComponentType;
  description: string;
  allowedProps: string[];
}

export const COMPONENT_SCHEMA: Record<ComponentType, ComponentSchema> = {
  Button: {
    name: 'Button',
    description: 'A clickable button with variant, size, and disabled support',
    allowedProps: ['variant', 'size', 'disabled', 'onClick', 'children', 'type', 'fullWidth'],
  },
  Card: {
    name: 'Card',
    description: 'A content container with optional title, subtitle, and footer',
    allowedProps: ['title', 'subtitle', 'footer', 'children', 'hoverable', 'padding', 'headerAction'],
  },
  Input: {
    name: 'Input',
    description: 'Text input field with label, placeholder, type, and error support',
    allowedProps: ['label', 'placeholder', 'type', 'value', 'onChange', 'error', 'disabled', 'helperText', 'required', 'size', 'multiline', 'rows'],
  },
  Table: {
    name: 'Table',
    description: 'Data table with columns and rows',
    allowedProps: ['columns', 'data', 'striped', 'hoverable', 'compact', 'emptyMessage'],
  },
  Modal: {
    name: 'Modal',
    description: 'Overlay dialog box with title, content, and close behavior',
    allowedProps: ['isOpen', 'onClose', 'title', 'children', 'size', 'footer'],
  },
  Sidebar: {
    name: 'Sidebar',
    description: 'Side navigation panel with menu items grouped in sections',
    allowedProps: ['items', 'groups', 'title', 'collapsed', 'width', 'footer'],
  },
  Navbar: {
    name: 'Navbar',
    description: 'Top navigation bar with brand, links, and action buttons',
    allowedProps: ['brand', 'brandIcon', 'items', 'links', 'actions'],
  },
  Chart: {
    name: 'Chart',
    description: 'Data visualization chart (bar, line, pie) with configurable data points',
    allowedProps: ['type', 'data', 'title', 'height'],
  },
  Badge: {
    name: 'Badge',
    description: 'Colored status badge/tag with variant (default, success, warning, error, info) and optional dot',
    allowedProps: ['children', 'variant', 'size', 'dot'],
  },
  Avatar: {
    name: 'Avatar',
    description: 'User avatar with initials fallback, color hash, and optional status indicator (online, offline, busy, away)',
    allowedProps: ['name', 'src', 'size', 'status'],
  },
  Progress: {
    name: 'Progress',
    description: 'Progress bar with percentage, label, and color variants (emerald, blue, amber, red, purple)',
    allowedProps: ['value', 'max', 'label', 'showValue', 'size', 'color'],
  },
  Stat: {
    name: 'Stat',
    description: 'KPI/metric display with large value, label, trend arrow (↑/↓), and optional icon',
    allowedProps: ['label', 'value', 'trend', 'icon', 'subtitle'],
  },
  Alert: {
    name: 'Alert',
    description: 'Notification alert with variant (info, success, warning, error), icon, and optional title',
    allowedProps: ['children', 'variant', 'title', 'dismissible'],
  },
  Toggle: {
    name: 'Toggle',
    description: 'On/off switch toggle with label and optional disabled state',
    allowedProps: ['label', 'checked', 'onChange', 'disabled', 'size'],
  },
  Tabs: {
    name: 'Tabs',
    description: 'Tab navigation with tab items (id, label, icon, content)',
    allowedProps: ['items', 'defaultTab', 'onChange'],
  },
  Divider: {
    name: 'Divider',
    description: 'Horizontal separator line with optional centered label text',
    allowedProps: ['label', 'spacing'],
  },
  Select: {
    name: 'Select',
    description: 'Dropdown select with options (value, label), placeholder, and label',
    allowedProps: ['label', 'options', 'value', 'onChange', 'placeholder', 'disabled', 'size'],
  },
};

export function getAllowedComponents(): ComponentType[] {
  return Object.keys(COMPONENT_SCHEMA) as ComponentType[];
}

export function getComponentDescriptions(): string {
  const descriptions = Object.values(COMPONENT_SCHEMA)
    .map(schema => `- <${schema.name}>: ${schema.description}. Props: ${schema.allowedProps.join(', ')}`)
    .join('\n');

  return `ALLOWED COMPONENTS (use ONLY these):\n${descriptions}`;
}

export function validateComponentUsage(code: string): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
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

export function sanitizePrompt(prompt: string): string {
  if (!prompt) return '';
  let sanitized = prompt.trim();

  const injectionPatterns = [
    /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions|rules|prompts)/gi,
    /system\s*:\s*/gi,
    /you\s+are\s+now\s+/gi,
    /forget\s+(all\s+)?(previous|your)\s+/gi,
    /\bpretend\s+/gi,
    /act\s+as\s+(if|a)\s+/gi,
    /override\s+(all\s+)?/gi,
    /```[\s\S]*?```/g,
  ];

  for (const pattern of injectionPatterns) {
    sanitized = sanitized.replace(pattern, '[filtered] ');
  }

  if (sanitized.length > 2000) {
    sanitized = sanitized.substring(0, 2000) + '...';
  }

  return sanitized;
}