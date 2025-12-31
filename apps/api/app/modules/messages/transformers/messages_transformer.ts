import Message from '../models/messages.js'

export class MessagesTransformer {
  static toJson(message: Message) {
    return {
      id: message.id,
      author_id: message.author_id,
      content: message.rawContent,
      attachments: message.attachments,
      timestamp: message.createdAt.toISO(),
    }
  }
}

export type MessageTransformer = ReturnType<typeof MessagesTransformer.toJson>
