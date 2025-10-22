import { CONFIG } from './constant-value';
const { CLIENT_URL, API_URL } = CONFIG;

export const verificationURL = (token: string): string => {
  return `${CLIENT_URL}/verify-email?token=${token}`;
};
