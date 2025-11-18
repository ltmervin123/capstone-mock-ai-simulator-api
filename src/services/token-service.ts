import TokenModel from '../models/token-model';
import StudentModel from '../models/student.model';
import * as JWT from '../utils/jwt';
import { resetPasswordURL } from '../utils/url';
import QueueService from '../queue';
import { generateResetPasswordEmailTemplate } from '../utils/email-template';

export const sendResetPasswordLink = async (email: string) => {
  const studentInfo = await StudentModel.findByEmail(email);

  const token = JWT.generateToken(studentInfo, { expiresIn: '1d' });

  const resetLink = resetPasswordURL(token);

  const emailData = {
    to: email,
    subject: 'Verify Your Email to Continue Your Registration',
    html: generateResetPasswordEmailTemplate(studentInfo.firstName, resetLink),
  };

  const purpose = 'RESET_PASSWORD';
 
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await TokenModel.createToken(token, purpose, expiresAt);

  await QueueService.getInstance('email-service').addJob('send-email', emailData);
};
