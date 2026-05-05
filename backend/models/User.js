import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['public', 'government'],
      default: 'public',
    },
    googleId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);