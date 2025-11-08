import * as BehavioralQuestionService from '../services/behavioral-question-service.js';
import { Request, Response, NextFunction } from 'express';

export const getBehavioralCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await BehavioralQuestionService.getBehavioralCategories();
    res.status(200).json({
      categories,
      success: true,
      message: 'Behavioral question categories retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getBehavioralQuestionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params;
    const questionData = await BehavioralQuestionService.getBehavioralQuestionById(categoryId);
    res.status(200).json({
      questionData,
      success: true,
      message: 'Behavioral question retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};
