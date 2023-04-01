import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DeactivateUserSession from 'App/Services/DeactivateUserSession'
import User from 'App/Models/User'

export default class LogoutController {
  public async handle(ctx: HttpContextContract) {
    const { auth, response } = ctx

    const user : User = await auth.authenticate()

    if (user !== null) {
      await DeactivateUserSession.handle(user.id)
    }

    await auth.use('web').logout()

    return response.redirect('/login')
  }
}