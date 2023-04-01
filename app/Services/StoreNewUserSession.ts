import UserSession from "App/Models/UserSession"

export default class StoreNewUserSession {
  public static async handle (userId: number) {
    const newUserSession = new UserSession()
    newUserSession.userId = userId

    await newUserSession.save()
  }
}