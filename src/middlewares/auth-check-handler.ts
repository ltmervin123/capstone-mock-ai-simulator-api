import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../utils/errors';
import { verifyToken } from '../utils/jwt';
import { AuthenticatedUserType } from '../types/auth-type';
import { CONFIG } from '../utils/constant-value';

export const authCheckHandler = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.authToken;

  try {
    if (!token) {
      throw new UnauthorizedError('Authentication token is required.');
    }
    const decoded = verifyToken(token) as AuthenticatedUserType;

    req.user = decoded;
    next();
  } catch (error) {
    const { NODE_ENV } = CONFIG;
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
    });
    next(error);
  }
};
