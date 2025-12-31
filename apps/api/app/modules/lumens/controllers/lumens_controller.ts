import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import Lumen from '../models/lumen.js'
import LumensService from '../services/lumens_service.js'
import { LumensTransformer } from '../transformers/lumens_transfomer.js'
import { chatLumenValidator } from '../validators/base.js'
import { createLumenValidator } from '../validators/server.js'
import { MessagesTransformer } from '#modules/messages/transformers/messages_transformer'

@inject()
export default class LumensController {
  constructor(protected readonly lumensService: LumensService) {}

  async getLumen({ caller }: HttpContext) {
    return await Lumen.findByOrFail('creator_id', caller.id)
  }

  async createLumen({ request, caller }: HttpContext) {
    const payload = await request.validateUsing(createLumenValidator)
    const lumen = await this.lumensService.createLumen(payload, caller)

    return LumensTransformer.toJson(lumen)
  }

  async chat({ request, caller }: HttpContext) {
    const payload = await request.validateUsing(chatLumenValidator)
    const messages = await this.lumensService.chat(payload, caller)

    return messages.map(MessagesTransformer.toJson)
  }
}
