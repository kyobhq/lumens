import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'
import { lumenName } from './base.js'

export const createLumenValidator = vine.create({
  name: lumenName.clone(),
  personality: vine.string().maxLength(512),
  avatar: vine.file({ size: '5mb', extnames: ['png', 'jpg', 'jpeg', 'avif', 'webp'] }),
})

export type CreateLumen = Infer<typeof createLumenValidator>

export * from './base.js'
