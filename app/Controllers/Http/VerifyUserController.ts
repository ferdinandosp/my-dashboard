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
    const { request, response } = ctx
    const param: Record<string, any> = request.qs()
    const token: string = param.token

    const jwtTokenService: JwtTokenService = new JwtTokenService()
    const userId: number | null = jwtTokenService.verifyToken(token)

    if (userId == null) {
      return response.unauthorized()
    }

    var user: User

    return response.ok({})
  }
}