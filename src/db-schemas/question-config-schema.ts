import mongoose from 'mongoose';

const questionConfig = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['BASIC', 'BEHAVIORAL', 'EXPERT'],
      required: true,
    },
    numberOfQuestionToGenerate: { type: Number, default: 5 },
  },
  {
    timestamps: true,
  }
);

export default questionConfig;
