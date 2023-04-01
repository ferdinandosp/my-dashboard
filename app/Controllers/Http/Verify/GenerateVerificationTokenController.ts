import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import JwtTokenService from 'App/Services/JwtTokenService'

export default class GenerateVerificationTokenController {
  /**
  * @swagger
  * /generate-verify-token:
  *   get:
  *     tags:
  *       - Users
  *     summary: Generate verification token
  *     parameters:
  *       - name: userId
  *         description: User ID of registered user
  *         in: query
  *         required: true
  *         type: number
  *     responses:
  *       200:
  *         description: Success
  */
  public async handle(ctx: HttpContextContract) {
    const { request, response } = ctx
    const requestBody: Record<string, any> = request.qs()
    const userId: Number = requestBody.userId
    var user: User | null = await User.find(userId)

    if (!user) {
      return response.notFound({ error: 'user id not found' + userId })
    }

    var jwtTokenService: JwtTokenService = new JwtTokenService()
    var token: string = jwtTokenService.generateNewToken(user.id)

    return response.ok({ token })
  }
}