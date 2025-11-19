import mongoose, { HydratedDocument, Model } from 'mongoose';
import tokenSchema from '../db-schemas/token-schema';
import { InferSchemaType } from 'mongoose';
import { BadRequestError } from '../utils/errors';

type TokenDocument = InferSchemaType<typeof tokenSchema>;

type Purpose = Partial<TokenDocument['purpose']>;

interface TokenInterface extends Model<TokenDocument> {
  createToken(token: string, purpose: Purpose, expiresAt: Date): Promise<void>;
  findToken(token: string, purpose: Purpose): Promise<HydratedDocument<TokenDocument>>;
  deleteToken(token: string, purpose: Purpose): Promise<void>;
}

tokenSchema.statics.createToken = async function (
  token: string,
  purpose: Purpose,
  expiresAt: Date
): Promise<void> {
  await this.create({ token, purpose, expiresAt });
};

tokenSchema.statics.findToken = async function (
  token: string,
  purpose: Purpose
): Promise<HydratedDocument<TokenDocument>> {
  const result = await this.findOne({ token, purpose });

  if (!result) {
    throw new BadRequestError('Invalid or expired token');
  }

  return result;
};

tokenSchema.statics.deleteToken = async function (token: string, purpose: Purpose): Promise<void> {
  await this.deleteOne({ token, purpose });
};

const TokenModel = mongoose.model<TokenDocument, TokenInterface>('Token', tokenSchema, 'tokens');

export default TokenModel;
