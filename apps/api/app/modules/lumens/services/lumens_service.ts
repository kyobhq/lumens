import User from '#modules/users/models/user'
import { cuid } from '@adonisjs/core/helpers'
import Lumen from '../models/lumen.js'
import { CreateLumen } from '../validators/server.js'

export default class LumensService {
  async createLumen({ avatar, ...lumenPayload }: CreateLumen, user: User) {
    let avatarUrl: string | undefined

    if (avatar) {
      const avatarKey = `${cuid()}.${avatar.extname}`
      await avatar.moveToDisk(avatarKey)
      avatarUrl = avatar.meta.url
    }

    const lumen = await Lumen.create({
      creator_id: user.id,
      ...lumenPayload,
      avatar: avatarUrl,
    })
    await user.merge({ lumen_created: true }).saveQuietly()

    return lumen
  }
}
