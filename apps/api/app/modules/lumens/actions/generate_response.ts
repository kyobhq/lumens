import env from '#start/env'
import { OpenRouter } from '@openrouter/sdk'
import type { AvailableTool, ChatResponse, Difficulty, Verbosity } from '../config/chat_types.js'

import {
  buildGuardrailsPrompt,
  buildPersonalityPrompt,
  buildSearchPrompt,
  RESPONSE_JSON_SCHEMA,
} from '../config/prompts.js'
import type Lumen from '../models/lumen.js'
import type Message from '#modules/messages/models/messages'
import logger from '@adonisjs/core/services/logger'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export default class GenerateResponseAction {
  #client: OpenRouter

  static SEARCH_MAX_RESULTS: Record<Difficulty, number> = {
    easy: 3,
    medium: 5,
    hard: 8,
    very_hard: 10,
  }

  constructor() {
    const apiKey = env.get('OPENROUTER_API_KEY')
    this.#client = new OpenRouter({ apiKey })
  }

  async execute({
    query,
    lumen,
    conversationHistory,
    model,
    requiredTools,
    difficulty,
    verbosity,
  }: {
    query: string
    lumen: Lumen
    conversationHistory: Message[]
    model: string
    requiredTools: AvailableTool[]
    difficulty: Difficulty
    verbosity: Verbosity
  }): Promise<ChatResponse> {
    const startTime = Date.now()

    const contextualQuery = this.#buildContextualQuery(query, conversationHistory, lumen.id)

    const messages: ChatMessage[] = [
      { role: 'system', content: buildGuardrailsPrompt(verbosity) },
      { role: 'system', content: buildPersonalityPrompt(lumen.name, lumen.personality) },
      { role: 'user', content: contextualQuery },
    ]

    logger.info({ model, requiredTools }, 'Calling response model')

    const response = await this.#client.chat.send({
      model,
      messages,
      responseFormat: {
        type: 'json_schema',
        jsonSchema: RESPONSE_JSON_SCHEMA,
      },
      provider: { requireParameters: true },
      plugins: requiredTools.includes('web_search')
        ? [
            {
              id: 'web' as const,
              maxResults: GenerateResponseAction.SEARCH_MAX_RESULTS[difficulty],
              searchPrompt: buildSearchPrompt(difficulty),
            },
          ]
        : undefined,
    })

    const message = response.choices?.[0]?.message
    const rawContent = message?.content
    if (!rawContent) {
      const errorMsg = 'Failed to generate response'
      logger.error({ model, responseTimeMs: Date.now() - startTime }, errorMsg)
      throw new Error(errorMsg)
    }

    const content = typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent)
    const chatResponse = JSON.parse(content) as ChatResponse

    logger.info(
      {
        difficulty,
        requiredTools,
        verbosity,
        model,
      },
      'Chat request completed'
    )

    return chatResponse
  }

  #buildContextualQuery(query: string, conversationHistory: Message[], lumenId: string): string {
    if (conversationHistory.length === 0) {
      return query
    }

    const historyText = conversationHistory
      .map((msg) => {
        const role = msg.author_id === lumenId ? 'Assistant' : 'User'
        return `${role}: ${msg.content}`
      })
      .join('\n')

    return `[Conversation context]
${historyText}

[Current message]
${query}`
  }
}
