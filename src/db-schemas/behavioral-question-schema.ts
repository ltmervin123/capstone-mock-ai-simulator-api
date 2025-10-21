import mongoose from 'mongoose';

const behavioralQuestion = new mongoose.Schema(
  {
    category: { type: String, required: true },
    description: { type: String, required: true },
    questions: { type: [String], required: true },
    numberOfQuestionToGenerate: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default behavioralQuestion;
