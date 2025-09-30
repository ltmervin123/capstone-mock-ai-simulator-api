import { NextFunction, Request, Response } from 'express';
import * as StudentService from '../services/student-service';
import { type Student as StudentType } from '../zod-schemas/student-zod-schema';
import { type VerifyEmailPayload as VerifyEmailPayloadType } from '../types/student-type';
import { type SigninPayload as SigninPayloadType } from '../zod-schemas/auth-zod-schema';
import { generateToken } from '../utils/jwt';
import { CONFIG } from '../utils/constant-value';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentData: StudentType = req.body;
    await StudentService.signup(studentData);
    res.status(201).json({
      message: 'Student registered successfully. Please verify the email provided.',
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, id } = req.body as VerifyEmailPayloadType;
    await StudentService.verifyEmail(id);
    res.status(201).json({
      message: 'Email successfully verified.',
      data: { email },
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  const { NODE_ENV } = CONFIG;
  try {
    const { email, password } = req.body as SigninPayloadType;

    const { _id, firstName, lastName, middleName, program, role } = await StudentService.signin(
      email,
      password
    );

    const authToken = generateToken(
      { _id, firstName, lastName, middleName, program, role },
      { expiresIn: '1d' }
    );

    res.cookie('authToken', authToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: 'Sign in successfully.',
      success: true,
      data: { _id, firstName, lastName, middleName, program, email, role },
    });
  } catch (err) {
    next(err);
  }
};

export const signout = async (req: Request, res: Response, next: NextFunction) => {
  const { NODE_ENV } = CONFIG;
  try {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.status(200).json({
      status: true,
      message: 'Sign out successfully.',
    });
  } catch (err) {
    next(err);
  }
};

export const me = async (req: Request, res: Response) => {
  res.status(200).json({
    status: true,
    message: 'User authenticated successfully.',
    data: req.user!,
  });
};
