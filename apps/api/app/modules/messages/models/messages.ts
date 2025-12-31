import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { CuidPk } from '#mixins/cuid_pk'

export default class Message extends compose(BaseModel, CuidPk) {
  @column()
  declare author_id: string

  @column()
  declare content: string

  @column()
  declare rawContent: any

  @column()
  declare mentions: string

  @column()
  declare attachments: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
