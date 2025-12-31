import env from '#start/env'
import { OpenRouter } from '@openrouter/sdk'
import type { AvailableTool, ChatResponse, QueryAnalysis } from '../config/chat_types.js'
import { ANALYSIS_MODEL, MODEL_MAP } from '../config/model_map.js'
import {
  ANALYSIS_JSON_SCHEMA,
  ANALYSIS_SYSTEM_PROMPT,
  buildPersonalityPrompt,
  buildToolInstructionPrompt,
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
      requiredTools: analysis.required_tools,
    })

    const totalTimeMs = Date.now() - startTime
    logger.info(
      {
        topic: analysis.topic,
        difficulty: analysis.difficulty,
        requiredTools: analysis.required_tools,
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

    logger.info({ model: ANALYSIS_MODEL }, 'Calling analysis model')

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
      return { topic: 'trivia', difficulty: 'medium', required_tools: ['web_search'] }
    }

    const content = typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent)
    const analysis = JSON.parse(content) as QueryAnalysis

    // Deduplicate tools from LLM response
    analysis.required_tools = [...new Set(analysis.required_tools)]

    // Fallback: Always require web_search for trivia topics
    if (analysis.topic === 'trivia' && !analysis.required_tools.includes('web_search')) {
      analysis.required_tools.push('web_search')
    }

    logger.debug({ analysisTimeMs: Date.now() - startTime }, 'Analysis completed')

    return analysis
  }

  async #generateResponse({
    query,
    lumen,
    conversationHistory,
    model,
    requiredTools,
  }: {
    query: string
    lumen: Lumen
    conversationHistory: Message[]
    model: string
    requiredTools: AvailableTool[]
  }): Promise<ChatResponse> {
    const startTime = Date.now()

    const messages: ChatMessage[] = [
      { role: 'system', content: GUARDRAILS_PROMPT },
      { role: 'system', content: buildPersonalityPrompt(lumen.name, lumen.personality) },
    ]

    const toolInstructions = buildToolInstructionPrompt(requiredTools)
    if (toolInstructions) {
      messages.push({ role: 'system', content: toolInstructions })
    }

    logger.info({ model, requiredTools }, 'Calling response model')

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

    const message = response.choices?.[0]?.message
    const rawContent = message?.content
    if (!rawContent) {
      const errorMsg = 'Failed to generate response'
      logger.error({ model, responseTimeMs: Date.now() - startTime }, errorMsg)
      throw new Error(errorMsg)
    }

    const annotations = (message as { annotations?: unknown[] }).annotations
    const webSearchUsed = annotations && annotations.length > 0

    logger.info(
      {
        model,
        webSearchUsed,
        annotationsCount: annotations?.length ?? 0,
        annotations: annotations ?? [],
        responseTimeMs: Date.now() - startTime,
      },
      'Response generated'
    )

    const content = typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent)
    const chatResponse = JSON.parse(content) as ChatResponse

    return chatResponse
  }
}
