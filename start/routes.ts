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

    Route.get('/google/redirect', async ({ ally }) => {
      return ally.use('google').redirect()
    })

    Route.get('/google/callback', 'Register/RegisterWithGoogleController')

    Route.get('/facebook/redirect', async ({ ally }) => {
      return ally.use('facebook').redirect()
    })

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
      } catch {
        console.log('not authenticated')
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

Route.get('/verify', 'Verify/VerifyUserController')
Route.get('/generate-verify-token', 'Verify/GenerateVerificationTokenController')

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