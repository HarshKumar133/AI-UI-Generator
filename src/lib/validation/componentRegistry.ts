import { ALLOWED_COMPONENTS, ComponentType } from '@/types';

// ============================================
// Component Registry - Whitelist Enforcement
// ============================================

// Maps component names to their allowed props
export const COMPONENT_SCHEMA: Record<ComponentType, { requiredProps: string[]; optionalProps: string[] }> = {
  Button: {
    requiredProps: ['children'],
    optionalProps: ['variant', 'size', 'disabled', 'fullWidth', 'onClick', 'type'],
  },
  Card: {
    requiredProps: [],
    optionalProps: ['title', 'subtitle', 'hoverable', 'padding', 'footer', 'headerAction', 'children'],
  },
  Input: {
    requiredProps: [],
    optionalProps: ['label', 'placeholder', 'value', 'onChange', 'type', 'disabled', 'required', 'error', 'helperText', 'size', 'multiline', 'rows'],
  },
  Table: {
    requiredProps: ['columns', 'data'],
    optionalProps: ['striped', 'hoverable', 'compact', 'emptyMessage'],
  },
  Modal: {
    requiredProps: ['isOpen', 'onClose'],
    optionalProps: ['title', 'children', 'footer', 'size'],
  },
  Sidebar: {
    requiredProps: ['groups'],
    optionalProps: ['title', 'width', 'footer'],
  },
  Navbar: {
    requiredProps: [],
    optionalProps: ['brand', 'brandIcon', 'links', 'actions'],
  },
  Chart: {
    requiredProps: ['type', 'data'],
    optionalProps: ['title'],
  },
};

/**
 * Check if a component name is in the allowed list
 */
export function isAllowedComponent(name: string): name is ComponentType {
  return ALLOWED_COMPONENTS.includes(name as ComponentType);
}

/**
 * Validate that code only uses allowed components
 * Returns list of violations
 */
export function validateComponentUsage(code: string): {
  isValid: boolean;
  violations: string[];
  usedComponents: ComponentType[];
} {
  const violations: string[] = [];
  const usedComponents: ComponentType[] = [];

  // Match JSX component usage: <ComponentName or <ComponentName>
  const componentRegex = /<([A-Z][a-zA-Z0-9]*)/g;
  let match;

  while ((match = componentRegex.exec(code)) !== null) {
    const componentName = match[1];
    if (isAllowedComponent(componentName)) {
      if (!usedComponents.includes(componentName)) {
        usedComponents.push(componentName);
      }
    } else {
      // Skip common React/HTML patterns that start with uppercase
      const htmlExceptions = ['React', 'Fragment'];
      if (!htmlExceptions.includes(componentName)) {
        violations.push(`Unauthorized component used: <${componentName}>. Only these are allowed: ${ALLOWED_COMPONENTS.join(', ')}`);
      }
    }
  }

  // Check for inline styles (prohibited)
  if (/style\s*=\s*\{/g.test(code)) {
    violations.push('Inline styles are prohibited. Components use CSS Modules internally.');
  }

  // Check for arbitrary CSS class generation
  if (/className\s*=\s*{(?!.*styles)/g.test(code)) {
    // Allow className={styles.xxx} pattern but flag arbitrary strings
    const classNameRegex = /className\s*=\s*["'][^"']*["']/g;
    const classMatches = code.match(classNameRegex);
    if (classMatches) {
      // Allow layout classes only
      const allowedClasses = ['layout-', 'grid-', 'flex-', 'container', 'wrapper', 'section'];
      classMatches.forEach(cm => {
        const value = cm.replace(/className\s*=\s*["']/, '').replace(/["']$/, '');
        const isAllowed = allowedClasses.some(ac => value.includes(ac));
        if (!isAllowed && value.length > 0) {
          // This is a soft warning, not a violation
        }
      });
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
    usedComponents,
  };
}

/**
 * Get the schema for a specific component
 */
export function getComponentSchema(name: ComponentType) {
  return COMPONENT_SCHEMA[name];
}

/**
 * Get a description of all allowed components for AI prompts
 */
export function getComponentDescriptions(): string {
  return `
ALLOWED COMPONENTS (you may ONLY use these):

1. **Button** - Clickable button element
   Props: children (required), variant ("primary"|"secondary"|"outline"|"ghost"|"danger"), size ("sm"|"md"|"lg"), disabled (boolean), fullWidth (boolean), onClick (function)

2. **Card** - Container card with optional header/footer
   Props: title (string), subtitle (string), hoverable (boolean), padding ("normal"|"compact"|"none"), footer (ReactNode), headerAction (ReactNode), children (ReactNode)

3. **Input** - Text input field
   Props: label (string), placeholder (string), value (string), onChange (function), type ("text"|"email"|"password"|"number"|"search"|"url"), disabled (boolean), required (boolean), error (string), helperText (string), size ("sm"|"md"|"lg"), multiline (boolean), rows (number)

4. **Table** - Data table
   Props: columns (required, array of {key, header, width?}), data (required, array of row objects), striped (boolean), hoverable (boolean), compact (boolean), emptyMessage (string)

5. **Modal** - Dialog/popup overlay
   Props: isOpen (required, boolean), onClose (required, function), title (string), children (ReactNode), footer (ReactNode), size ("sm"|"md"|"lg"|"xl")

6. **Sidebar** - Side navigation panel
   Props: groups (required, array of {label?, items: [{id, label, icon?, active?, onClick?}]}), title (string), width ("sm"|"md"|"lg"), footer (ReactNode)

7. **Navbar** - Top navigation bar
   Props: brand (string), brandIcon (string), links (array of {id, label, active?, onClick?}), actions (ReactNode)

8. **Chart** - Data visualization
   Props: type (required, "bar"|"pie"), data (required, array of {label, value, color?}), title (string)
`.trim();
}