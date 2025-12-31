import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const lumenName = vine
  .string()
  .trim()
  .alphaNumeric({ allowDashes: true, allowUnderscores: true, allowSpaces: true })
  .minLength(2)
  .maxLength(32)

const createLumenMessages = new SimpleMessagesProvider({
  'name.required': 'Your Lumen needs a name',
  'name.alphaNumeric': 'Name can only contain letters, numbers, dashes, underscores, and spaces',
  'name.minLength': 'Name must be at least 2 characters',
  'name.maxLength': 'Name cannot exceed 32 characters',
  'personality.required': 'Give your Lumen a personality',
  'personality.maxLength': 'Personality description cannot exceed 512 characters',
})

export const createLumenValidator = vine.create({
  name: lumenName.clone(),
  personality: vine.string().maxLength(512),
})
createLumenValidator.messagesProvider = createLumenMessages

export type CreateLumen = Infer<typeof createLumenValidator>

const chatLumenMessages = new SimpleMessagesProvider({
  'message.required': 'Message is required',
  'message.maxLength': 'Message cannot exceed 4000 characters',
})

export const chatLumenValidator = vine.create({
  content: vine.string().trim().maxLength(4000),
  rawContent: vine.any(),
})
chatLumenValidator.messagesProvider = chatLumenMessages

export type ChatLumen = Infer<typeof chatLumenValidator>
