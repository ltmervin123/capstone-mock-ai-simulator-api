import { AdminDashboardStatsType } from '../types/admin-type';
import StudentModel from '../models/student.model';
import BehavioralModel from '../models/behavioral-question-model';
import QuestionConfigModel from '../models/question-config-model';
import InterviewModel from '../models/interview-model';
import {
  generateAccountApprovedEmailTemplate,
  generateAccountRejectedEmailTemplate,
} from '../utils/email-template';
import { getClientURL } from '../utils/url';
import QueueService from '../queue';
import { BehavioralQuestionSchema } from '../zod-schemas/behavioral-question-zod-schema';
import { FilterOptions, InterviewTypes } from '../types/interview-type';
import { StudentFilterParams } from '../zod-schemas/admin-zod-schema';
import { BadRequestError } from '../utils/errors';
import { INTERVIEWS } from '../utils/constant-value';

export const getAdminDashboardStats = async (): Promise<AdminDashboardStatsType> => {
  const [
    totalVerifiedStudents,
    monthlyNewStudents,
    totalPendingStudents,
    dailyNewPendingStudents,
    studentsCountsByProgram,
    authenticatedStudents,
    overallRanking,
    basicRanking,
    behavioralRanking,
    expertRanking,
  ] = await Promise.all([
    StudentModel.getAllCountsOfVerifiedStudents(),
    StudentModel.getMonthlyIncrementedStudentCount(),
    StudentModel.getAllCountsOfPendingStudents(),
    StudentModel.getDailyIncreasedOfPendingStudents(),
    StudentModel.getCountsOfStudentsByProgram(),
    StudentModel.getCountsOfAuthenticatedStudents(),
    InterviewModel.getOverallRanking(),
    InterviewModel.getRankingByInterviewType(INTERVIEWS.BASIC as InterviewTypes),
    InterviewModel.getRankingByInterviewType(INTERVIEWS.BEHAVIORAL as InterviewTypes),
    InterviewModel.getRankingByInterviewType(INTERVIEWS.EXPERT as InterviewTypes),
  ]);

  return {
    totalVerifiedStudents,
    monthlyNewStudents,
    totalPendingStudents,
    dailyNewPendingStudents,
    studentsCountsByProgram,
    authenticatedStudents,
    overallRanking,
    basicRanking,
    behavioralRanking,
    expertRanking,
  };
};

export const getPendingStudents = async (filterOptions: StudentFilterParams) => {
  return await StudentModel.getPendingStudents(filterOptions);
};

export const getAcceptedStudents = async (filterOptions: StudentFilterParams) => {
  return await StudentModel.getAcceptedStudents(filterOptions);
};

export const resolveStudentApplication = async (
  id: string,
  action: 'ACCEPT' | 'REJECT'
): Promise<void> => {
  const link = getClientURL();

  const emailData = {
    to: '',
    subject: '',
    html: '',
  };

  if (action === 'ACCEPT') {
    const acceptedStudent = await StudentModel.acceptStudent(id);
    emailData.to = acceptedStudent.email;
    emailData.subject = 'Your Application has been Accepted';
    emailData.html = generateAccountApprovedEmailTemplate(acceptedStudent.firstName, link);
  }

  if (action === 'REJECT') {
    const rejectedStudent = await StudentModel.rejectStudent(id);
    emailData.to = rejectedStudent.email;
    emailData.subject = 'Your Application has been Rejected';
    emailData.html = generateAccountRejectedEmailTemplate(rejectedStudent.firstName, link);
  }

  await QueueService.getInstance('email-service').addJob('send-email', emailData);
};

export const getBehavioralCategories = async () => {
  return await BehavioralModel.getBehavioralCategoriesWithQuestionsCounts();
};

export const getBehavioralQuestion = async (categoryId: string) => {
  return await BehavioralModel.getBehavioralQuestion(categoryId);
};

export const updateBehavioralQuestion = async (
  categoryId: string,
  questionData: BehavioralQuestionSchema
) => {
  await BehavioralModel.updateBehavioralQuestion(categoryId, questionData);
};

export const deleteBehavioralQuestion = async (categoryId: string) => {
  await BehavioralModel.deleteBehavioralQuestion(categoryId);
};

export const updateBehavioralCategoryNumberOfQuestionsToBeAnswered = async (
  categoryId: string,
  numberOfQuestions: number
) => {
  await BehavioralModel.updateBehavioralCategoryNumberOfQuestionsToBeAnswered(
    categoryId,
    numberOfQuestions
  );
};

export const addCategory = async (questionData: BehavioralQuestionSchema) => {
  await BehavioralModel.addCategory(questionData);
};

export const getQuestionConfig = async () => {
  return await QuestionConfigModel.getQuestionConfig();
};

export const updateQuestionConfig = async (id: string, numberOfQuestionToGenerate: number) => {
  await QuestionConfigModel.updateQuestionConfig(id, numberOfQuestionToGenerate);
};

export const getInterviews = async (filterOptions: FilterOptions) => {
  return await InterviewModel.getInterviews(filterOptions);
};

export const getAdminInterviewReports = async (interviewId: string) => {
  return await InterviewModel.getAdminInterviewReports(interviewId);
};

export const updateAdminEmail = async (id: string, newEmail: string, confirmationEmail: string) => {
  if (newEmail !== confirmationEmail) {
    throw new BadRequestError('New email and confirmation email is not match');
  }
  await StudentModel.updateAdminEmail(id, newEmail);
};
