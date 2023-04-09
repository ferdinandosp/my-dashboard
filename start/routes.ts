/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
import User from 'App/Models/User'

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})

Route
  .group(() => {
    Route.get('', async ({ auth, view, response }) => {
      try {
        await auth.use('web').authenticate()
        if (auth.use('web').isLoggedIn) {
          return response.redirect('/dashboard')
        }
      } catch {
        console.log('not authenticated')
      }

      return await view.render('register')
    })

    Route.get('/google/redirect', 'Register/GoogleRedirectController')

    Route.get('/google/callback', 'Register/RegisterWithGoogleController')

    Route.get('/facebook/redirect', 'Register/FacebookRedirectController')

    Route.get('/facebook/callback', 'Register/RegisterWithFacebookController')

    Route.post('', 'Register/RegisterUserController')
  })
  .prefix('/register')

Route
  .group(() => {
    Route.get('', async ({ auth, view, response }) => {
      try {
        await auth.use('web').authenticate()
        if (auth.use('web').isLoggedIn) {
          return response.redirect('/dashboard')
        }
      } catch (e) {
        return response.unauthorized({ message: 'You are not logged in' })
      }

      return await view.render('login', {email: '', error: ''})
    })

    Route.get('/google/redirect', async ({ ally }) => {
      return ally.use('google').redirect()
    })

    Route.get('/facebook/redirect', async ({ ally }) => {
      return ally.use('facebook').redirect()
    })

    Route.post('', 'Login/UserLoginsController')
  })
  .prefix('/login')

Route.post('/logout', 'Logout/LogoutController')

Route
  .group(() => {
    Route.get('', async ({ auth, view }) => {
      const user : User = await auth.authenticate()

      if (user.email_verified) {
        return view.render('dashboard', { message: 'Email already verified' })
      }

      return await view.render('verify')
    })

    Route.get('/now', 'Verify/VerifyUserController')
    Route.post('/send-verify-email', 'Verify/SendVerificationEmailController')
    Route.get('/generate-verify-token', 'Verify/GenerateVerificationTokenController')
  })
  .prefix('/verify')

Route
  .group(() => {
    Route.get('', 'Dashboard/DashboardController')
  })
  .prefix('/dashboard')

Route
  .group(() => {
    Route.get('', 'Profile/GetUserProfileController')
    Route.post('', 'Profile/UpdateUserProfileController')
  })
  .prefix('/profile')

Route
  .group(() => {
    Route.get('', 'Profile/ViewResetPasswordPageController')
    Route.post('', 'Profile/ResetPasswordController')
  })
  .prefix('/reset')