import { HttpContext } from '@adonisjs/core/http'
import { createUserValidator, loginUserValidator } from '../validators.js'
import UsersService from '../services/users_service.js'
import { UsersTransformer } from '../transformers/users_transfomer.js'

export default class UsersController {
  constructor(protected readonly usersService: UsersService) {}

  async getUser({ caller }: HttpContext) {
    const user = await this.usersService.getUser(caller.id)
    return UsersTransformer.toJson(user)
  }

  async createUser({ request, auth }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)
    const user = await this.usersService.createUser(payload)

    await auth.use('web').login(user, true)

    return UsersTransformer.toJson(user)
  }

  deleteUser({}: HttpContext) {}

  async login({ request }: HttpContext) {
    // const payload = await request.validateUsing(loginUserValidator)
  }

  async logout({ auth }: HttpContext) {
    await auth.use('web').logout()
  }
}
