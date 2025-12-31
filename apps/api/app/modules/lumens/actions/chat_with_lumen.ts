import env from '#start/env'
import { OpenRouter } from '@openrouter/sdk'
import type { ChatResponse, QueryAnalysis } from '../config/chat_types.js'
import { ANALYSIS_MODEL, MODEL_MAP } from '../config/model_map.js'
import {
  ANALYSIS_JSON_SCHEMA,
  ANALYSIS_SYSTEM_PROMPT,
  buildPersonalityPrompt,
  GUARDRAILS_PROMPT,
  RESPONSE_JSON_SCHEMA,
} from '../config/prompts.js'
import type Lumen from '../models/lumen.js'
import type Message from '#modules/messages/models/messages'
import logger from '@adonisjs/core/services/logger'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatActionParams {
  query: string
  lumen: Lumen
  conversationHistory: Message[]
}

export default class ChatWithLumenAction {
  #client: OpenRouter

  constructor() {
    const apiKey = env.get('OPENROUTER_API_KEY')
    this.#client = new OpenRouter({ apiKey })
  }

  async execute({ query, lumen, conversationHistory }: ChatActionParams): Promise<ChatResponse> {
    const startTime = Date.now()

    const analysis = await this.#analyzeQuery(query)
    const model = MODEL_MAP[analysis.topic][analysis.difficulty]

    const response = await this.#generateResponse({
      query,
      lumen,
      conversationHistory,
      model,
    })

    const totalTimeMs = Date.now() - startTime
    logger.info(
      {
        topic: analysis.topic,
        difficulty: analysis.difficulty,
        model,
        responseLength: response.content.length,
        historyMessageCount: conversationHistory.length,
        totalTimeMs,
      },
      'Chat request completed'
    )

    return response
  }

  async #analyzeQuery(query: string): Promise<QueryAnalysis> {
    const startTime = Date.now()

    const response = await this.#client.chat.send({
      model: ANALYSIS_MODEL,
      messages: [
        { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
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
      return { topic: 'trivia', difficulty: 'medium' }
    }

    const content = typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent)
    const analysis = JSON.parse(content) as QueryAnalysis

    logger.debug({ analysisTimeMs: Date.now() - startTime }, 'Analysis completed')

    return analysis
  }

  async #generateResponse({
    query,
    lumen,
    conversationHistory,
    model,
  }: {
    query: string
    lumen: Lumen
    conversationHistory: Message[]
    model: string
  }): Promise<ChatResponse> {
    const startTime = Date.now()

    const messages: ChatMessage[] = [
      { role: 'system', content: GUARDRAILS_PROMPT },
      { role: 'system', content: buildPersonalityPrompt(lumen.name, lumen.personality) },
    ]

    for (const msg of conversationHistory) {
      const isLumen = msg.author_id === lumen.id
      messages.push({
        role: isLumen ? 'assistant' : 'user',
        content: msg.content,
      })
    }

    messages.push({ role: 'user', content: query })

    const response = await this.#client.chat.send({
      model,
      messages,
      responseFormat: {
        type: 'json_schema',
        jsonSchema: RESPONSE_JSON_SCHEMA,
      },
      provider: { requireParameters: true },
    })

    const rawContent = response.choices?.[0]?.message?.content
    if (!rawContent) {
      const errorMsg = 'Failed to generate response'
      logger.error({ model, responseTimeMs: Date.now() - startTime }, errorMsg)
      throw new Error(errorMsg)
    }

    const content = typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent)
    const chatResponse = JSON.parse(content) as ChatResponse

    logger.debug({ model, responseTimeMs: Date.now() - startTime }, 'Response generated')

    return chatResponse
  }
}
