import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'
import { note } from './base.js'

export const createArtifactValidator = vine.create({
  note: note.clone(),
  file: vine.file({ size: '100mb' }),
})

export type CreateArtifact = Infer<typeof createArtifactValidator>

export * from './base.js'
