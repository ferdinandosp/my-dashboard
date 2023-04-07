import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class GetUserProfileController {
  /**
  * @swagger
  * /profile:
  *   get:
  *     tags:
  *       - Users
  *     summary: Get user profile
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: Success
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 email:
  *                   type: string
  *                   example: 'example@email.com'
  *                 name:
  *                   type: string
  *                   example: 'John Doe'
  *       401:
  *         description: Unauthorized
  */
  public async handle(ctx: HttpContextContract) {
    const { auth, response } = ctx

    let user: User

    try {
      user = await auth.authenticate()
    } catch {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    const userProfileResponse: UserProfileResponse = {
      email: user.email,
      name: user.name
    }

    return response.ok(userProfileResponse)
  }
}