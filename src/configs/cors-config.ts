import { CorsOptions } from 'cors';
import { CONFIG } from '../utils/constant-value';
import { ForbiddenError } from '../utils/errors';

const { CLIENT_URL, NODE_ENV } = CONFIG;

export const CORS_OPTIONS: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin && NODE_ENV !== 'development') {
      return callback(new ForbiddenError('Not allowed by CORS'));
    }

    if (origin !== CLIENT_URL && NODE_ENV !== 'development') {
      return callback(new ForbiddenError('Not allowed by CORS'));
    }

    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
