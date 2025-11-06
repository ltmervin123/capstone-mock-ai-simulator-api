export function generateVerificationEmailTemplate(firstName: string, link: string): string {
  return `<!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8" />
            <title>Email Verification</title>
          </head>
          <body style="font-family: Arial, sans-serif; background-color:#f5f7fa; margin:0; padding:0;">
            <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding:20px; text-align:center; background:#15803d ; color:#ffffff;">
                  <h2 style="margin:0;">Verify Your Email</h2>
                </td>
              </tr>
              <tr>
                <td style="padding:30px; color:#333333;">
                  <p>Hi <strong>${firstName}</strong>,</p>
                  <p>Thank you for registering with <strong>PrepWise</strong>!</p>
                  <p>Please verify your email by clicking the button below:</p>
                  <p style="text-align:center; margin:30px 0;">
                    <a href="${link}" style="background:#15803d ; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold;">Verify My Email</a>
                  </p>
                  <p>After verifying, your account will be reviewed by our admin team. You’ll receive an email once the review is complete.</p>
                  <p style="margin-top:30px;">Thank you,<br>The <strong>PrepWise</strong> Team</p>
                </td>
              </tr>
            </table>
          </body>
          </html>
`;
}

export function generateAccountApprovedEmailTemplate(firstName: string, link: string): string {
  return `<!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8" />
            <title>Account Approved</title>
          </head>
          <body style="font-family: Arial, sans-serif; background-color:#f5f7fa; margin:0; padding:0;">
            <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding:20px; text-align:center; background:#15803d; color:#ffffff;">
                  <h2 style="margin:0;">Your Account is Approved 🎉</h2>
                </td>
              </tr>
              <tr>
                <td style="padding:30px; color:#333333;">
                  <p>Hi <strong>${firstName}</strong>,</p>
                  <p>Good news! Your account with <strong>PrepWise</strong> has been approved by our admin team.</p>
                  <p>You can now log in and start exploring the platform:</p>
                  <p style="text-align:center; margin:30px 0;">
                    <a href="${link}" style="background:#15803d; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold;">Log In to Your Account</a>
                  </p>
                  <p style="margin-top:30px;">Welcome aboard,<br>The <strong>PrepWise</strong> Team</p>
                </td>
              </tr>
            </table>
          </body>
          </html>
`;
}

export function generateAccountRejectedEmailTemplate(firstName: string, link: string): string {
  return `<!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8" />
            <title>Account Rejected</title>
          </head>
          <body style="font-family: Arial, sans-serif; background-color:#f5f7fa; margin:0; padding:0;">
            <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding:20px; text-align:center; background:#dc2626; color:#ffffff;">
                  <h2 style="margin:0;">Account Application Update ❗</h2>
                </td>
              </tr>
              <tr>
                <td style="padding:30px; color:#333333;">
                  <p>Hi <strong>${firstName}</strong>,</p>
                  <p>Thank you for verifying your email and applying for an account with <strong>PrepWise</strong>.</p>
                  <p>After review, we regret to inform you that your account <strong>was not approved</strong> at this time.</p>
                  <p>If you’d like to reapply, please update your details and submit your application again:</p>
                  <p style="text-align:center; margin:30px 0;">
                    <a href="${link}" style="background:#dc2626; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold;">Reapply Now</a>
                  </p>
                  <p style="margin-top:30px;">Best regards,<br>The <strong>PrepWise</strong> Team</p>
                </td>
              </tr>
            </table>
          </body>
          </html>
`;
}
