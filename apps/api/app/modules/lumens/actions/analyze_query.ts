import env from '#start/env'
import { OpenRouter } from '@openrouter/sdk'
import type { QueryAnalysis } from '../config/chat_types.js'

import { ANALYSIS_MODEL, MODEL_MAP } from '../config/model_map.js'
import { ANALYSIS_JSON_SCHEMA, ANALYSIS_SYSTEM_PROMPT } from '../config/prompts.js'
import type Message from '#modules/messages/models/messages'
import logger from '@adonisjs/core/services/logger'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export default class AnalyzeQueryAction {
  #client: OpenRouter

  constructor() {
    const apiKey = env.get('OPENROUTER_API_KEY')
    this.#client = new OpenRouter({ apiKey })
  }

  async execute(
    query: string,
    conversationHistory: Message[],
    lumenId: string
  ): Promise<QueryAnalysis> {
    const startTime = Date.now()

    const recentHistory = conversationHistory.slice(-3)
    const historyMessages: ChatMessage[] = recentHistory.map((msg) => ({
      role: (msg.author_id === lumenId ? 'assistant' : 'user') as 'user' | 'assistant',
      content: msg.content,
    }))

    const response = await this.#client.chat.send({
      model: ANALYSIS_MODEL,
      messages: [
        { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
        ...historyMessages,
        { role: 'user', content: query },
      ],
      responseFormat: {
        type: 'json_schema',
        jsonSchema: ANALYSIS_JSON_SCHEMA,
      },
      provider: { requireParameters: true },
    })

    const rawContent = response.choices?.[0]?.message?.content
    if (!rawContent) {
      logger.warn(
        { queryLength: query.length, analysisTimeMs: Date.now() - startTime },
        'Analysis returned empty, using defaults'
      )
      return {
        topic: 'trivia',
        difficulty: 'medium',
        required_tools: ['web_search'],
        verbosity: 'brief',
        model: MODEL_MAP['medium'],
      }
    }

    const content = typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent)
    const analysis = JSON.parse(content) as QueryAnalysis

    analysis.required_tools = [...new Set(analysis.required_tools)]
    analysis.model = MODEL_MAP[analysis.difficulty]

    if (analysis.topic === 'trivia' && !analysis.required_tools.includes('web_search')) {
      analysis.required_tools.push('web_search')
    }

    return analysis
  }
}
