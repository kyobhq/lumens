import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'
import { lumenName } from './base.js'

const createLumenMessages = new SimpleMessagesProvider({
  'name.required': 'Your Lumen needs a name',
  'name.alphaNumeric': 'Name can only contain letters, numbers, dashes, underscores, and spaces',
  'name.minLength': 'Name must be at least 2 characters',
  'name.maxLength': 'Name cannot exceed 32 characters',
  'personality.required': 'Give your Lumen a personality',
  'personality.maxLength': 'Personality description cannot exceed 512 characters',
  'avatar.required': 'Your Lumen needs an avatar',
  'avatar.file.size': 'Avatar must be smaller than 5MB',
  'avatar.file.extname': 'Avatar must be an image (PNG, JPG, JPEG, AVIF, or WebP)',
})

export const createLumenValidator = vine.create({
  name: lumenName.clone(),
  personality: vine.string().maxLength(512),
  avatar: vine.file({ size: '5mb', extnames: ['png', 'jpg', 'jpeg', 'avif', 'webp'] }),
})
createLumenValidator.messagesProvider = createLumenMessages

export type CreateLumen = Infer<typeof createLumenValidator>

export * from './base.js'
