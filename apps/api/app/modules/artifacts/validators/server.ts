import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'
import { note, rawNote } from './base.js'

export const createArtifactValidator = vine.create({
  note: note.clone(),
  rawNote: rawNote.clone(),
  files: vine.array(vine.file({ size: '100mb' })).optional(),
})

export type CreateArtifact = Infer<typeof createArtifactValidator>

export * from './base.js'
