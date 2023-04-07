import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreNewUserSession from 'App/Services/StoreNewUserSession'
import User from 'App/Models/User'

export default class RegisterWithGoogleController {
  public async handle(ctx: HttpContextContract) {
    const { ally, response } = ctx

    const google = ally.use('google')

    // validate google response
    if (google.accessDenied()) {
      return response.badRequest({ error: 'Access was denied' })
    }

    if (google.stateMisMatch()) {
      return response.badRequest({ error: 'Request expired. Try again.' })
    }

    if (google.hasError()) {
      return response.badRequest(google.getError())
    }

    const googleUser = await google.user()
    const user = await User.findBy('email', googleUser.email)

    // check existing user
    if (user === null) {
      // create user if not exists
      const newUser = new User()
      newUser.email = googleUser.email!
      newUser.email_verified = true
      newUser.register_platform = 'google'
      newUser.name = googleUser.name

      await newUser.save()

      // login user if email is verified
      await ctx.auth.use('web').login(newUser)

      await StoreNewUserSession.handle(newUser.id)

      // return to dashboard page
      return response.redirect('/dashboard')
    } else {
      if (user.register_platform === 'google') {
        // login
        await ctx.auth.use('web').login(user)

        await StoreNewUserSession.handle(user.id)

        return response.redirect('/dashboard')
      } else {
        // response an error message saying register platform is different
        return response.badRequest({ error: 'Email already registered on a different platform' })
      }
    }
  }
}