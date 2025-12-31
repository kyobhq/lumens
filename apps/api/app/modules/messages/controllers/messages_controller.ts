import { HttpContext } from '@adonisjs/core/http'
import MessagesService from '../services/messages_service.js'
import { inject } from '@adonisjs/core'
import { MessagesTransformer } from '../transformers/messages_transformer.js'

@inject()
export default class MessagesController {
  constructor(protected readonly messagesService: MessagesService) {}

  async getMessages({ caller }: HttpContext) {
    const messages = await this.messagesService.getAll(caller.id)

    return messages.map(MessagesTransformer.toJson)
  }
}
