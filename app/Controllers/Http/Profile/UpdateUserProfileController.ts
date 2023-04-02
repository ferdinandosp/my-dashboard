import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserProfileController {
  public async handle(ctx: HttpContextContract) {
    const { auth, request, response, view } = ctx

    const user = await auth.authenticate()

    if (!user) {
      return response.redirect('/login')
    }

    const { name } = request.all()

    user.name = name

    await user.save()

    return view.render('profile', {
      email:
      {
        value: user.email
      },
      name:
      {
        value: user.name
      },
      message: 'Profile updated successfully'
    })
  }
}