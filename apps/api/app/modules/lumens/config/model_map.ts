import type { Difficulty } from './chat_types.js'

export const MODEL_MAP: Record<Difficulty, string> = {
  easy: 'google/gemini-3-flash-preview:online',
  medium: 'google/gemini-3-pro-preview:online',
  hard: 'anthropic/claude-sonnet-4.5:online',
  very_hard: 'anthropic/claude-opus-4.5:online',
}

export const ANALYSIS_MODEL = 'google/gemini-2.5-flash-preview-09-2025'
