import StudentModel from '../models/student.model';
import QueueService from '../queue';
import { verificationToken } from '../utils/jwt';
import { verificationURL } from '../utils/url';
import { type Student as StudentType } from '../zod-schemas/student.zod.schema';

export const signup = async (studentData: StudentType): Promise<void> => {
  await StudentModel.signup(studentData);

  const token = verificationToken(studentData.email);

  const url = verificationURL(token);

  await QueueService.getInstance('email-service').addJob('verification-email', {
    to: studentData.email,
    url,
  });
};
