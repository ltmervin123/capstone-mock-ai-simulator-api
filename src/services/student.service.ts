import StudentModel from '../models/student.model';
import { Student as StudentType } from '../zod-schemas/student.zod.schema';

export const signupStudent = async (studentData: StudentType): Promise<void> => {
  await StudentModel.signup(studentData);

  //Push email to queue for sending verification email to student
};
