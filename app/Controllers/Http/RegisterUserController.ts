import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import EmailVerificationSender from 'App/Services/EmailVerificationSender';
import { DateTime } from 'luxon';

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
    const { request, response } = ctx
    const requestBody: Record<string, any> = request.body()
    const email: string = requestBody.email
    const password: string = requestBody.password

    const user = new User()
    user.email = email
    user.password = password
    user.created_at = DateTime.now()
    user.updated_at = DateTime.now()
    await user.save()

    const emailSender: EmailVerificationSender = new EmailVerificationSender()
    emailSender.sendEmail(user.email)

    response.redirect('/login')
  }
}
