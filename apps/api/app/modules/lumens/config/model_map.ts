import type { Difficulty, Topic } from './chat_types.js'

export const MODEL_MAP: Record<Topic, Record<Difficulty, string>> = {
  programming: {
    easy: 'minimax/minimax-m2.1:online',
    medium: 'minimax/minimax-m2.1:online',
    hard: 'anthropic/claude-sonnet-4.5:online',
    very_hard: 'anthropic/claude-opus-4.5:online',
  },
  marketing: {
    easy: 'google/gemini-2.5-flash-lite:online',
    medium: 'google/gemini-2.5-flash:online',
    hard: 'anthropic/claude-haiku-4.5:online',
    very_hard: 'anthropic/claude-sonnet-4.5:online',
  },
  seo: {
    easy: 'google/gemini-2.5-flash-lite:online',
    medium: 'google/gemini-2.5-flash-lite:online',
    hard: 'x-ai/grok-4.1-fast:online',
    very_hard: 'x-ai/grok-4.1-fast:online',
  },
  technology: {
    easy: 'google/gemini-2.5-flash-lite:online',
    medium: 'google/gemini-2.5-flash:online',
    hard: 'anthropic/claude-sonnet-4.5:online',
    very_hard: 'anthropic/claude-opus-4.5:online',
  },
  science: {
    easy: 'google/gemini-2.5-flash:online',
    medium: 'google/gemini-3-flash-preview:online',
    hard: 'anthropic/claude-sonnet-4.5:online',
    very_hard: 'anthropic/claude-opus-4.5:online',
  },
  translation: {
    easy: 'google/gemini-2.5-flash-lite:online',
    medium: 'google/gemini-2.5-flash:online',
    hard: 'google/gemini-3-flash-preview:online',
    very_hard: 'google/gemini-3-flash-preview:online',
  },
  legal: {
    easy: 'google/gemini-2.5-flash-lite:online',
    medium: 'google/gemini-2.5-flash:online',
    hard: 'anthropic/claude-haiku-4.5:online',
    very_hard: 'anthropic/claude-sonnet-4.5:online',
  },
  finance: {
    easy: 'openai/gpt-oss-120b:online',
    medium: 'google/gemini-2.5-flash:online',
    hard: 'anthropic/claude-haiku-4.5:online',
    very_hard: 'anthropic/claude-sonnet-4.5:online',
  },
  health: {
    easy: 'google/gemini-2.5-flash-lite:online',
    medium: 'google/gemini-2.5-flash:online',
    hard: 'anthropic/claude-haiku-4.5:online',
    very_hard: 'anthropic/claude-sonnet-4.5:online',
  },
  trivia: {
    easy: 'google/gemini-2.5-flash-lite:online',
    medium: 'google/gemini-2.5-flash:online',
    hard: 'google/gemini-3-flash-preview:online',
    very_hard: 'google/gemini-3-pro-preview:online',
  },
  academia: {
    easy: 'google/gemini-2.5-flash:online',
    medium: 'google/gemini-3-flash-preview:online',
    hard: 'anthropic/claude-sonnet-4.5:online',
    very_hard: 'anthropic/claude-opus-4.5:online',
  },
}

export const ANALYSIS_MODEL = 'openai/gpt-oss-120b'
