import { ConversationTurn } from '@/types';
import { sanitizePrompt } from '../validation';

const MAX_CONTEXT_TURNS = 10;
const MAX_TURN_LENGTH = 1_200;

export function normalizeConversationContext(value: unknown): ConversationTurn[] {
  if (!Array.isArray(value)) return [];

  return value
    .slice(-MAX_CONTEXT_TURNS)
    .flatMap((entry): ConversationTurn[] => {
      if (!entry || typeof entry !== 'object') return [];
      const turn = entry as Record<string, unknown>;
      if ((turn.role !== 'user' && turn.role !== 'assistant') || typeof turn.content !== 'string') return [];

      const content = sanitizePrompt(turn.content).replace(/\s+/g, ' ').trim().slice(0, MAX_TURN_LENGTH);
      return content ? [{ role: turn.role, content }] : [];
    });
}
