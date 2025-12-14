import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Lumen from '#modules/lumens/models/lumens'
import type { HasMany } from '@adonisjs/lucid/types/relations'
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

  @hasMany(() => Lumen)
  declare lumens: HasMany<typeof Lumen>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)
}
