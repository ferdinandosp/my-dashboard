import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreNewUserSession from 'App/Services/StoreNewUserSession'
import User from 'App/Models/User'

export default class LoginWithFacebookController {
  public async handle(ctx: HttpContextContract) {
    const { ally, auth, response, view } = ctx

    const facebook = ally.use('facebook')
    const facebookUser = await facebook.user()

    if (facebook.accessDenied()) {
      return response.badRequest({ error: 'Access was denied' })
    }

    if (facebook.stateMisMatch()) {
      return response.badRequest({ error: 'Request expired. Try again.' })
    }

    if (facebook.hasError()) {
      return response.badRequest(facebook.getError())
    }

    const user = await User.findBy('email', facebookUser.email)

    if (user !== null) {
      await auth.use('web').login(user)
      await StoreNewUserSession.handle(user.id)
      return response.redirect('/dashboard')
    }

    response.send(
      await view.render('login',
        {
          email: facebookUser.email,
          error: 'Login failed'
        }
      )
    )
  }
}