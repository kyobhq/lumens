import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const username = vine
  .string()
  .trim()
  .alphaNumeric({ allowDashes: true, allowUnderscores: true, allowSpaces: false })
  .minLength(2)
  .maxLength(32)

export const email = vine.string().trim().email().normalizeEmail({ gmail_remove_dots: false })

export const authCode = vine
  .string()
  .alphaNumeric({ allowDashes: false, allowUnderscores: false, allowSpaces: false })
  .fixedLength(6)
  .toUpperCase()

export const createUserValidator = vine.create({
  username: username.clone(),
  email: email.clone(),
  code: authCode.clone(),
})

export type CreateUser = Infer<typeof createUserValidator>

export const loginUserValidator = vine.create({
  email: email.clone(),
  code: authCode.clone(),
})

export type LoginUser = Infer<typeof loginUserValidator>

export const verifyEmailValidator = vine.create({
  email: email.clone(),
})

export type VerifyEmail = Infer<typeof verifyEmailValidator>
