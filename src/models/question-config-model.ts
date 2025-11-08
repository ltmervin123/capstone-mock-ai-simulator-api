import mongoose, { HydratedDocument, Model } from 'mongoose';
import { NotFoundError } from '../utils/errors';
import questionConfig from '../db-schemas/question-config-schema';
import { QuestionConfigDocument } from '../types/question-config-type';
interface QuestionConfigInterface extends Model<QuestionConfigDocument> {
  getQuestionConfig(): Promise<HydratedDocument<QuestionConfigDocument>>;
  updateQuestionConfig(id: string, numberOfQuestionToGenerate: number): Promise<void>;
}

questionConfig.statics.getQuestionConfig = async function (): Promise<
  HydratedDocument<QuestionConfigDocument>
> {
  return await this.findOne();
};

questionConfig.statics.updateQuestionConfig = async function (
  id: string,
  numberOfQuestionToGenerate: number
): Promise<void> {
  const result = await this.findByIdAndUpdate(id, {
    numberOfQuestionToGenerate,
  });

  if (!result) throw new NotFoundError('Question config not found');
};

const QuestionConfigModel = mongoose.model<QuestionConfigDocument, QuestionConfigInterface>(
  'QuestionConfig',
  questionConfig,
  'question-config'
);

export default QuestionConfigModel;
