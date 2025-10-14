import mongoose, { HydratedDocument, Model, Types } from 'mongoose';
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

const InterviewModel = mongoose.model<InterviewDocumentType, InterviewModelInterface>(
  'Interview',
  interviewSchema
);

export default InterviewModel;
