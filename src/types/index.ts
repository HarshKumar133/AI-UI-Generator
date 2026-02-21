// ============================================
// Core Types for Deterministic UI Generator
// ============================================

// The fixed set of allowed components - AI cannot create new ones
export type ComponentType =
  | 'Button'
  | 'Card'
  | 'Input'
  | 'Table'
  | 'Modal'
  | 'Sidebar'
  | 'Navbar'
  | 'Chart'
  | 'Badge'
  | 'Avatar'
  | 'Progress'
  | 'Stat'
  | 'Alert'
  | 'Toggle'
  | 'Tabs'
  | 'Divider'
  | 'Select';

export const ALLOWED_COMPONENTS: ComponentType[] = [
  'Button',
  'Card',
  'Input',
  'Table',
  'Modal',
  'Sidebar',
  'Navbar',
  'Chart',
  'Badge',
  'Avatar',
  'Progress',
  'Stat',
  'Alert',
  'Toggle',
  'Tabs',
  'Divider',
  'Select',
];

// Component node in the plan tree
export interface ComponentNode {
  type: ComponentType;
  props: Record<string, unknown>;
  children?: (ComponentNode | string)[];
}

// Output of the Planner agent
export interface PlannerOutput {
  layout: 'single-column' | 'two-column' | 'sidebar-layout' | 'dashboard' | 'centered' | 'full-width';
  components: ComponentNode[];
  reasoning: string;
}

// Output of the Generator agent
export interface GeneratorOutput {
  code: string;
  componentList: ComponentType[];
}

// Output of the Explainer agent
export interface ExplainerOutput {
  explanation: string;
  componentChoices: { component: string; reason: string }[];
  layoutReason: string;
}

// Full pipeline result
export interface GenerationResult {
  plan: PlannerOutput;
  generation: GeneratorOutput;
  explanation: ExplainerOutput;
  version: number;
  timestamp: string;
  userPrompt: string;
}

// Chat message
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  generationResult?: GenerationResult;
}

// Version entry for rollback
export interface VersionEntry {
  version: number;
  code: string;
  prompt: string;
  plan: PlannerOutput;
  explanation: ExplainerOutput;
  timestamp: string;
}

// API request types
export interface GenerateRequest {
  prompt: string;
}

export interface ModifyRequest {
  prompt: string;
  currentCode: string;
  currentVersion: number;
}

export interface RollbackRequest {
  targetVersion: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}   