import UserSession from "App/Models/UserSession"

export default class DeactivateUserSession {
  public static async handle (userId: number) {
    const userSession: UserSession | null = await UserSession.findBy('user_id', userId)

    if (userSession === null) {
      return
    }

    userSession.isActive = false

    await userSession.save()
  }
}