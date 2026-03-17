import { GenerationMode, GenerationTarget, TargetPreference } from '@/types';

const MOBILE_TARGET_KEYWORDS = [
  'android',
  'ios',
  'iphone app',
  'ipad app',
  'mobile app',
  'native app',
  'react native',
  'expo',
];

export function resolveGenerationMode(requestedMode?: string): GenerationMode {
  return requestedMode === 'deterministic' ? 'deterministic' : 'creative';
}

export function resolveTarget(userPrompt: string, targetPreference?: TargetPreference): GenerationTarget {
  const normalizedPref = (targetPreference || 'auto').toLowerCase();

  if (normalizedPref === 'web') {
    return 'web';
  }

  if (
    normalizedPref === 'expo-rn' ||
    normalizedPref === 'android' ||
    normalizedPref === 'ios' ||
    normalizedPref === 'mobile' ||
    normalizedPref === 'native'
  ) {
    return 'expo-rn';
  }

  const lowerPrompt = userPrompt.toLowerCase();
  if (MOBILE_TARGET_KEYWORDS.some((keyword) => lowerPrompt.includes(keyword))) {
    return 'expo-rn';
  }

  return 'web';
}
