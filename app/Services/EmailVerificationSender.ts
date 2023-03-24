import EmailService from "./EmailService";

export default class EmailVerificationSender {
  public async sendEmail(to: string) {
    const emailService: EmailService = new EmailService()
    const emailSubject: string = 'My Dashboard - Email Verification'
    const html: string = '<strong>Please verify your email by clicking this link</strong>'

    await emailService.sendEmail(to, emailSubject, html)
  }
}