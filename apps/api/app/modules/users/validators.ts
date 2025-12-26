import vine, { SimpleMessagesProvider } from '@vinejs/vine'
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

const createUserMessages = new SimpleMessagesProvider({
  'username.required': 'Username is required',
  'username.alphaNumeric': 'Username can only contain letters, numbers, dashes, and underscores',
  'username.minLength': 'Username must be at least 2 characters',
  'username.maxLength': 'Username cannot exceed 32 characters',
  'email.required': 'Email is required',
  'email.email': 'Please enter a valid email address',
  'code.required': 'Verification code is required',
  'code.alphaNumeric': 'Verification code can only contain letters and numbers',
  'code.fixedLength': 'Verification code must be exactly 6 characters',
})

export const createUserValidator = vine.create({
  username: username.clone(),
  email: email.clone(),
  code: authCode.clone(),
})
createUserValidator.messagesProvider = createUserMessages

export type CreateUser = Infer<typeof createUserValidator>

const loginUserMessages = new SimpleMessagesProvider({
  'email.required': 'Email is required',
  'email.email': 'Please enter a valid email address',
  'code.required': 'Verification code is required',
  'code.alphaNumeric': 'Verification code can only contain letters and numbers',
  'code.fixedLength': 'Verification code must be exactly 6 characters',
})

export const loginUserValidator = vine.create({
  email: email.clone(),
  code: authCode.clone(),
})
loginUserValidator.messagesProvider = loginUserMessages

export type LoginUser = Infer<typeof loginUserValidator>

const verifyEmailMessages = new SimpleMessagesProvider({
  'email.required': 'Email is required',
  'email.email': 'Please enter a valid email address',
})

export const verifyEmailValidator = vine.create({
  email: email.clone(),
})
verifyEmailValidator.messagesProvider = verifyEmailMessages

export type VerifyEmail = Infer<typeof verifyEmailValidator>
