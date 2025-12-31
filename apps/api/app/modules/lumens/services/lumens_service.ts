import Message from '#modules/messages/models/messages'
import User from '#modules/users/models/user'
import { cuid } from '@adonisjs/core/helpers'
import Lumen from '../models/lumen.js'
import type { ChatLumen, CreateLumen } from '../validators/server.js'
import logger from '@adonisjs/core/services/logger'
import AnalyzeQueryAction from '../actions/analyze_query.js'
import GenerateResponseAction from '../actions/generate_response.js'

export default class LumensService {
  static CONVERSATION_HISTORY_LIMIT = 10

  async createLumen({ avatar, ...lumenPayload }: CreateLumen, user: User) {
    let avatarUrl: string | undefined

    if (avatar) {
      const avatarKey = `${cuid()}.${avatar.extname}`
      await avatar.moveToDisk(avatarKey)
      avatarUrl = avatar.meta.url
    }

    const lumen = await Lumen.create({
      creator_id: user.id,
      ...lumenPayload,
      avatar: avatarUrl,
    })
    await user.merge({ lumen_created: true }).saveQuietly()

    return lumen
  }

  async chat({ content, rawContent }: ChatLumen, user: User): Promise<Message[]> {
    const lumen = await Lumen.findByOrFail('creator_id', user.id)

    const userMessage = await Message.create({
      author_id: user.id,
      content,
      rawContent,
      mentions: '[]',
      attachments: '[]',
    })

    logger.info({ userMessage: userMessage }, 'User message created')

    const conversationHistory = await Message.query()
      .whereIn('author_id', [user.id, lumen.id])
      .orderBy('created_at', 'desc')
      .limit(LumensService.CONVERSATION_HISTORY_LIMIT)
      .exec()
    conversationHistory.reverse()

    logger.info({ history: conversationHistory }, 'Message history fetched')

    const analyzeAction = new AnalyzeQueryAction()
    const generateResponseAction = new GenerateResponseAction()

    const analysis = await analyzeAction.execute(content, conversationHistory, lumen.id)
    const response = await generateResponseAction.execute({
      query: content,
      lumen,
      conversationHistory,
      difficulty: analysis.difficulty,
      requiredTools: analysis.required_tools,
      verbosity: analysis.verbosity,
      model: analysis.model,
    })

    const lumenMessage = await Message.create({
      author_id: lumen.id,
      content: response.content,
      rawContent: response,
      mentions: '[]',
      attachments: '[]',
    })

    return [userMessage, lumenMessage]
  }
}
