import { ZodError } from 'zod';

const StatusCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
    this.message = message;
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
    this.message = message;
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
    this.message = message;
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.message = message;
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
    this.message = message;
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
    this.message = message;
  }
}

export class ExternalServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExternalServiceError';
    this.message = message;
  }
}

export function makeError<TError extends Error>(error: TError) {
  const defaultError = {
    name: error.name,
    message: error.message,
  };

  /* Custom Errors */
  if (error.message.includes('Malformed JSON')) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      error: { name: 'BadRequestError', message: error.message },
    };
  }

  if (error.message.includes('jwt malformed') || error.message.includes('invalid signature')) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      error: { name: 'BadRequestError', message: 'Invalid token' },
    };
  }

  if (error.message.includes('jwt expired')) {
    return {
      statusCode: StatusCodes.UNAUTHORIZED,
      error: { name: 'UnauthorizedError', message: 'Token expired' },
    };
  }

  if (error instanceof BadRequestError) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      error: defaultError,
    };
  }

  if (error instanceof UnauthorizedError) {
    return {
      statusCode: StatusCodes.UNAUTHORIZED,
      error: defaultError,
    };
  }

  if (error instanceof ForbiddenError) {
    return {
      statusCode: StatusCodes.FORBIDDEN,
      error: defaultError,
    };
  }

  if (error instanceof NotFoundError) {
    return {
      statusCode: StatusCodes.NOT_FOUND,
      error: defaultError,
    };
  }

  if (error instanceof ConflictError) {
    return {
      statusCode: StatusCodes.CONFLICT,
      error: defaultError,
    };
  }

  if (error instanceof DatabaseError) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      error: defaultError,
    };
  }

  if (error instanceof ExternalServiceError) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      error: defaultError,
    };
  }

  /* Library Errors */
  if (error instanceof ZodError) {
    /* Mostly for Controller's Payload Validation */
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      error: {
        ...defaultError,
        issues: error.issues,
      },
    };
  }

  return {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    error: defaultError,
  };
}
