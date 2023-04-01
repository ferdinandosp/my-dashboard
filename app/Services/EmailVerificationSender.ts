import EmailService from "./EmailService"
import JwtTokenService from "./JwtTokenService"
import Env from '@ioc:Adonis/Core/Env'

export default class EmailVerificationSender {
  public async sendEmail(userId: number, to: string) {
    const emailService: EmailService = new EmailService()
    const emailSubject: string = 'My Dashboard - Email Verification'

    const tokenService: JwtTokenService = new JwtTokenService()
    const token: string = tokenService.generateNewToken(userId)
    const baseUrl = Env.get('APP_URL')
    const html: string = `<strong>Please verify your email by clicking this <a href='${baseUrl}/verify?token=${token}'>link</a></strong>`

    await emailService.sendEmail(to, emailSubject, html)
  }
}