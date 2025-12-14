import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#modules/users/models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { CuidPk } from '#mixins/cuid_pk'

export default class Message extends compose(BaseModel, CuidPk) {
  @column()
  declare author_id: string

  @belongsTo(() => User)
  declare author: BelongsTo<typeof User>

  @column({ prepare: (value: any) => JSON.stringify(value) })
  declare content: string

  @column()
  declare mentions: string

  @column()
  declare attachments: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
