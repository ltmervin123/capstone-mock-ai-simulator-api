import mongoose, { HydratedDocument, Model, Types } from 'mongoose';
import studentSchema from '../db-schemas/student.schema';
import type { Student as StudentType } from '../zod-schemas/student-zod-schema';
import type { StudentDocument as StudentDocumentType } from '../types/student-type';
import { ConflictError, UnauthorizedError } from '../utils/errors';
import { generateHash, compareHash } from '../utils/bcrypt';

interface StudentModelInterface extends Model<StudentDocumentType> {
  signup(studentData: StudentType): Promise<HydratedDocument<StudentDocumentType>>;
  verifyEmail(id: Types.ObjectId): Promise<void>;
  verifyStudent(id: Types.ObjectId): Promise<void>;
  signin(email: string, password: string): Promise<HydratedDocument<StudentDocumentType>>;
}

studentSchema.statics.signup = async function (
  studentData: StudentType
): Promise<HydratedDocument<StudentDocumentType>> {
  const existingStudent = await this.findOne({
    email: studentData.email,
    studentId: studentData.studentId,
  }).lean();

  if (existingStudent) {
    throw new ConflictError('The Email and Student ID provided is already registered.');
  }

  const hashedPassword = await generateHash(studentData.password);

  return await this.create({ ...studentData, password: hashedPassword });
};

studentSchema.statics.verifyEmail = async function (id: Types.ObjectId): Promise<void> {
  const student: HydratedDocument<StudentDocumentType> | null = await this.findById(id);

  if (!student) {
    throw new ConflictError('Student not found.');
  }

  if (student.isEmailVerified) {
    throw new ConflictError('Email is already verified.');
  }

  student.isEmailVerified = true;

  await student.save();
};

studentSchema.statics.verifyStudent = async function (id: Types.ObjectId): Promise<void> {
  const student: HydratedDocument<StudentDocumentType> | null = await this.findById(id);

  if (!student) {
    throw new ConflictError('Student not found.');
  }

  if (!student.isEmailVerified) {
    throw new ConflictError('Email verification is required before student verification.');
  }

  if (student.isStudentVerified) {
    throw new ConflictError('Student is already verified.');
  }

  student.isStudentVerified = true;
  await student.save();
};

studentSchema.statics.signin = async function (
  email: string,
  password: string
): Promise<HydratedDocument<StudentDocumentType>> {
  const student: HydratedDocument<StudentDocumentType> | null = await this.findOne({
    email,
  })
    .select(
      '_id firstName lastName middleName email studentId program password isStudentVerified isEmailVerified role'
    )
    .lean();

  if (!student) {
    throw new UnauthorizedError('Incorrect email address.');
  }

  if (!student.isEmailVerified) {
    throw new UnauthorizedError('Email address is not verified.');
  }

  if (!student.isStudentVerified) {
    throw new UnauthorizedError('Your account is not verified.');
  }

  if (!(await compareHash(password, student.password))) {
    throw new UnauthorizedError('Incorrect password.');
  }

  return student;
};

const StudentModel = mongoose.model<StudentDocumentType, StudentModelInterface>(
  'Student',
  studentSchema
);

export default StudentModel;
