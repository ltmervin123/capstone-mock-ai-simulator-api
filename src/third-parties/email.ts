// import nodemailer, { Transporter } from 'nodemailer';
// import { CONFIG } from '../utils/constant-value';
// import { EmailData } from '../workers/email-worker';

// class Email {
//   private static transporter: Transporter = nodemailer.createTransport({
//     // host: CONFIG.EMAIL_SERVICE.HOST!,
//     // port: Number(CONFIG.EMAIL_SERVICE.PORT!),
//     // secure: true,
//     service: 'gmail',
//     auth: {
//       user: CONFIG.EMAIL_SERVICE.EMAIL!,
//       pass: CONFIG.EMAIL_SERVICE.PASSWORD!,
//     },
//   });

//   public static async sendEmail(emailData: EmailData): Promise<void> {
//     const { to, subject, html } = emailData;
//     await Email.transporter.sendMail({
//       from: CONFIG.EMAIL_SERVICE.EMAIL!,
//       to,
//       subject,
//       html,
//     });
//   }
// }

// export default Email;

import axios from 'axios';
import { CONFIG } from '../utils/constant-value';
import { EmailData } from '../workers/email-worker';

class Email {
  private static readonly BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

  public static async sendEmail(emailData: EmailData): Promise<void> {
    const { to, subject, html } = emailData;
    const { BREVO_API_KEY, EMAIL } = CONFIG.EMAIL_SERVICE;

    await axios.post(
      Email.BREVO_API_URL,
      {
        to: [{ email: to }],
        sender: { email: EMAIL! },
        subject,
        htmlContent: html,
      },
      {
        headers: {
          'api-key': BREVO_API_KEY!,
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export default Email;
