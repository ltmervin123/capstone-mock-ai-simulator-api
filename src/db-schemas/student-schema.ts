import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    studentId: { type: String, required: true },
    program: { type: String, required: true },
    nameExtension: { type: String, default: null },
    password: { type: String, required: true },
    isStudentVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isAuthenticated: { type: Boolean, default: false },
    acceptedAt: { type: Date, default: null },
    role: { type: String, enum: ['STUDENT', 'ADMIN'], default: 'STUDENT' },
  },
  {
    timestamps: true,
  }
);

export default studentSchema;
