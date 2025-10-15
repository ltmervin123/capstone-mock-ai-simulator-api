import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    interviewType: { type: String, enum: ['Basic', 'Behavioral', 'Expert'], required: true },
    duration: { type: String, required: true },
    numberOfQuestions: { type: Number, required: true },
    scores: {
      grammar: { type: Number, required: true },
      experience: { type: Number, required: true },
      skills: { type: Number, required: true },
      relevance: { type: Number, required: true },
      fillerCount: { type: Number, required: true },
      totalScore: { type: Number, required: true },
    },
    feedbacks: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        areaOfImprovement: { type: String, required: true },
        answerFeedback: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default interviewSchema;
