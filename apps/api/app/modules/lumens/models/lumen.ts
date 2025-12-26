import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#modules/users/models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { CuidPk } from '#mixins/cuid_pk'

export default class Lumen extends compose(BaseModel, CuidPk) {
  static table = 'lumens'

  @column()
  declare creator_id: string

  @belongsTo(() => User)
  declare creator: BelongsTo<typeof User>

  @column()
  declare name: string

  @column()
  declare personality: string

  @column()
  declare memory: string | null

  @column()
  declare avatar: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
