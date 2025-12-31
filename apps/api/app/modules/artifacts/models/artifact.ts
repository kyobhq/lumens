import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#modules/users/models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { CuidPk } from '#mixins/cuid_pk'

export default class Artifact extends compose(BaseModel, CuidPk) {
  @column()
  declare user_id: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare type: 'article' | 'image' | 'pdf' | 'video' | 'note' | 'quote' | 'unknown'

  @column()
  declare note: string | null

  @column()
  declare rawNote: any | null

  @column()
  declare colors: string | null

  @column()
  declare tags: string | null

  @column()
  declare url: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
