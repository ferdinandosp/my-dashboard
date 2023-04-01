import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreNewUserSession from 'App/Services/StoreNewUserSession'
import User from 'App/Models/User'

export default class LoginWithGoogleController {
  public async handle(ctx: HttpContextContract) {
    const { ally, auth, response, view } = ctx

    const google = ally.use('google')
    const googleUser = await google.user()

    if (google.accessDenied()) {
      return response.badRequest({ error: 'Access was denied' })
    }

    if (google.stateMisMatch()) {
      return response.badRequest({ error: 'Request expired. Try again.' })
    }

    if (google.hasError()) {
      return response.badRequest(google.getError())
    }

    const user = await User.findBy('email', googleUser.email)

    if (user !== null) {
      await auth.use('web').login(user)
      await StoreNewUserSession.handle(user.id)
      return response.redirect('/dashboard')
    }

    response.send(
      await view.render('login',
        {
          email: googleUser.email,
          error: 'Login failed'
        }
      )
    )
  }
}