import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class ResetPasswordController {
  public async handle(ctx: HttpContextContract) {
    const { auth, request, response, view } = ctx

    const user: User = await auth.authenticate()

    if (!user) {
      return response.redirect('/login')
    }

    const { current_password, password, password_confirmation } = request.all()

    // validate current password

    if (!await user.verifyPassword(current_password)) {
      return view.render('reset', {
        message: 'Current password is incorrect'
      })
    }

    if (password !== password_confirmation) {
      return view.render('reset', {
        email:
        {
          value: user.email
        },
        message: 'Passwords do not match'
      })
    }

    // validate password have at least 1 lower character, 1 upper character, 1 digit character, 1 special character, and at least 8 character.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/
    if (!passwordRegex.test(password)) {
      return response.send(
        await view.render('reset',
          {
            email: { value: user.email },
            message: 'Password must have at least 1 lower character, 1 upper character, 1 digit character, 1 special character, and at least 8 character'
          }
        ))
    }

    user.password = password
    await user.save()

    return view.render('reset', {
      email:
      {
        value: user.email
      },
      name:
      {
        value: user.name
      },
      message: 'Password updated successfully'
    })
  }
}