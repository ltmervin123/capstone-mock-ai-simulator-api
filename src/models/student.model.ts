import mongoose, { Model } from 'mongoose';
import studentSchema from '../db-schemas/student.schema';
import type { Student as StudentType } from '../zod-schemas/student-zod-schema';
import { ConflictError } from '../utils/errors';
import { generateHash } from '../utils/bcrypt';

interface StudentModelInterface extends Model<StudentType> {
  signup(studentData: StudentType): Promise<void>;
}

studentSchema.statics.signup = async function (studentData: StudentType): Promise<void> {
  const existingEmail = await this.findOne({ email: studentData.email }).lean();

  if (existingEmail) {
    throw new ConflictError('Email already exists');
  }

  const existingStudentId = await this.findOne({ studentId: studentData.studentId }).lean();

  if (existingStudentId) {
    throw new ConflictError('Student ID already exists');
  }

  const hashedPassword = await generateHash(studentData.password);

  const newStudent = { ...studentData, password: hashedPassword };

  await this.create(newStudent);
};

const StudentModel = mongoose.model<StudentType, StudentModelInterface>('Student', studentSchema);

export default StudentModel;
