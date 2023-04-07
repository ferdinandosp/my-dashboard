import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FacebookRedirectController {
  /**
  * @swagger
  * /register/facebook/redirect:
  *   get:
  *     tags:
  *      - Users
  *     summary: Redirect to Facebook login page. Not working on Swagger page.
  *     responses:
  *       200:
  *         description: Success. Redirected to Facebook login page.
  */
  public async handle({ ally }: HttpContextContract) {
    return ally.use('facebook').redirect()
  }
}