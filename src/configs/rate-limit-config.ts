import rateLimit from 'express-rate-limit';

// This configuration is for the global rate limiter
//Every IP can make up to 100 requests every 15 minutes
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests , please try again later.',
    status: 429,
    name: 'RateLimitExceeded',
  },
});

// This configuration is specifically for authentication routes
//Every IP can make up to 5 authentication attempts every 15 minutes
export const authRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    status: 429,
    name: 'RateLimitExceeded',
  },
});
