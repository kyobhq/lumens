import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { createArtifactValidator } from '../validators/server.js'
import { ArtifactsTransformer } from '../transformers/artifacts_transfomer.js'
import ArtifactsService from '../services/artifacts_service.js'

@inject()
export default class ArtifactsController {
  constructor(protected readonly artifactsService: ArtifactsService) {}

  async getArtifacts({ caller }: HttpContext) {
    const artifacts = await this.artifactsService.getArtifacts(caller)

    return artifacts.map(ArtifactsTransformer.toJson)
  }

  async createArtifact({ request, caller }: HttpContext) {
    const payload = await request.validateUsing(createArtifactValidator)
    const { artifacts, failures } = await this.artifactsService.createArtifact(payload, caller)

    return {
      artifacts: artifacts.map(ArtifactsTransformer.toJson),
      failures,
    }
  }
}
