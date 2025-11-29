import { Request, Response, NextFunction } from 'express';
import { deepSanitize } from '../utils/sanitizer';

/**
 * Middleware to sanitize incoming request data
 * Sanitizes request body, query parameters, and URL parameters
 */
export const sanitizeRequest = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Sanitize request body
    if (req.body && Object.keys(req.body).length > 0) {
      req.body = deepSanitize(req.body) as typeof req.body;
    }

    // Sanitize query parameters
    if (req.query && Object.keys(req.query).length > 0) {
      req.query = deepSanitize(req.query) as typeof req.query;
    }

    // Sanitize URL parameters
    if (req.params && Object.keys(req.params).length > 0) {
      req.params = deepSanitize(req.params) as typeof req.params;
    }

    next();
  } catch (error) {
    next(error);
  }
};
