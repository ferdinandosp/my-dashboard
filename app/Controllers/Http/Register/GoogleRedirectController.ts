import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GoogleRedirectController {
  /**
  * @swagger
  * /register/google/redirect:
  *   get:
  *     tags:
  *      - Users
  *     summary: Redirect to Google login page. Not working on Swagger page.
  *     responses:
  *       200:
  *         description: Success. Redirected to Google login page.
  */
  public async handle({ ally }: HttpContextContract) {
    return ally.use('google').redirect()
  }
}