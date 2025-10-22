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

export type InterviewProgressOverTime = {
  daily: {
    labels: string[];
    data: number[];
  };
  weekly: {
    labels: string[];
    data: number[];
  };
  monthly: {
    labels: string[];
    data: number[];
  };
};

export type InterviewPerformanceBreakdown = {
  grammar: number;
  experience: number;
  skills: number;
  relevance: number;
};

export type InterviewTypeScores = {
  basic: number;
  behavioral: number;
  expert: number;
};

export type InterviewHighestScore = {
  interviewType: string;
  createdAt: Date;
  score: number;
};
