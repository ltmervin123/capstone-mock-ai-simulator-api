import jwt from 'jsonwebtoken';
import { CONFIG } from './constant-value';
const { JWT_SECRET } = CONFIG;
import type { SignOptions } from 'jsonwebtoken';

export function generateToken  (payload: object, options?: SignOptions)  {
  return jwt.sign(payload, JWT_SECRET!, options);
};


export function verifyToken (token: string)  {
  return jwt.verify(token, JWT_SECRET!);
}
