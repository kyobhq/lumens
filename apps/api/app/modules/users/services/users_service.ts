import mail from '@adonisjs/mail/services/main'
import User from '../models/user.js'
import { CreateUser, LoginUser, VerifyEmail } from '../validators.js'
import { HttpContext } from '@adonisjs/core/http'
import InvalidVerificationCodeException from '../exceptions/invalid_verification_code_exception.js'
import { inject } from '@adonisjs/core'
import UserNotFoundException from '../exceptions/user_not_found_exception.js'

@inject()
export default class UsersService {
  static readonly emailVerificationSessionKey = 'email.verification'
  static readonly EMAIL_CODE_EXPIRY_MS = 10 * 60 * 1000 // 10 minutes

  constructor(protected ctx: HttpContext) {}

  async getUser({ id, username, email }: { id?: string; email?: string; username?: string }) {
    let user: User | null = null

    if (id) user = await User.findBy('id', id)
    if (email) user = await User.findBy('email', email)
    if (username) user = await User.findBy('username', username)

    if (!user) throw new UserNotFoundException()

    return user
  }

  async createUser({ code, ...userPayload }: CreateUser) {
    await this.#verifyCode(userPayload.email, code)

    const user = await User.create({
      ...userPayload,
      avatar: `https://api.dicebear.com/9.x/glass/svg?seed=${userPayload.username}`,
    })
    return user
  }

  async signinUser(payload: LoginUser) {
    const user = await this.getUser({ email: payload.email })

    await this.#verifyCode(user.email, payload.code)

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

  async #verifyCode(email: string, code: string) {
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

    if (storedData.email !== email || storedData.code !== code) {
      throw new InvalidVerificationCodeException()
    }

    this.ctx.session.forget(UsersService.emailVerificationSessionKey)
  }

  #generateCode() {
    return Math.random().toString(36).slice(2, 8).toUpperCase()
  }
}
