import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreNewUserSession from 'App/Services/StoreNewUserSession'
import User from 'App/Models/User'

export default class RegisterWithFacebookController {
  public async handle(ctx: HttpContextContract) {
    const { ally, response } = ctx

    const facebook = ally.use('facebook')

    // validate facebook response
    if (facebook.accessDenied()) {
      return response.badRequest({ error: 'Access was denied' })
    }

    if (facebook.stateMisMatch()) {
      return response.badRequest({ error: 'Request expired. Try again.' })
    }

    if (facebook.hasError()) {
      return response.badRequest(facebook.getError())
    }

    const facebookUser = await facebook.user()
    const user = await User.findBy('email', facebookUser.email)

    // check existing user
    if (user === null) {
      // create user if not exist      
      const newUser = new User()
      newUser.email = facebookUser.email!
      newUser.email_verified = true
      newUser.register_platform = 'facebook'
      newUser.name = facebookUser.name

      await newUser.save()

      // login user if email is verified
      await ctx.auth.use('web').login(newUser)

      await StoreNewUserSession.handle(newUser.id)

      // return to dashboard page
      return response.redirect('/dashboard')      
    } else {
      if (user.register_platform === 'facebook') {
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