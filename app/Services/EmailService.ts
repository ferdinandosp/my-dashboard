import Env from '@ioc:Adonis/Core/Env'
import nodemailer from 'nodemailer'
import { SendMailOptions, SentMessageInfo } from 'nodemailer'

export default class EmailService {
  public async sendEmail(to: string, subject: string, html: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: Env.get('EMAIL_ADDRESS'),
        pass: Env.get('EMAIL_PASSWORD')
      }
    })

    const message: SendMailOptions = {
      from: 'No Reply <rainedfond@gmail.com>',
      to: to,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(
      message,
      (error: Error | null, info: SentMessageInfo) => {
        if (error) {
          console.log('error sending email', error)
        } else {
          console.log('email sent', info.response)
        }
      })
  }
}