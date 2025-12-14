import { cuid } from '@adonisjs/core/helpers'
import { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'

export const CuidPk = <Model extends NormalizeConstructor<typeof BaseModel>>(superclass: Model) => {
  class CuidPkClass extends superclass {
    static assignPrimaryKey = true
    @column({ isPrimary: true }) declare id: string

    @beforeCreate()
    static async assignCuid(model: any) {
      if (!model.id) model.id = cuid()
    }
  }

  return CuidPkClass
}
