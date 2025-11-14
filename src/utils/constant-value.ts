import dotenv from 'dotenv';
dotenv.config();

interface DatabaseConfig {
  USERNAME: string | undefined;
  PASSWORD: string | undefined;
  NAME: string | undefined;
  URL: string | undefined;
}

interface GoogleConfig {
  SERVICE_CREDENTIAL: string | undefined;
}

interface EmailService {
  EMAIL: string | undefined;
  PASSWORD: string | undefined;
  PORT?: string | undefined;
  HOST?: string | undefined;
  BREVO_API_KEY?: string | undefined;
}

interface RedisConfig {
  HOST: string | undefined;
  PORT: string | undefined;
  PASSWORD: string | undefined;
}

interface Constants {
  PORT: string | undefined;
  API_URL: string | undefined;
  CLIENT_URL: string | undefined;
  ANTHROPIC_API_KEY: string | undefined;
  DATABASE: DatabaseConfig;
  JWT_SECRET: string | undefined;
  NODE_ENV: string | undefined;
  GOOGLE: GoogleConfig;
  EMAIL_SERVICE: EmailService;
  REDIS: RedisConfig;
}

export const CONFIG: Constants = {
  PORT: process.env.PORT,
  API_URL: process.env.API_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  DATABASE: {
    USERNAME: process.env.DATABASE_USERNAME,
    PASSWORD: process.env.DATABASE_PASSWORD,
    NAME: process.env.DATABASE_NAME,
    URL: process.env.MONGODB_URL,
  },
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,

  GOOGLE: {
    SERVICE_CREDENTIAL: process.env.GOOGLE_SERVICE_CREDENTIALS,
  },
  EMAIL_SERVICE: {
    EMAIL: process.env.EMAIL_USER,
    PASSWORD: process.env.EMAIL_PASSWORD,
    HOST: process.env.EMAIL_HOST,
    PORT: process.env.EMAIL_PORT,
    BREVO_API_KEY: process.env.BREVO_API_KEY,
  },
  REDIS: {
    HOST: process.env.REDIS_HOST,
    PORT: process.env.REDIS_PORT,
    PASSWORD: process.env.REDIS_PASSWORD,
  },
};
