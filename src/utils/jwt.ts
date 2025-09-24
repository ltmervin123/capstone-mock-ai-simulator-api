import jwt from 'jsonwebtoken';
import { CONFIG } from './constant-value';
const { JWT_SECRET } = CONFIG;

export const verificationToken = (email: string) => {
  return jwt.sign({ email }, JWT_SECRET!, { expiresIn: '1d' });
};
