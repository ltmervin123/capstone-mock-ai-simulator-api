import mongoose, { HydratedDocument, Model, Types } from 'mongoose';
import { NotFoundError } from '../utils/errors';
import behavioralQuestion from '../db-schemas/behavioral-question-schema';
import type {
  BehavioralCategory,
  BehavioralQuestionDocument,
} from '../types/behavioral-question-type.js';
import { BehavioralQuestionSchema } from '../zod-schemas/behavioral-question-zod-schema';

interface BehavioralModelInterface extends Model<BehavioralQuestionDocument> {
  getBehavioralCategories(): Promise<BehavioralQuestionDocument[]>;
  getBehavioralCategoriesWithQuestionsCounts(): Promise<BehavioralCategory[]>;
  getBehavioralQuestionById(
    categoryId: Types.ObjectId | string
  ): Promise<HydratedDocument<BehavioralQuestionDocument>>;
  getBehavioralQuestion(
    categoryId: Types.ObjectId | string
  ): Promise<HydratedDocument<BehavioralQuestionDocument>>;
  updateBehavioralQuestion(
    categoryId: Types.ObjectId | string,
    questionData: BehavioralQuestionSchema
  ): Promise<void>;
  deleteBehavioralQuestion(categoryId: Types.ObjectId | string): Promise<void>;
  addCategory(categoryData: BehavioralQuestionSchema): Promise<void>;
  updateBehavioralCategoryNumberOfQuestionsToBeAnswered(
    categoryId: Types.ObjectId | string,
    numberOfQuestions: number
  ): Promise<void>;
}

behavioralQuestion.statics.addCategory = async function (
  categoryData: BehavioralCategory
): Promise<void> {
  await this.create(categoryData);
};

behavioralQuestion.statics.updateBehavioralCategoryNumberOfQuestionsToBeAnswered = async function (
  categoryId: Types.ObjectId | string,
  numberOfQuestions: number
): Promise<void> {
  const result = await this.findByIdAndUpdate(categoryId, {
    numberOfQuestionToGenerate: numberOfQuestions,
  });

  if (!result) throw new NotFoundError('Behavioral question category not found');
};

behavioralQuestion.statics.updateBehavioralQuestion = async function (
  categoryId: Types.ObjectId | string,
  questionData: Partial<BehavioralQuestionDocument>
): Promise<void> {
  const result = await this.findByIdAndUpdate(categoryId, questionData);

  if (!result) throw new NotFoundError('Behavioral question category not found');
};

behavioralQuestion.statics.deleteBehavioralQuestion = async function (
  categoryId: Types.ObjectId | string
): Promise<void> {
  const result = await this.findByIdAndDelete(categoryId);

  if (!result) throw new NotFoundError('Behavioral question category not found');
};

behavioralQuestion.statics.getBehavioralCategories = async function (): Promise<
  BehavioralQuestionDocument[]
> {
  return await this.find().select('_id description category').sort({ createdAt: -1 }).lean();
};

behavioralQuestion.statics.getBehavioralCategoriesWithQuestionsCounts = async function (): Promise<
  BehavioralQuestionDocument[]
> {
  return await this.aggregate([
    {
      $project: {
        _id: 1,
        description: 1,
        category: 1,
        numberOfQuestionToGenerate: 1,
        questionsCount: { $size: '$questions' },
      },
    },
  ]);
};

behavioralQuestion.statics.getBehavioralQuestionById = async function (
  categoryId: Types.ObjectId | string
): Promise<HydratedDocument<BehavioralQuestionDocument>> {
  const questionData = await this.findById(categoryId).lean();

  if (!questionData) throw new NotFoundError('Behavioral question not found');

  questionData.questions = questionData.questions
    .sort(() => Math.random() - 0.5)
    .slice(0, questionData.numberOfQuestionToGenerate);

  return questionData;
};

behavioralQuestion.statics.getBehavioralQuestion = async function (
  categoryId: Types.ObjectId | string
): Promise<HydratedDocument<BehavioralQuestionDocument>> {
  const questionData = await this.findById(categoryId)
    .select('_id category description questions')
    .lean();

  if (!questionData) throw new NotFoundError('Behavioral question not found');

  return questionData;
};

const BehavioralModel = mongoose.model<BehavioralQuestionDocument, BehavioralModelInterface>(
  'BehavioralQuestion',
  behavioralQuestion,
  'behavioral-questions'
);

export default BehavioralModel;
