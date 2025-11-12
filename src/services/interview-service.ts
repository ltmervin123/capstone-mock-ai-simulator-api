import QueueService from '../queue';
import { type GenerateInterviewFeedbackPayload } from '../zod-schemas/interview-zod-schema';
import * as Prompt from '../utils/prompt';
import * as Claude from '../third-parties/anthropic';
import InterviewModel from '../models/interview-model';
import QuestionConfigModel from '../models/question-config-model';
import { parseFile } from '../utils/parse-file';
import { BadRequestError } from '../utils/errors';

export const makeInterviewFeedback = async (
  studentId: string,
  payload: GenerateInterviewFeedbackPayload
) => {
  await QueueService.getInstance('claude-service').addJob('generate-interview-feedback', {
    studentId,
    payload,
  });
};

export const getInterviewHistory = async (studentId: string) => {
  return await InterviewModel.getInterviewHistory(studentId);
};

export const getInterviewDetail = async (interviewId: string, studentId: string) => {
  return await InterviewModel.getInterviewDetail(interviewId, studentId);
};

export const expertInterviewQuestions = async (
  file: Express.Multer.File,
  userId: string,
  jobTitle: string
) => {
  const [resumeData, previousQuestions] = await Promise.all([
    parseFile(file),
    InterviewModel.getUserExpertInterviewRecentQuestionUsed(userId),
  ]);
  const { numberOfQuestionToGenerate } = await QuestionConfigModel.getQuestionByType('EXPERT');

  const prompt = Prompt.expertInterviewQuestions({
    resumeData,
    previousQuestions,
    jobTitle,
    numberOfQuestionToGenerate,
  });

  const model = Claude.MODEL_LIST.questionGeneration;
  const response = await Claude.chat(prompt, model);
  const { isResumeValid, questions }: { questions?: string[]; isResumeValid?: boolean } =
    JSON.parse(response);

  if (!isResumeValid) {
    throw new BadRequestError(
      'The uploaded resume is not valid. Please upload a proper resume file.'
    );
  }

  return questions;
};

export const getUserDashboardStat = async (studentId: string) => {
  const [
    interviewsCount,
    averageScores,
    highestScores,
    progressOverTime,
    performanceBreakDown,
    interviewTypeScores,
  ] = await Promise.all([
    InterviewModel.getUserInterviewsCount(studentId),
    InterviewModel.getUserInterviewsAverageScore(studentId),
    InterviewModel.getUserInterviewHighestScore(studentId),
    InterviewModel.getUserInterviewProgressOverTime(studentId),
    InterviewModel.getUserInterviewPerformanceBreakdown(studentId),
    InterviewModel.getUserInterviewTypeScores(studentId),
  ]);

  return {
    interviewsCount,
    averageScores,
    highestScores,
    progressOverTime,
    performanceBreakDown,
    interviewTypeScores,
  };
};

export const getUserUnViewedInterviewCount = async (studentId: string) => {
  return await InterviewModel.getUserUnViewedInterviewCount(studentId);
};

export const updateUserUnViewedInterviewCount = async (studentId: string, interviewId: string) => {
  await InterviewModel.updateUserUnViewedInterviewCount(studentId, interviewId);
};

export const getQuestionConfig = async () => {
  return await QuestionConfigModel.getQuestionConfig();
};
