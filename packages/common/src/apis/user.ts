import { Infer } from '@vinejs/vine/types'
import vine from '@vinejs/vine'

export const username = vine
  .string()
  .alphaNumeric({ allowDashes: true, allowUnderscores: true, allowSpaces: false })
  .trim()
  .minLength(2)
  .maxLength(32)

export const email = vine.string().trim().email().normalizeEmail({ gmail_remove_dots: false })

export const createUserValidator = vine.create({
  username: username.clone(),
  email: email.clone(),
})

export type CreateUser = Infer<typeof createUserValidator>
