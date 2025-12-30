import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const title = vine.string().trim().optional()
export const note = vine.string().trim().optional()
export const rawNote = vine.any().optional()
export const tags = vine.string().trim().optional()

export const createArtifactValidator = vine.create({
  note: note.clone(),
  rawNote: rawNote.clone(),
})

export type CreateArtifact = Infer<typeof createArtifactValidator>

export const updateArtifactValidator = vine.create({
  title: title.clone(),
  note: note.clone(),
  raw_note: rawNote.clone(),
  tags: tags.clone(),
})

export type UpdateArtifact = Infer<typeof updateArtifactValidator>

export type ArtifactType =
  | 'default'
  | 'article'
  | 'image'
  | 'pdf'
  | 'video'
  | 'note'
  | 'quote'
  | 'unknown'
