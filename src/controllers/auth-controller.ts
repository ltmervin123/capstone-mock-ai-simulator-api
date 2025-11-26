import e, { NextFunction, Request, Response } from 'express';
import * as StudentService from '../services/student-service';
import * as TokenService from '../services/token-service';
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

    const { _id, firstName, lastName, middleName, program, role, nameExtension } =
      await StudentService.signin(email, password);

    const authToken = generateToken(
      { _id, firstName, lastName, middleName, program, role, email, nameExtension },
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
      user: { _id, firstName, lastName, middleName, program, email, role, nameExtension },
    });
  } catch (err) {
    next(err);
  }
};

export const signout = async (req: Request, res: Response, next: NextFunction) => {
  const { NODE_ENV } = CONFIG;
  const userId = req.user!._id;
  try {
    await StudentService.signout(userId);

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
    user: req.user!,
  });
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  const { newPassword, confirmationPassword, id, token } = req.body as {
    newPassword: string;
    confirmationPassword: string;
    id: string;
    token: string;
  };
  try {
    await StudentService.updatePassword(id, newPassword, confirmationPassword, token);
    res.status(200).json({
      message: 'Account password updated successfuly',
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const sendResetPasswordLink = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body as { email: string };
  try {
    await TokenService.sendResetPasswordLink(email);
    res.status(201).json({
      message: 'Reset password link sent successfully.',
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const verifyResetPasswordToken = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;
  try {
    const decoded = await TokenService.verifyResetPasswordToken(token);
    res.status(200).json({
      message: 'Reset password link sent successfully.',
      success: true,
      userData: decoded,
    });
  } catch (err) {
    next(err);
  }
};
