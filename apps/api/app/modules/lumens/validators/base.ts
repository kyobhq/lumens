import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const lumenName = vine
  .string()
  .trim()
  .alphaNumeric({ allowDashes: true, allowUnderscores: true, allowSpaces: false })
  .minLength(2)
  .maxLength(32)

export const createLumenValidator = vine.create({
  name: lumenName.clone(),
  personality: vine.string().maxLength(512),
})

export type CreateLumen = Infer<typeof createLumenValidator>
