import User from '../models/user.js'

export class UsersTransformer {
  static toJson(user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    }
  }
}
