import mongoose, { HydratedDocument, Model, Types } from 'mongoose';
import { NotFoundError } from '../utils/errors';
import interviewSchema from '../db-schemas/interview-schema';
import type {
  InterviewDocument as InterviewDocumentType,
  InterviewHistory as InterviewHistoryType,
} from '../types/interview-type';

interface InterviewModelInterface extends Model<InterviewDocumentType> {
  createInterview(interviewData: InterviewDocumentType): Promise<void>;
  getInterviewDetail(studentId: string): Promise<HydratedDocument<InterviewDocumentType>>;
  getInterviewHistory(studentId: string): Promise<InterviewHistoryType[]>;
}
interviewSchema.statics.createInterview = async function (
  interviewData: InterviewDocumentType
): Promise<void> {
  await this.create(interviewData);
};

interviewSchema.statics.getInterviewDetail = async function (
  studentId: string
): Promise<HydratedDocument<InterviewDocumentType>> {
  const interview = await this.findOne({ studentId }).lean();

  if (!interview) {
    throw new NotFoundError('Interview detail not found');
  }

  return interview;
};

interviewSchema.statics.getInterviewHistory = async function (
  studentId: string
): Promise<InterviewHistoryType[]> {
  return await this.find({ studentId }).sort({ createdAt: -1 }).lean();
};

const InterviewModel = mongoose.model<InterviewDocumentType, InterviewModelInterface>(
  'Interview',
  interviewSchema
);

export default InterviewModel;
