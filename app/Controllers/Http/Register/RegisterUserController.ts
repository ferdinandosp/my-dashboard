import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import EmailVerificationSender from 'App/Services/EmailVerificationSender';
import RegisterUser from 'App/Validators/RegisterUserValidator';

export default class RegisterUserController {
  /**
  * @swagger
  * /register:
  *   post:
  *     tags:
  *       - Users
  *     summary: Register new user
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
  *       400:
  *         description: Email already registered, or password is not valid
  */
  public async handle(ctx: HttpContextContract) {
    const { request, response } = ctx

    let payload
    try {
      payload = await request.validate(RegisterUser)
    } catch (e) {
      return response.badRequest({
        message: e.messages
      })
    }

    // check existing user duplicate
    const existingUser = await User.findBy('email', payload.email)
    if (existingUser) {
      return response.badRequest({
        message: 'Email is already registered'
      })
    }

    const user = new User()
    user.email = payload.email
    user.password = payload.password
    await user.save()

    const emailSender: EmailVerificationSender = new EmailVerificationSender()
    await emailSender.sendEmail(user.id, user.email)

    return response.ok({
      message: 'User registered successfully'
    })
  }
}
