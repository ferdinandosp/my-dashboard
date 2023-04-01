import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import EmailVerificationSender from 'App/Services/EmailVerificationSender'

export default class SendVerificationEmailController {
  /**
  * @swagger
  * /send-verify-email:
  *   get:
  *     tags:
  *       - Users
  *     summary: Send email verification to the logged-in user
  *     responses:
  *       200:
  *         description: Success
  */
  public async handle(ctx: HttpContextContract) {
    const { auth, view, response } = ctx

    const user : User = await auth.authenticate()

    if (user.email_verified) {
      return view.render('dashboard', { message: 'Email already verified' })
    }

    if (user !== null) {
      const emailSender: EmailVerificationSender = new EmailVerificationSender()
      await emailSender.sendEmail(user.id, user.email)
    }

    return response.send(
      await view.render(
        'verify',
        { message: 'Verification email sent' }
        ))
  }
}