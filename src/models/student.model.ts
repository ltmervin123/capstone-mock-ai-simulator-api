import mongoose, { HydratedDocument, Model, Types } from 'mongoose';
import studentSchema from '../db-schemas/student-schema';
import { type Student as StudentType } from '../zod-schemas/student-zod-schema';
import type { StudentDocument as StudentDocumentType } from '../types/student-type';
import { ConflictError, UnauthorizedError } from '../utils/errors';
import { generateHash, compareHash } from '../utils/bcrypt';
import { PROGRAM_ACRONYMS } from '../utils/student-program-option';
import { StudentFilterParams } from '../zod-schemas/admin-zod-schema';

interface StudentModelInterface extends Model<StudentDocumentType> {
  signup(studentData: StudentType): Promise<HydratedDocument<StudentDocumentType>>;
  verifyEmail(id: Types.ObjectId): Promise<void>;
  verifyStudent(id: Types.ObjectId): Promise<void>;
  signin(email: string, password: string): Promise<HydratedDocument<StudentDocumentType>>;
  signout(id: string): Promise<void>;
  getAllCountsOfVerifiedStudents(): Promise<number>;
  getMonthlyIncrementedStudentCount(): Promise<number>;
  getAllCountsOfPendingStudents(): Promise<number>;
  getDailyIncreasedOfPendingStudents(): Promise<number>;
  getCountsOfStudentsByProgram(): Promise<Record<string, number>>;
  getCountsOfAuthenticatedStudents(): Promise<number>;
  getPendingStudents(
    filterOptions: StudentFilterParams
  ): Promise<HydratedDocument<StudentDocumentType>[]>;
  getAcceptedStudents(
    filterOptions: StudentFilterParams
  ): Promise<HydratedDocument<StudentDocumentType>[]>;
  acceptStudent(id: string): Promise<StudentDocumentType>;
  rejectStudent(id: string): Promise<StudentDocumentType>;
}

studentSchema.statics.rejectStudent = async function (id: string): Promise<StudentDocumentType> {
  const rejectedStudent = await this.findByIdAndDelete(id);

  if (!rejectedStudent) {
    throw new ConflictError('Student not found.');
  }

  return rejectedStudent;
};

studentSchema.statics.acceptStudent = async function (id: string): Promise<StudentDocumentType> {
  const acceptedStudent = await this.findByIdAndUpdate(id, {
    isStudentVerified: true,
    acceptedAt: new Date(),
  });

  if (!acceptedStudent) {
    throw new ConflictError('Student not found.');
  }

  return acceptedStudent;
};

studentSchema.statics.getAcceptedStudents = async function (
  filterOptions: StudentFilterParams
): Promise<HydratedDocument<StudentDocumentType>[]> {
  if (filterOptions?.name) {
    const nameRegex = new RegExp(`^${filterOptions.name}`, 'i');
    return await this.find({
      isStudentVerified: true,
      isEmailVerified: true,
      role: 'STUDENT',
      $or: [{ firstName: nameRegex }, { lastName: nameRegex }, { middleName: nameRegex }],
    }).select(
      '_id firstName lastName middleName email studentId program acceptedAt isAuthenticated'
    );
  }

  if (filterOptions?.studentId) {
    const studentIdRegex = new RegExp(`^${filterOptions.studentId}`, 'i');
    return await this.find({
      isStudentVerified: true,
      isEmailVerified: true,
      role: 'STUDENT',
      studentId: studentIdRegex,
    }).select(
      '_id firstName lastName middleName email studentId program acceptedAt isAuthenticated'
    );
  }

  return await this.find({
    isStudentVerified: true,
    isEmailVerified: true,
    role: 'STUDENT',
  }).select('_id firstName lastName middleName email studentId program acceptedAt isAuthenticated');
};

studentSchema.statics.getPendingStudents = async function (
  filterOptions: StudentFilterParams
): Promise<HydratedDocument<StudentDocumentType>[]> {
  if (filterOptions?.name) {
    const nameRegex = new RegExp(`^${filterOptions.name}`, 'i');
    return await this.find({
      isStudentVerified: false,
      isEmailVerified: true,
      role: 'STUDENT',
      $or: [{ firstName: nameRegex }, { lastName: nameRegex }, { middleName: nameRegex }],
    }).select(
      '_id firstName lastName middleName email studentId program acceptedAt isAuthenticated'
    );
  }

  if (filterOptions?.studentId) {
    const studentIdRegex = new RegExp(`^${filterOptions.studentId}`, 'i');
    return await this.find({
      isStudentVerified: false,
      isEmailVerified: true,
      role: 'STUDENT',
      studentId: studentIdRegex,
    }).select(
      '_id firstName lastName middleName email studentId program acceptedAt isAuthenticated'
    );
  }

  return await this.find({
    isStudentVerified: false,
    isEmailVerified: true,
    role: 'STUDENT',
  }).select('_id firstName lastName middleName email studentId program acceptedAt isAuthenticated');
};

studentSchema.statics.getCountsOfAuthenticatedStudents = async function (): Promise<number> {
  return await this.countDocuments({
    isAuthenticated: true,
    isStudentVerified: true,
    isEmailVerified: true,
    role: 'STUDENT',
  });
};

studentSchema.statics.getCountsOfStudentsByProgram = async function (): Promise<
  Record<string, number>
> {
  const result = await this.aggregate([
    {
      $match: {
        isStudentVerified: true,
        isEmailVerified: true,
        role: 'STUDENT',
      },
    },
    {
      $group: {
        _id: '$program',
        count: { $sum: 1 },
      },
    },
  ]);

  const countsByAcronym: Record<string, number> = {};
  result.forEach((item: { _id: string; count: number }) => {
    const acronym = (PROGRAM_ACRONYMS as Record<string, string>)[item._id];
    countsByAcronym[acronym] = item.count;
  });

  return countsByAcronym;
};

studentSchema.statics.getAllCountsOfPendingStudents = async function (): Promise<number> {
  return await this.countDocuments({
    isStudentVerified: false,
    isEmailVerified: true,
    role: 'STUDENT',
  });
};

studentSchema.statics.getDailyIncreasedOfPendingStudents = async function (): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  return await this.countDocuments({
    createdAt: { $gte: startOfDay, $lt: endOfDay },
    isStudentVerified: false,
    isEmailVerified: true,
    role: 'STUDENT',
  });
};

studentSchema.statics.getAllCountsOfVerifiedStudents = async function (): Promise<number> {
  return await this.countDocuments({
    isStudentVerified: true,
    isEmailVerified: true,
    role: 'STUDENT',
  });
};

studentSchema.statics.getMonthlyIncrementedStudentCount = async function (): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(startOfMonth);

  endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  return await this.countDocuments({
    createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    isStudentVerified: true,
    isEmailVerified: true,
    role: 'STUDENT',
  });
};
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
  }).select(
    '_id firstName lastName middleName email studentId program password isStudentVerified isEmailVerified role isAuthenticated'
  );

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

  if (!student.isAuthenticated) {
    student.isAuthenticated = true;
    await student.save();
  }

  return student;
};

studentSchema.statics.signout = async function (id: string): Promise<void> {
  const result = await this.findByIdAndUpdate(id, { isAuthenticated: false });

  if (!result) {
    throw new ConflictError('Student not found.');
  }
};

const StudentModel = mongoose.model<StudentDocumentType, StudentModelInterface>(
  'Student',
  studentSchema
);

export default StudentModel;
