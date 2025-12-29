import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ArtifactsService from '../services/artifacts_service.js'

@inject()
export default class ArtifactsController {
  constructor(protected readonly lumensService: ArtifactsService) {}

  async createArtifact({ request, caller }: HttpContext) {}
}
