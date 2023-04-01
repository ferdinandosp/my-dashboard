import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public email_verified: boolean

  @column()
  public register_platform: string

  @column()
  public created_at: DateTime

  @column()
  public updated_at: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }

    user.updated_at = DateTime.now()
  }

  @beforeCreate()
  public static async setCreatedDate(user: User) {
    user.created_at = DateTime.now()
  }

  public async verifyPassword(inputPassword: string) {
    return await Hash.verify(this.password, inputPassword)
  }

  public markEmailVerified() {
    this.email_verified = true
  }
}
