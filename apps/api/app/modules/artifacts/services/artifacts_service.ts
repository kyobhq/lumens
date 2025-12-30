import User from '#modules/users/models/user'
import { cuid } from '@adonisjs/core/helpers'
import Artifact from '../models/artifact.js'
import { CreateArtifact } from '../validators/server.js'
import { optimizeImage } from '../actions/optimize_image.js'
import { getArtifactType, isOptimizableImage } from '../actions/get_artifact_type.js'

export default class ArtifactsService {
  async createArtifact({ note, file, ...artifactPayload }: CreateArtifact, user: User) {
    if (note && file) {
      throw new Error('Artifact can only be a note OR a file')
    }

    let type: Artifact['type'] = 'unknown'
    let url: string | undefined

    if (file) {
      const baseKey = cuid()
      const extname = file.extname ?? ''
      type = getArtifactType(extname)

      if (isOptimizableImage(extname)) {
        url = await optimizeImage(file, baseKey)
      } else {
        const fileKey = `${baseKey}.${extname}`
        await file.moveToDisk(fileKey)
        url = file.meta.url
      }
    } else if (note) {
      type = 'note'
    }

    const artifact = await Artifact.create({
      user_id: user.id,
      ...artifactPayload,
      type,
      url: url ?? null,
    })

    return artifact
  }

  async getArtifacts(user: User) {
    return Artifact.query().where('user_id', user.id).orderBy('created_at', 'desc')
  }
}
