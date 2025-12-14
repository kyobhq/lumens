import mail from '@adonisjs/mail/services/main'
import User from '../models/user.js'
import { CreateUser, VerifyEmail } from '../validators.js'
import { HttpContext } from '@adonisjs/core/http'
import InvalidVerificationCodeException from '../exceptions/invalid_verification_code_exception.js'
import { inject } from '@adonisjs/core'

@inject()
export default class UsersService {
  static readonly emailVerificationSessionKey = 'email.verification'
  static readonly EMAIL_CODE_EXPIRY_MS = 10 * 60 * 1000 // 10 minutes

  constructor(protected ctx: HttpContext) {}

  async getUser(userId: string) {
    const user = await User.findByOrFail('id', userId)
    return user
  }

  async createUser({ code, ...userPayload }: CreateUser) {
    const storedData = this.ctx.session.get(UsersService.emailVerificationSessionKey) as
      | { email: string; code: string; expiresAt: number }
      | undefined

    if (!storedData) {
      throw new InvalidVerificationCodeException()
    }

    if (Date.now() > storedData.expiresAt) {
      this.ctx.session.forget(UsersService.emailVerificationSessionKey)
      throw new InvalidVerificationCodeException()
    }

    if (storedData.email !== userPayload.email || storedData.code !== code) {
      throw new InvalidVerificationCodeException()
    }

    this.ctx.session.forget(UsersService.emailVerificationSessionKey)

    const user = await User.create(userPayload)
    return user
  }

  async sendVerifyEmail({ email }: VerifyEmail) {
    const code = this.#generateCode()

    this.ctx.session.put(UsersService.emailVerificationSessionKey, {
      email,
      code,
      expiresAt: Date.now() + UsersService.EMAIL_CODE_EXPIRY_MS,
    })

    void mail.sendLater((message) => {
      message
        .to(email)
        .subject(`${code}: Verify your email address`)
        .text(`To verify your email please use this code: ${code}`)
    })
  }

  #generateCode() {
    return Math.random().toString(36).slice(2, 8).toUpperCase()
  }
}
