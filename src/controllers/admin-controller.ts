import * as AdminService from '../services/admin-service';
import { Request, Response, NextFunction } from 'express';
import {
  ResolveStudentApplicationPayload,
  QuestionConfigParams,
  InterviewFilterParams,
} from '../zod-schemas/admin-zod-schema';
import {
  BehavioralQuestionIdWithNumberOfQuestionsSchema,
  BehavioralQuestionSchema,
} from '../zod-schemas/behavioral-question-zod-schema';

export const getAdminDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await AdminService.getAdminDashboardStats();

    res.status(200).json({
      message: 'Admin dashboard stats fetched successfully.',
      success: true,
      stats,
    });
  } catch (err) {
    next(err);
  }
};

export const getPendingStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pendingStudents = await AdminService.getPendingStudents();

    res.status(200).json({
      message: 'Pending students fetched successfully.',
      success: true,
      pendingStudents,
    });
  } catch (err) {
    next(err);
  }
};

export const getAcceptedStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const acceptedStudents = await AdminService.getAcceptedStudents();

    res.status(200).json({
      message: 'Accepted students fetched successfully.',
      success: true,
      acceptedStudents,
    });
  } catch (err) {
    next(err);
  }
};

export const resolveStudentApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, action } = req.body as ResolveStudentApplicationPayload;

    await AdminService.resolveStudentApplication(id, action);

    res.status(200).json({
      message: `Student application has been ${action === 'ACCEPT' ? 'accepted' : 'rejected'} successfully.`,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const getBehavioralCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await AdminService.getBehavioralCategories();

    res.status(200).json({
      message: `Behavioral question categories fetched successfully.`,
      categories,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const getBehavioralQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params;
    const category = await AdminService.getBehavioralQuestion(categoryId);
    res.status(200).json({
      message: `Behavioral question category fetched successfully.`,
      category,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const updateBehavioralQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params;
    const questionData = req.body as BehavioralQuestionSchema;
    await AdminService.updateBehavioralQuestion(categoryId, questionData);
    res.status(200).json({
      message: `Behavioral question category updated successfully.`,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteBehavioralQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params;

    await AdminService.deleteBehavioralQuestion(categoryId);
    res.status(200).json({
      message: `Behavioral question category deleted successfully.`,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const updateBehavioralCategoryNumberOfQuestionsToBeAnswered = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId, numberOfQuestions } = res.locals
      .validatedParams as BehavioralQuestionIdWithNumberOfQuestionsSchema;

    await AdminService.updateBehavioralCategoryNumberOfQuestionsToBeAnswered(
      categoryId,
      numberOfQuestions
    );
    res.status(200).json({
      message: `Behavioral question category updated successfully.`,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const addCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questionData = req.body as BehavioralQuestionSchema;

    await AdminService.addCategory(questionData);
    res.status(200).json({
      message: `Behavioral question category updated successfully.`,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const getQuestionConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questionConfigs = await AdminService.getQuestionConfig();
    res.status(200).json({
      message: `Behavioral question category updated successfully.`,
      success: true,
      questionConfigs,
    });
  } catch (err) {
    next(err);
  }
};

export const updateQuestionConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, numberOfQuestions } = res.locals as QuestionConfigParams;

    await AdminService.updateQuestionConfig(id, numberOfQuestions);

    res.status(200).json({
      message: `Behavioral question category updated successfully.`,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const getInterviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filterOptions = res.locals.filters as InterviewFilterParams;

    const interviews = await AdminService.getInterviews(filterOptions);

    res.status(200).json({
      message: 'Interviews fetched successfully.',
      success: true,
      interviews,
    });
  } catch (err) {
    next(err);
  }
};
