import User from '../models/user.js'
import { CreateUser } from '../validators.js'

export default class UsersService {
  async getUser(userId: string) {
    const user = await User.findByOrFail('id', userId)
    return user
  }

  async createUser(payload: CreateUser) {
    const user = await User.create(payload)
    return user
  }
}
