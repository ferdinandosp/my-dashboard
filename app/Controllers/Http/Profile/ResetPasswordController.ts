import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import ResetPasswordValidator from 'App/Validators/ResetPasswordValidator'

export default class ResetPasswordController {
  /**
  * @swagger
  * /reset:
  *   post:
  *     tags:
  *       - Users
  *     summary: Reset password
  *     requestBody:
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               current_password:
  *                 type: string
  *                 example: 'zerozerosev3N'
  *                 required: true
  *               password:
  *                 type: string
  *                 example: 'zerozerosev3N'
  *                 required: true
  *                 description: Password must have at least 1 lower character, 1 upper character, 1 digit character, 1 special character, and at least 8 character.
  *               password_confirmation:
  *                 type: string
  *                 example: 'zerozerosev3N'
  *                 required: true
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: Successfully reset password
  *       400:
  *         description: Current password incorrect, or passwords do not match, or password not meet the requirements.
  */
  public async handle(ctx: HttpContextContract) {
    const { auth, request, response } = ctx

    const user: User = await auth.authenticate()

    if (!user) {
      return response.unauthorized({
        message: 'User not found'
      })
    }

    let payload
    try {
      payload = await request.validate(ResetPasswordValidator)
    } catch (e) {
      return response.badRequest({
        message: e.messages
      })
    }

    // validate current password
    if (!await user.verifyPassword(payload.current_password)) {
      return response.badRequest({
        message: 'Current password is incorrect'
      })
    }

    user.password = payload.password
    await user.save()

    return response.ok({
      message: 'Password reset successfully'
    })
  }
}