import nodemailer, { Transporter } from 'nodemailer';
import { CONFIG } from '../utils/constant-value';
import { EmailData } from '../workers/email-worker';

class Email {
  private static transporter: Transporter = nodemailer.createTransport({
    // host: CONFIG.EMAIL_SERVICE.HOST!,
    // port: Number(CONFIG.EMAIL_SERVICE.PORT!),
    // secure: true,
    service: 'gmail',
    auth: {
      user: CONFIG.EMAIL_SERVICE.EMAIL!,
      pass: CONFIG.EMAIL_SERVICE.PASSWORD!,
    },
  });

  public static async sendEmail(emailData: EmailData): Promise<void> {
    const { to, subject, html } = emailData;
    await Email.transporter.sendMail({
      from: CONFIG.EMAIL_SERVICE.EMAIL!,
      to,
      subject,
      html,
    });
  }
}

export default Email;
