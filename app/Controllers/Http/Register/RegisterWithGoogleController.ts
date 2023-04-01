import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import EmailVerificationSender from 'App/Services/EmailVerificationSender'

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
      // create user if not exist
      const isEmailVerified = googleUser.emailVerificationState === 'verified'

      const newUser = new User()
      newUser.email = googleUser.email!
      newUser.email_verified = isEmailVerified
      newUser.register_platform = 'google'

      // TODO: If email is not verified, send email to verify?

      await newUser.save()

      if (isEmailVerified) {
        // login user if email is verified
        await ctx.auth.use('web').login(newUser)

        // return to dashboard page
        return response.redirect('/dashboard')
      } else {
        // send email verification
        const emailSender: EmailVerificationSender = new EmailVerificationSender()
        await emailSender.sendEmail(newUser.id, newUser.email)

        // return a message stating that an email verification is sent
        return response.send({ message: 'Email verification sent' })
      }
    } else {
      if (user.register_platform === 'google') {
        // login
        await ctx.auth.use('web').login(user)
        return response.redirect('/dashboard')
      } else {
        // response an error message saying register platform is different
        return response.badRequest({ error: 'Email already registered on a different platform' })
      }
    }

    return response.redirect('/login')
  }
}