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
  FilterOptions,
  InterviewPreview,
  InterviewAdminReportDocument,
  TopInterviewPerformers,
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
  getInterviews(filterOptions: FilterOptions): Promise<InterviewPreview[]>;
  getAdminInterviewReports(interviewId: string): Promise<InterviewAdminReportDocument>;
  getTopInterviewPerformers(): Promise<TopInterviewPerformers[]>;
}

interviewSchema.statics.getTopInterviewPerformers = async function (): Promise<
  TopInterviewPerformers[]
> {
  return await this.aggregate([
    {
      $group: {
        _id: '$studentId',
        averageScore: { $avg: '$scores.totalScore' },
        totalInterviews: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'students',
        localField: '_id',
        foreignField: '_id',
        as: 'student',
      },
    },
    { $unwind: '$student' },
    {
      $project: {
        averageScore: { $round: ['$averageScore', 2] },
        totalInterviews: 1,
        student: {
          firstName: '$student.firstName',
          lastName: '$student.lastName',
          middleName: '$student.middleName',
        },
        program: '$student.program',
      },
    },
    { $sort: { averageScore: -1 } },
    {
      $setWindowFields: {
        sortBy: { averageScore: -1 },
        output: {
          rank: { $rank: {} },
        },
      },
    },
    { $limit: 10 },
  ]);
};

interviewSchema.statics.getAdminInterviewReports = async function (
  interviewId: string
): Promise<InterviewAdminReportDocument> {
  const interview = await this.findOne({ _id: interviewId })
    .populate('studentId', 'firstName lastName middleName')
    .select('interviewType duration numberOfQuestions scores feedbacks createdAt')
    .lean();

  if (!interview) {
    throw new NotFoundError('Interview not found');
  }

  return {
    interviewType: interview.interviewType,
    duration: interview.duration,
    numberOfQuestions: interview.numberOfQuestions,
    scores: interview.scores,
    feedbacks: interview.feedbacks,
    createdAt: interview.createdAt,
    student: {
      firstName: interview.studentId.firstName,
      lastName: interview.studentId.lastName,
      middleName: interview.studentId.middleName,
    },
  };
};

/**
 * For future reference read each block comments if modification is needed in this static method
 * What it does: Retrieves interviews based on various filter options such as program, interview type,
 * date range, and score sorting preference. It performs aggregation with lookup to join student data,
 * applies filters, projects necessary fields, and sorts the results accordingly.
 * Default Sort: Newest interviews first, then highest scores as tiebreaker
 *
 * Author: Alvin
 */
interviewSchema.statics.getInterviews = async function (
  filterOptions: FilterOptions
): Promise<InterviewPreview[]> {
  // Initialize empty match stage for MongoDB aggregation filtering
  const matchStage: any = {};

  let sortStage: any = {
    createdAt: -1,
    totalScore: -1,
  };

  if (filterOptions) {
    // Override sort if score filter is explicitly provided
    if (filterOptions.score) {
      // Sort by score: -1 for HIGHEST (desc), 1 for LOWEST (asc)

      sortStage = {
        totalScore: filterOptions.score === 'HIGHEST' ? -1 : 1,
        createdAt: -1,
      };
    }

    // Filter by student's program (e.g., BSBA, BSIT, BSCrim)
    if (filterOptions.program) {
      matchStage['studentId.program'] = filterOptions.program;
    }

    // Filter by interview type (Basic, Behavioral, Expert)
    if (filterOptions.interviewType) {
      matchStage['interviewType'] = filterOptions.interviewType;
    }

    // Filter by date range (from and/or to dates)
    if (filterOptions.dateFrom || filterOptions.dateTo) {
      matchStage['createdAt'] = {};
      // Filter interviews created on or after dateFrom
      if (filterOptions.dateFrom) {
        matchStage['createdAt'].$gte = filterOptions.dateFrom;
      }
      // Filter interviews created on or before dateTo
      if (filterOptions.dateTo) {
        matchStage['createdAt'].$lte = filterOptions.dateTo;
      }
    }
  }

  return await this.aggregate([
    // Stage 1: Join interviews collection with students collection
    {
      $lookup: {
        from: 'students', // Target collection
        localField: 'studentId', // Field in interviews collection
        foreignField: '_id', // Field in students collection
        as: 'studentId', // Output array field name
      },
    },

    // Stage 2: Convert studentId array to single object
    { $unwind: '$studentId' },

    // Stage 3: Apply all filter conditions
    { $match: matchStage },

    // Stage 4: Shape the output document structure
    {
      $project: {
        _id: 1, // Include interview ID
        interviewType: 1, // Include interview type
        createdAt: 1, // Include creation date
        totalScore: '$scores.totalScore', // Extract totalScore from scores object
        program: '$studentId.program', // Extract program from joined student
        studentFullName: {
          // Concatenate student's full name
          $concat: [
            '$studentId.firstName',
            ' ',
            '$studentId.middleName',
            ' ',
            '$studentId.lastName',
          ],
        },
      },
    },

    // Stage 5: Sort results based on sortStage criteria
    { $sort: sortStage },
  ]);
};

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
