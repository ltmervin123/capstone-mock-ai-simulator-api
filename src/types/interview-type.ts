import { InferSchemaType } from 'mongoose';
import interviewSchema from '../db-schemas/interview-schema.js';

export type InterviewClientDocument = {
  interviewType: 'Basic' | 'Behavioral' | 'Expert';
  studentId: string;
  duration: string;
  numberOfQuestions: number;
  scores: {
    grammar: number;
    experience: number;
    skills: number;
    relevance: number;
    fillerCount: number;
    totalScore: number;
  };
  feedbacks: {
    question: string;
    answer: string;
    areaOfImprovement: string;
    answerFeedback: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type InterviewDocument = InferSchemaType<typeof interviewSchema>;

export type InterviewHistory = {
  interviewType: 'Basic' | 'Behavioral' | 'Expert';
  createdAt: Date;
  duration: string;
  numberOfQuestions: number;
  totalScore: number;
};

export type InterviewConversation = {
  AI: string;
  CANDIDATE: string;
}[];

export type GenerateInterviewFeedbackResult = {
  scores: {
    grammar: number;
    experience: number;
    skills: number;
    relevance: number;
    fillerCount: number;
    totalScore: number;
  };
  areasOfImprovements: string[];
  feedbacks: string[];
};
