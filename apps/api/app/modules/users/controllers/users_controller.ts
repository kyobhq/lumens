import { HttpContext } from '@adonisjs/core/http'
import { createUserValidator, verifyEmailValidator, loginUserValidator } from '../validators.js'
import UsersService from '../services/users_service.js'
import { UsersTransformer } from '../transformers/users_transfomer.js'
import { inject } from '@adonisjs/core'

@inject()
export default class UsersController {
  constructor(protected readonly usersService: UsersService) {}

  async getUser({ caller }: HttpContext) {
    const user = await this.usersService.getUser({ id: caller.id })
    return UsersTransformer.toJson(user)
  }

  async createUser({ request, auth }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)
    const user = await this.usersService.createUser(payload)

    await auth.use('web').login(user, true)

    return UsersTransformer.toJson(user)
  }

  deleteUser({}: HttpContext) {}

  async check({ auth }: HttpContext) {
    const user = await auth.use('web').authenticate()
    return UsersTransformer.toJson(user)
  }

  async login({ request, auth }: HttpContext) {
    const payload = await request.validateUsing(loginUserValidator)
    const user = await this.usersService.signinUser(payload)

    await auth.use('web').login(user, true)

    return UsersTransformer.toJson(user)
  }

  async logout({ auth }: HttpContext) {
    await auth.use('web').logout()
  }

  async sendVerificationCode({ request, response }: HttpContext) {
    const payload = await request.validateUsing(verifyEmailValidator)
    await this.usersService.sendVerifyEmail(payload)

    return response.noContent()
  }
}
