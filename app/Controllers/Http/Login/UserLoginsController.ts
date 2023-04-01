import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreNewUserSession from 'App/Services/StoreNewUserSession'

export default class UserLoginsController {
  /**
  * @swagger
  * /login:
  *   post:
  *     tags:
  *       - Users
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
  */
  public async handle(ctx: HttpContextContract) {
    const { auth, request, response, view } = ctx
    const requestBody: Record<string, any> = request.body()
    const email: string = requestBody.email
    const password: string = requestBody.password

    try {
      await auth.use('web').attempt(email, password)

      const user = await auth.authenticate()
      await StoreNewUserSession.handle(user.id)

      response.redirect('/dashboard')
    } catch {
      response.send(
        await view.render('login',
          {
            email: email,
            error: 'Login failed'
          }
        )
      )
    }
  }
}
