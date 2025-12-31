import Lumen from '#modules/lumens/models/lumen'
import Message from '../models/messages.js'

export default class MessagesService {
  async getAll(userId: string) {
    const lumen = await Lumen.findByOrFail('creator_id', userId)
    const messages = await Message.query().whereIn('author_id', [userId, lumen.id])

    return messages
  }
}
