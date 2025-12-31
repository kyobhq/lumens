import env from '#start/env'
import Artifact from '../models/artifact.js'

export class ArtifactsTransformer {
  static toJson(artifact: Artifact) {
    return {
      id: artifact.id,
      type: artifact.type,
      note: artifact.rawNote,
      colors: artifact.colors,
      tags: artifact.tags,
      url: `${env.get('HOST_URL')}${artifact.url}`,
    }
  }
}

export type ArtifactTransformer = ReturnType<typeof ArtifactsTransformer.toJson>
