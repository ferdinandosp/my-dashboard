import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class RegisterWithGoogleController {
  public async handle(ctx: HttpContextContract) {
    const { ally, response } = ctx

    const google = ally.use('google')

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
    console.log('user', googleUser)

    console.log('email', googleUser.email)
    console.log('is email verified', googleUser.original.email_verified)

    const user = await User.findBy('email', googleUser.email)

    if (user === null) {
      const isEmailVerified = googleUser.emailVerificationState === 'verified'

      const newUser = new User()
      newUser.email = googleUser.email!
      newUser.email_verified = isEmailVerified

      // TODO: If email is not verified, send email to verify?

      await newUser.save()
    }

    return response.redirect('/login')
  }
}