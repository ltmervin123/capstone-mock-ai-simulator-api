import { HydratedDocument, Types } from 'mongoose';
import StudentModel from '../models/student.model';
import QueueService from '../queue';
import { generateVerificationEmailTemplate } from '../utils/email-template';
import { generateToken } from '../utils/jwt';
import { verificationURL } from '../utils/url';
import { type Student as StudentType } from '../zod-schemas/student-zod-schema';
import type { StudentDocument as StudentDocumentType } from '../types/student-type';

export const signup = async (studentData: StudentType): Promise<void> => {
  const { _id, email } = await StudentModel.signup(studentData);

  const token = generateToken({ id: _id, email });

  const url = verificationURL(token);

  const emailData = {
    to: studentData.email,
    subject: 'Verify Your Email to Continue Your Registration',
    html: generateVerificationEmailTemplate(studentData.firstName, url),
  };

  await QueueService.getInstance('email-service').addJob('verification-email', emailData);
};

export const verifyEmail = async (id: Types.ObjectId): Promise<void> => {
  await StudentModel.verifyEmail(id);
};

export const signin = async (
  email: string,
  password: string
): Promise<HydratedDocument<StudentDocumentType>> => {
  return await StudentModel.signin(email, password);
};
