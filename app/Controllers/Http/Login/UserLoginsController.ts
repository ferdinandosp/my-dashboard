import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreNewUserSession from 'App/Services/StoreNewUserSession'
import LoginUserValidator from 'App/Validators/LoginUserValidator'

export default class UserLoginsController {
  /**
  * @swagger
  * /login:
  *   post:
  *     tags:
  *       - Users
  *     summary: Login existing user
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           description: Login existing user
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
  *         description: Invalid credentials
  */
  public async handle(ctx: HttpContextContract) {
    const { auth, request, response } = ctx

    let payload
    try {
      payload = await request.validate(LoginUserValidator)
    } catch (e) {
      return response.badRequest({
        message: e.messages
      })
    }

    try {
      await auth.use('web').attempt(payload.email, payload.password)

      const user = await auth.authenticate()
      await StoreNewUserSession.handle(user.id)

      response.ok({})
    } catch {
      response.badRequest({ message: 'Invalid credentials' })
    }
  }
}
