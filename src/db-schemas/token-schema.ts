import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
    purpose: { type: String, enum: ['RESET_PASSWORD'], required: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default tokenSchema;
