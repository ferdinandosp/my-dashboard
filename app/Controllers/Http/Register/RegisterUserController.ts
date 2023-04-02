import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import EmailVerificationSender from 'App/Services/EmailVerificationSender';

export default class RegisterUserController {
  /**
  * @swagger
  * /register:
  *   post:
  *     tags:
  *       - Users
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           description: Register new user
  *           schema:
  *             type: object
  *             properties:
  *               email:
  *                 type: string
  *                 example: 'james.bond@gmail.com'
  *                 required: true
  *               password:
  *                 type: string
  *                 example: 'zerozeroseven'
  *                 required: true
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: Success
  */
  public async handle(ctx: HttpContextContract) {
    const { request, response, view } = ctx
    const requestBody: Record<string, any> = request.body()
    const email: string = requestBody.email
    const password: string = requestBody.password

    if (!email) {
      return response.send(
        await view.render('register',
          {
            email: {
              error: 'Email is required'
            },
            password: { value: password }
          }
      ))
    }

    // TODO: move the logic to check password to a service
    // validate password have at least 1 lower character, 1 upper character, 1 digit character, 1 special character, and at least 8 character.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/
    if (!passwordRegex.test(password)) {
      return response.send(
        await view.render('register',
          {
            email: { value: email },
            password: {
              error: 'Password must have at least 1 lower character, 1 upper character, 1 digit character, 1 special character, and at least 8 character'
            }
          }
      ))
    }

    const user = new User()
    user.email = email
    user.password = password
    await user.save()

    const emailSender: EmailVerificationSender = new EmailVerificationSender()
    await emailSender.sendEmail(user.id, user.email)

    response.redirect('/login')
  }
}
