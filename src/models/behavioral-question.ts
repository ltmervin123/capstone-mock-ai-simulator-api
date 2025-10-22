import mongoose, { HydratedDocument, Model, Types } from 'mongoose';
import { NotFoundError } from '../utils/errors';
import behavioralQuestion from '../db-schemas/behavioral-question-schema';
import type { BehavioralQuestionDocument as BehavioralQuestionDocumentType } from '../types/behavioral-question-type.js';

interface BehavioralModelInterface extends Model<BehavioralQuestionDocumentType> {
  getBehavioralCategories(): Promise<BehavioralQuestionDocumentType[]>;
  getBehavioralQuestionById(
    questionId: Types.ObjectId | string
  ): Promise<HydratedDocument<BehavioralQuestionDocumentType>>;
}

behavioralQuestion.statics.getBehavioralCategories = async function (): Promise<
  BehavioralQuestionDocumentType[]
> {
  return await this.find().select('_id description category').lean();
};

behavioralQuestion.statics.getBehavioralQuestionById = async function (
  questionId: Types.ObjectId | string
): Promise<HydratedDocument<BehavioralQuestionDocumentType>> {
  const questionData = await this.findById(questionId).lean();

  if (!questionData) throw new NotFoundError('Behavioral question not found');

  questionData.questions = questionData.questions
    .sort(() => Math.random() - 0.5)
    .slice(0, questionData.numberOfQuestionToGenerate);

  return questionData;
};

const BehavioralModel = mongoose.model<BehavioralQuestionDocumentType, BehavioralModelInterface>(
  'BehavioralQuestion',
  behavioralQuestion,
  'behavioral-questions'
);

export default BehavioralModel;
