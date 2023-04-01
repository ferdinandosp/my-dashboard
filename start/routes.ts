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
import View from '@ioc:Adonis/Core/View'

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})

Route
  .group(() => {
    Route.get('', async ({ view }) => {
      const html = await view.render('register')

      return html
    })

    Route.get('/google/redirect', async ({ ally }) => {
      return ally.use('google').redirect()
    })

    Route.get('/google/callback', async ({ ally }) => {
      const google = ally.use('google')

      if (google.accessDenied()) {
        return 'Access was denied'
      }

      if (google.stateMisMatch()) {
        return 'Request expired. Try again.'
      }

      if (google.hasError()) {
        return google.getError()
      }

      const user = await google.user()
      console.log('user', user)

      console.log('email', user.email)
      console.log('is email verified', user.original.email_verified)

      return View.render('welcome')
    })

    Route.post('', 'RegisterUserController')
  })
  .prefix('/register')

Route
  .group(() => {
    Route.get('', async ({ view }) => {
      return await view.render('login', {email: '', error: ''})
    })

    Route.post('', 'UserLoginsController')
  })
  .prefix('/login')

Route.get('/verify', 'VerifyUserController')
Route.get('/generate-verify-token', 'GenerateVerificationTokenController')

Route
  .group(() => {
    Route.get('', async ({ auth, view, response }) => {
      await auth.use('web').authenticate()
      if (auth.use('web').isLoggedIn) {
        return await view.render('dashboard')
      } else {
        response.redirect('/login')
      }
    })
  })
  .prefix('/dashboard')