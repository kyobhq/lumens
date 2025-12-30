import User from '#modules/users/models/user'
import { cuid } from '@adonisjs/core/helpers'
import Artifact from '../models/artifact.js'
import { CreateArtifact } from '../validators/server.js'

export default class ArtifactsService {
  async createArtifact({ note, file, ...artifactPayload }: CreateArtifact, user: User) {
    if (note && file) {
      throw new Error('Artifact can only be a note OR a file')
    }

    let type: Artifact['type'] = 'unknown'
    let url: string | undefined

    if (file) {
      const fileKey = `${cuid()}.${file.extname}`
      await file.moveToDisk(fileKey)
      url = file.meta.url
      type = this.getArtifactType(file.extname ?? '')
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

  private getArtifactType(extname: string): Artifact['type'] {
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
    const videoExts = ['mp4', 'webm', 'mov', 'avi']
    const pdfExts = ['pdf']

    const ext = extname.toLowerCase().replace('.', '')

    if (imageExts.includes(ext)) return 'image'
    if (videoExts.includes(ext)) return 'video'
    if (pdfExts.includes(ext)) return 'pdf'

    return 'unknown'
  }
}
