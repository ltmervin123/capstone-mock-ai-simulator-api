import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    studentId: { type: Number, required: true },
    program: { type: String, required: true },
    password: { type: String, required: true },
    isStudentVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default studentSchema;
