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
    Route.get('', async ({ view }) => {
      const html = await view.render('register')

      return html
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