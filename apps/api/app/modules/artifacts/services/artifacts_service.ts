import db from '@adonisjs/lucid/services/db'
import drive from '@adonisjs/drive/services/main'
import User from '#modules/users/models/user'
import { cuid } from '@adonisjs/core/helpers'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import Artifact from '../models/artifact.js'
import { CreateArtifact } from '../validators/server.js'
import { optimizeImage } from '../actions/optimize_image.js'
import { getArtifactType, isOptimizableImage } from '../actions/get_artifact_type.js'
import SingleArtifactTypeException from '../exceptions/single_artifact_type_exception.js'

interface ProcessedFile {
  url: string
  type: Artifact['type']
  fileName: string
  fileKeys: string[]
}

export interface FailedFile {
  fileName: string
  reason: string
}

export interface CreateArtifactResult {
  artifacts: Artifact[]
  failures: FailedFile[]
}

export default class ArtifactsService {
  async createArtifact(
    { note, files, ...artifactPayload }: CreateArtifact,
    user: User
  ): Promise<CreateArtifactResult> {
    if (note && files) {
      throw new SingleArtifactTypeException()
    }

    if (files && files.length > 0) {
      return this.#processFileArtifacts(files, artifactPayload, user)
    }

    const artifact = await Artifact.create({
      user_id: user.id,
      ...artifactPayload,
      type: 'note',
      url: null,
    })

    return { artifacts: [artifact], failures: [] }
  }

  async #processFileArtifacts(
    files: MultipartFile[],
    artifactPayload: Omit<CreateArtifact, 'note' | 'files'>,
    user: User
  ): Promise<CreateArtifactResult> {
    const results = await Promise.allSettled(files.map((file) => this.#processFile(file)))

    const processed: ProcessedFile[] = []
    const failures: FailedFile[] = []

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        processed.push(result.value)
      } else {
        failures.push({
          fileName: files[index].clientName,
          reason: result.reason instanceof Error ? result.reason.message : 'Unknown error',
        })
      }
    })

    if (processed.length === 0) {
      return { artifacts: [], failures }
    }

    const allFileKeys = processed.flatMap((p) => p.fileKeys)

    try {
      const artifacts = await db.transaction(async (trx) => {
        const artifactsData = processed.map((file) => ({
          user_id: user.id,
          ...artifactPayload,
          type: file.type,
          url: file.url,
        }))

        const created = await Artifact.createMany(artifactsData, { client: trx })
        return created
      })

      return { artifacts, failures }
    } catch (error) {
      await this.#cleanupFiles(allFileKeys)
      throw error
    }
  }

  async #processFile(file: MultipartFile): Promise<ProcessedFile> {
    const baseKey = cuid()
    const extname = file.extname ?? ''
    const type = getArtifactType(extname)
    const fileKeys: string[] = []

    let url: string

    if (isOptimizableImage(extname)) {
      const originalKey = `${baseKey}_og.${extname}`
      const optimizedKey = `${baseKey}.avif`
      fileKeys.push(originalKey, optimizedKey)

      url = await optimizeImage(file, baseKey)
    } else {
      const fileKey = `${baseKey}.${extname}`
      fileKeys.push(fileKey)

      await file.moveToDisk(fileKey)
      url = file.meta.url
    }

    return {
      url,
      type,
      fileName: file.clientName,
      fileKeys,
    }
  }

  async #cleanupFiles(fileKeys: string[]): Promise<void> {
    await Promise.allSettled(fileKeys.map((key) => drive.use().delete(key)))
  }

  async getArtifacts(user: User) {
    return Artifact.query().where('user_id', user.id).orderBy('created_at', 'desc')
  }
}
