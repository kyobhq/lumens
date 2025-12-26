import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import Lumen from '#modules/lumens/models/lumen'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import { compose } from '@adonisjs/core/helpers'
import { CuidPk } from '#mixins/cuid_pk'

export default class User extends compose(BaseModel, CuidPk) {
  @column()
  declare username: string

  @column()
  declare email: string

  @column()
  declare avatar: string

  @column()
  declare lumen_created: boolean

  @hasOne(() => Lumen)
  declare lumen: HasOne<typeof Lumen>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)
}
