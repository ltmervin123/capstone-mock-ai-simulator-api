import mongoose, { HydratedDocument, Model, Types } from 'mongoose';
import { NotFoundError } from '../utils/errors';
import interviewSchema from '../db-schemas/interview-schema';
import type {
  InterviewClientDocument as InterviewClientDocumentType,
  InterviewDocument as InterviewDocumentType,
  InterviewHistory as InterviewHistoryType,
  InterviewProgressOverTime as InterviewProgressOverTimeType,
  InterviewPerformanceBreakdown as InterviewPerformanceBreakdownType,
  InterviewTypeScores as InterviewTypeScoresType,
  InterviewHighestScore as InterviewHighestScoreType,
} from '../types/interview-type';
import { DAILY_LABELS, MONTHLY_LABELS, WEEKLY_LABELS } from '../utils/date-labels';

interface InterviewModelInterface extends Model<InterviewDocumentType> {
  createInterview(interviewData: InterviewClientDocumentType): Promise<void>;
  getInterviewDetail(
    interviewId: string,
    studentId: string
  ): Promise<HydratedDocument<InterviewDocumentType>>;
  getInterviewHistory(studentId: string): Promise<InterviewHistoryType[]>;
  getUserExpertInterviewRecentQuestionUsed(studentId: string): Promise<string[]>;
  getUserInterviewsCount(studentId: string): Promise<number>;
  getUserInterviewsAverageScore(studentId: string): Promise<number>;
  getUserInterviewHighestScore(studentId: string): Promise<InterviewHighestScoreType | null>;
  getUserInterviewProgressOverTime(studentId: string): Promise<InterviewProgressOverTimeType>;
  getUserInterviewPerformanceBreakdown(
    studentId: string
  ): Promise<InterviewPerformanceBreakdownType>;
  getUserInterviewTypeScores(studentId: string): Promise<InterviewTypeScoresType>;
  getUserUnViewedInterviewCount(studentId: string): Promise<number>;
  updateUserUnViewedInterviewCount(studentId: string, interviewId: string): Promise<void>;
}
interviewSchema.statics.createInterview = async function (
  interviewData: InterviewClientDocumentType
): Promise<void> {
  await this.create(interviewData);
};

interviewSchema.statics.getInterviewDetail = async function (
  interviewId: string,
  studentId: string
): Promise<HydratedDocument<InterviewDocumentType>> {
  const interview = await this.findOne({ _id: interviewId, studentId }).lean();

  if (!interview) {
    throw new NotFoundError('Interview detail not found');
  }

  return interview;
};

interviewSchema.statics.getInterviewHistory = async function (
  studentId: string
): Promise<InterviewHistoryType[]> {
  return await this.find({ studentId })
    .select({
      _id: 1,
      interviewType: 1,
      duration: 1,
      numberOfQuestions: 1,
      createdAt: 1,
      totalScore: '$scores.totalScore',
      isViewed: 1,
    })
    .sort({ createdAt: -1 })
    .lean();
};

interviewSchema.statics.getUserExpertInterviewRecentQuestionUsed = async function (
  userId: string
): Promise<string[]> {
  type feedbacks = {
    question: string;
  };
  const recentInterview = await this.findOne({ studentId: userId, interviewType: 'Expert' })
    .select('feedbacks')
    .sort({ createdAt: -1 })
    .lean();

  if (!recentInterview) {
    return [];
  }

  return recentInterview.feedbacks.map((feedback: feedbacks) => feedback.question);
};

interviewSchema.statics.getUserInterviewsCount = async function (
  studentId: string
): Promise<number> {
  return await this.countDocuments({ studentId });
};

interviewSchema.statics.getUserInterviewsAverageScore = async function (
  studentId: string
): Promise<number> {
  const result = await this.aggregate([
    { $match: { studentId: new mongoose.Types.ObjectId(studentId) } },
    {
      $group: {
        _id: null,
        averageScore: { $avg: '$scores.totalScore' },
      },
    },
  ]);

  if (result.length === 0) {
    return 0;
  }

  return Math.round(result[0].averageScore);
};

interviewSchema.statics.getUserInterviewHighestScore = async function (
  studentId: string
): Promise<InterviewHighestScoreType | null> {
  const bestInterview = await this.findOne({ studentId })
    .sort({ 'scores.totalScore': -1 })
    .select('interviewType createdAt scores.totalScore')
    .lean();

  if (!bestInterview) {
    return null;
  }

  return {
    interviewType: bestInterview?.interviewType,
    createdAt: bestInterview?.createdAt,
    score: bestInterview?.scores.totalScore,
  };
};

