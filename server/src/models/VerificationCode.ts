import mongoose from 'mongoose';

const verificationCodeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    purpose: {
      type: String,
      enum: ['login', 'signup'],
      default: 'login',
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Automatically deleted by MongoDB when expired
    },
  },
  {
    timestamps: true,
  }
);

const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema);
export default VerificationCode;

