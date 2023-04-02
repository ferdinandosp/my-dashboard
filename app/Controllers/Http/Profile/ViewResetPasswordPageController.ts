import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class ViewResetPasswordPageController {
  public async handle(ctx: HttpContextContract) {
    const { auth, response, view } = ctx

    const user: User = await auth.authenticate()

    if (!user) {
      return response.redirect('/login')
    }

    return view.render('reset')
  }
}