interviewSchema.statics.getUserInterviewProgressOverTime = async function (
  studentId: string
): Promise<InterviewProgressOverTimeType> {
  const interviews = await this.find({ studentId })
    .select({ createdAt: 1, 'scores.totalScore': 1 })
    .lean();

  if (interviews.length === 0) {
    return {
      daily: {
        labels: [],
        data: [],
      },
      weekly: {
        labels: [],
        data: [],
      },
      monthly: {
        labels: [],
        data: [],
      },
    };
  }

  // Maps to accumulate scores
  const dailyMap: Map<number, number[]> = new Map();
  const weeklyMap: Map<number, number[]> = new Map();
  const monthlyMap: Map<number, number[]> = new Map();

  // Initialize maps with empty arrays for each index
  for (let i = 0; i < 24; i++) dailyMap.set(i, []);
  for (let i = 0; i < 7; i++) weeklyMap.set(i, []);
  for (let i = 0; i < 12; i++) monthlyMap.set(i, []);

  interviews.forEach((interview: InterviewDocumentType) => {
    const date = new Date(interview.createdAt!);
    const hour = date.getHours();
    const dayOfWeek = date.getDay();
    const month = date.getMonth();

    dailyMap.get(hour)!.push(interview.scores!.totalScore);
    weeklyMap.get(dayOfWeek)!.push(interview.scores!.totalScore);
    monthlyMap.get(month)!.push(interview.scores!.totalScore);
  });

  // Compute averages, set to 0 if no data
  const dailyData = DAILY_LABELS.map((_, i) => {
    const scores = dailyMap.get(i)!;
    return scores.length > 0
      ? Math.round(scores.reduce((acc, score) => acc + score, 0) / scores.length)
      : 0;
  });

  const weeklyData = WEEKLY_LABELS.map((_, i) => {
    const scores = weeklyMap.get(i)!;
    return scores.length > 0
      ? Math.round(scores.reduce((acc, score) => acc + score, 0) / scores.length)
      : 0;
  });

  const monthlyData = MONTHLY_LABELS.map((_, i) => {
    const scores = monthlyMap.get(i)!;
    return scores.length > 0
      ? Math.round(scores.reduce((acc, score) => acc + score, 0) / scores.length)
      : 0;
  });

  return {
    daily: {
      labels: DAILY_LABELS,
      data: dailyData,
    },
    weekly: {
      labels: WEEKLY_LABELS,
      data: weeklyData,
    },
    monthly: {
      labels: MONTHLY_LABELS,
      data: monthlyData,
    },
  };
};

interviewSchema.statics.getUserInterviewPerformanceBreakdown = async function (
  studentId: string
): Promise<InterviewPerformanceBreakdownType> {
  const result = await this.aggregate([
    { $match: { studentId: new mongoose.Types.ObjectId(studentId) } },
    {
      $group: {
        _id: null,
        avgGrammar: { $avg: '$scores.grammar' },
        avgExperience: { $avg: '$scores.experience' },
        avgSkills: { $avg: '$scores.skills' },
        avgRelevance: { $avg: '$scores.relevance' },
      },
    },
  ]);

  if (result.length === 0) {
    return {
      grammar: 0,
      experience: 0,
      skills: 0,
      relevance: 0,
    };
  }

  return {
    grammar: Math.round(result[0].avgGrammar),
    experience: Math.round(result[0].avgExperience),
    skills: Math.round(result[0].avgSkills),
    relevance: Math.round(result[0].avgRelevance),
  };
};

interviewSchema.statics.getUserInterviewTypeScores = async function (
  studentId: string
): Promise<InterviewTypeScoresType> {
  const result = await this.aggregate([
    { $match: { studentId: new mongoose.Types.ObjectId(studentId) } },
    {
      $group: {
        _id: '$interviewType',
        avgScore: { $avg: '$scores.totalScore' },
      },
    },
  ]);

  const scores: InterviewTypeScoresType = {
    basic: 0,
    behavioral: 0,
    expert: 0,
  };

  result.forEach((item) => {
    scores[item._id.toString().toLowerCase() as keyof InterviewTypeScoresType] = Math.round(
      item.avgScore
    );
  });

  return scores;
};

interviewSchema.statics.getUserUnViewedInterviewCount = async function (
  studentId: string
): Promise<number> {
  return await this.countDocuments({ studentId, isViewed: false });
};

interviewSchema.statics.updateUserUnViewedInterviewCount = async function (
  studentId: string,
  interviewId: string
): Promise<void> {
  await this.updateOne({ studentId, _id: interviewId }, { isViewed: true });
};

const InterviewModel = mongoose.model<InterviewDocumentType, InterviewModelInterface>(
  'Interview',
  interviewSchema
);

export default InterviewModel;
