import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class DashboardController {
  /**
  * @swagger
  * /dashboard:
  *   get:
  *     tags:
  *       - Dashboard
  *     summary: Go to the Dashboard page.
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: Loads the dashboard page.
  *       401:
  *         description: Not authorized to access this page.
  */
  public async handle({ auth, view, response }: HttpContextContract) {
    const user: User = await auth.use('web').authenticate()
    if (auth.use('web').isLoggedIn) {
      console.log('user', user.email_verified)
      if (user.email_verified == true) {
        return await view.render('dashboard')
      } else {
        return response.unauthorized({ message: 'You have to be verified to access this page' })
      }
    } else {
      return response.unauthorized({ message: 'You are not authorized to access this page' })
    }
  }
}