import { NextFunction, Request, Response } from 'express';
import * as StudentService from '../services/student.service';
import { type Student as StudentType } from '../zod-schemas/student.zod.schema';
import { stat } from 'fs';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentData: StudentType = req.body;
    await StudentService.signup(studentData);
    res
      .status(201)
      .json({
        message: 'Student registered successfully. Please verify the email provided.',
        status: 'success',
      });
  } catch (err) {
    next(err);
  }
};
