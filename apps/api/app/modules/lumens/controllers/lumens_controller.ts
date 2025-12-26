import { HttpContext } from '@adonisjs/core/http'
import { createLumenValidator } from '../validators/server.js'
import { inject } from '@adonisjs/core'
import { LumensTransformer } from '../transformers/lumens_transfomer.js'
import LumensService from '../services/lumens_service.js'
import Lumen from '../models/lumen.js'

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
}
