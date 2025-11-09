import questionConfig from '../db-schemas/question-config-schema';
import { InferSchemaType } from 'mongoose';

export type QuestionConfigDocument = InferSchemaType<typeof questionConfig>;
