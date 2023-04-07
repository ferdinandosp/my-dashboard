import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import JwtTokenService from 'App/Services/JwtTokenService'

export default class VerifyUserController {
  /**
  * @swagger
  * /verify:
  *   get:
  *     tags:
  *       - Users
  *     summary: Verify a user
  *     parameters:
  *       - name: token
  *         description: token to verify user
  *         in: query
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: Success
  */
  public async handle (ctx: HttpContextContract) {
    const { auth, request, response } = ctx
    const param: Record<string, any> = request.qs()
    const token: string = param.token

    const jwtTokenService: JwtTokenService = new JwtTokenService()
    const userId: number | null = jwtTokenService.verifyToken(token)

    if (userId == null) {
      return response.unauthorized()
    }

    const user: User | null = await User.find(userId)

    if (user === null) {
      return response.notFound({error: 'user not found'})
    }

    if (user.email_verified === true) {
      return response.badRequest({error: 'user already verified'})
    }

    user.markEmailVerified()
    await user.save()

    await auth.use('web').login(user)

    return response.redirect('/dashboard')
  }
}