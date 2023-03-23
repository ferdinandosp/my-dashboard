import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { DateTime } from 'luxon';

export default class RegisterUserController {
  public async handle(ctx: HttpContextContract) {
    const { request } = ctx
    const requestBody: Record<string, any> = request.body()
    const email: string = requestBody.email
    const password: string = requestBody.password

    const user = new User()
    user.email = email
    user.password = password
    user.created_at = DateTime.now()
    user.updated_at = DateTime.now()
    await user.save()

    return 'register successful'
  }
}
