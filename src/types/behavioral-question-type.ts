import { InferSchemaType } from 'mongoose';
import behavioralQuestion from '../db-schemas/behavioral-question-schema.js';

export type BehavioralQuestionDocument = InferSchemaType<typeof behavioralQuestion>;

export type BehavioralCategory = BehavioralQuestionDocument & {
  questionsCount: number;
};
