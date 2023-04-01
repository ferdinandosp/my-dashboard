import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LogoutController {
  public async handle(ctx: HttpContextContract) {
    const { auth, response } = ctx

    await auth.use('web').logout()

    // TODO: Remove this user from user active session.

    return response.redirect('/login')
  }
}