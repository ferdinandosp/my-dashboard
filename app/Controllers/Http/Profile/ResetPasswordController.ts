import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

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
      return response.redirect('/login')
    }

    const { current_password, password, password_confirmation } = request.all()

    // validate current password
    if (!await user.verifyPassword(current_password)) {
      return response.badRequest({
        message: 'Current password is incorrect'
      })
    }

    if (password !== password_confirmation) {
      return response.badRequest({
        message: 'Passwords do not match'
      })
    }

    // validate password have at least 1 lower character, 1 upper character, 1 digit character, 1 special character, and at least 8 character.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/
    if (!passwordRegex.test(password)) {
      return response.badRequest({
        message: 'Password must have at least 1 lower character, 1 upper character, 1 digit character, 1 special character, and at least 8 character'
      })
    }

    user.password = password
    await user.save()

    return response.ok({
      message: 'Password reset successfully'
    })
  }
}