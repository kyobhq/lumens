import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#modules/users/models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Lumen extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare creator_id: string

  @belongsTo(() => User)
  declare creator: BelongsTo<typeof User>

  @column()
  declare name: string

  @column()
  declare description: string

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
