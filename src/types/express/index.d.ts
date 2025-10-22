import type { AuthenticatedUserType } from '../auth-type';
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUserType;
    }
  }
}
