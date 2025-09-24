import { NextFunction, Request, Response } from 'express';
import { makeError } from '../utils/errors';
import logger from '../utils/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  const { statusCode, error } = makeError(err);

  const logData = {
    url: req.url,
    method: req.method,
    ip: req.ip,
    statusCode,
    stack: err.stack,
    name: err.name,
    message: err.message,
  };

  logger.error(`Error: ${error.message}, Status Code: ${statusCode}`, logData);

  if (statusCode === 500) {
    return res.status(statusCode).json({
      name: 'InternalServerError',
      message: 'Something went wrong on the server.',
    });
  }

  return res.status(statusCode).json({
    name: err.name,
    message: err.message,
  });
}
