import { Types } from 'mongoose';
import type { Student as StudentType } from '../zod-schemas/student-zod-schema';

export interface StudentDocument extends StudentType {
  isEmailVerified: boolean;
  isStudentVerified: boolean;
  role: 'STUDENT' | 'ADMIN';
  createdAt?: Date;
  updatedAt?: Date;
}

export type VerifyEmailPayload = {
  email: string;
  id: Types.ObjectId;
};
