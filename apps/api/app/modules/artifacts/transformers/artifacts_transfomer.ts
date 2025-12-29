import Artifact from '../models/artifact.js'

export class ArtifactsTransformer {
  static toJson(artifact: Artifact) {
    return {
      id: artifact.id,
      type: artifact.type,
      title: artifact.title,
      note: artifact.note,
      colors: artifact.colors,
      tags: artifact.tags,
      url: artifact.url,
    }
  }
}

export type ArtifactTransformer = ReturnType<typeof ArtifactsTransformer.toJson>
