import {
  AVAILABLE_TOOLS,
  DIFFICULTIES,
  type Difficulty,
  TOPICS,
  VERBOSITIES,
  type Verbosity,
} from './chat_types.js'

export function buildSearchPrompt(difficulty: Difficulty): string {
  const date = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const needsCitations = ['hard', 'very_hard'].includes(difficulty)

  return `Web results from ${date}. Use ONLY these results for facts—don't fill gaps with training data. ${needsCitations ? 'Cite sources [domain.com](url) for claims.' : ''}`
}

export function buildGuardrailsPrompt(verbosity: Verbosity): string {
  const length = verbosity === 'brief' ? '1-3 sentences max.' : 'Be thorough, give full answers.'
  return `Texting a friend. Be natural, use contractions. No AI slop ("Great question!", "I'd be happy to", "Let me know if"). ${length}`
}

export function buildPersonalityPrompt(name: string, personality: string): string {
  return `You are ${name}. Personality: ${personality}`
}

export const ANALYSIS_SYSTEM_PROMPT = `Classify queries. Use conversation context for follow-ups.

Topics: ${TOPICS.join(', ')}
Difficulties: ${DIFFICULTIES.join(', ')} (easy=simple, medium=some explanation, hard=complex, very_hard=expert)
Tools: ${AVAILABLE_TOOLS.join(', ')}
Verbosity: ${VERBOSITIES.join(', ')}

web_search: Use for current events, recent news, celebrities, movies, sports, prices, anything time-sensitive or post-training-data. When in doubt, include it.

brief: Default. Short answers.
expanded: Lists, explanations, "why/how" questions, or when user wants more.`

export const ANALYSIS_JSON_SCHEMA = {
  name: 'query_analysis',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      topic: {
        type: 'string',
        enum: TOPICS,
      },
      difficulty: {
        type: 'string',
        enum: DIFFICULTIES,
      },
      required_tools: {
        type: 'array',
        items: {
          type: 'string',
          enum: AVAILABLE_TOOLS,
        },
      },
      verbosity: {
        type: 'string',
        enum: VERBOSITIES,
      },
    },
    required: ['topic', 'difficulty', 'required_tools', 'verbosity'],
    additionalProperties: false,
  },
}

export const RESPONSE_JSON_SCHEMA = {
  name: 'chat_response',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      content: {
        type: 'string',
      },
    },
    required: ['content'],
    additionalProperties: false,
  },
}
