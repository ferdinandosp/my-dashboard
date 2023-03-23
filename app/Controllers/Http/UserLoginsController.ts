import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'


export default class UserLoginsController {
  public async handle(ctx: HttpContextContract) {
    const { request } = ctx
    const requestBody: Record<string, any> = request.body()
    const email: string = requestBody.email
    const password: string = requestBody.password
    const user: User | null = await User.findBy('email', email)

    if (user) {
      const isPasswordCorrect: boolean = await user?.verifyPassword(password)

      if (isPasswordCorrect) {
        // TODO: generate login token?
        // TODO: store to access history table?
        return 'logged in successfully'
      }
    } else {
      return 'user not found'
    }

    return 'log in failed'
  }
}
