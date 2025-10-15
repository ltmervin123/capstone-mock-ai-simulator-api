import mongoose, { HydratedDocument, Model, Types } from 'mongoose';
import { NotFoundError } from '../utils/errors';
import interviewSchema from '../db-schemas/interview-schema';
import type {
  InterviewClientDocument as InterviewClientDocumentType,
  InterviewDocument as InterviewDocumentType,
  InterviewHistory as InterviewHistoryType,
} from '../types/interview-type';

interface InterviewModelInterface extends Model<InterviewDocumentType> {
  createInterview(interviewData: InterviewClientDocumentType): Promise<void>;
  getInterviewDetail(
    interviewId: string,
    studentId: string
  ): Promise<HydratedDocument<InterviewDocumentType>>;
  getInterviewHistory(studentId: string): Promise<InterviewHistoryType[]>;
}
interviewSchema.statics.createInterview = async function (
  interviewData: InterviewClientDocumentType
): Promise<void> {
  await this.create(interviewData);
};

interviewSchema.statics.getInterviewDetail = async function (
  interviewId: string,
  studentId: string
): Promise<HydratedDocument<InterviewDocumentType>> {
  const interview = await this.findOne({ _id: interviewId, studentId }).lean();

  if (!interview) {
    throw new NotFoundError('Interview detail not found');
  }

  return interview;
};

interviewSchema.statics.getInterviewHistory = async function (
  studentId: string
): Promise<InterviewHistoryType[]> {
  return await this.find({ studentId })
    .select({
      _id: 1,
      interviewType: 1,
      duration: 1,
      numberOfQuestions: 1,
      createdAt: 1,
      totalScore: '$scores.totalScore',
    })
    .sort({ createdAt: -1 })
    .lean();
};

const InterviewModel = mongoose.model<InterviewDocumentType, InterviewModelInterface>(
  'Interview',
  interviewSchema
);

export default InterviewModel;
