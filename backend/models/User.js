import mongoose from 'mongoose';

const sessionLogSchema = new mongoose.Schema({
  id: String,
  scenarioId: String,
  title: String,
  date: String,
  exchanges: { type: Number, default: 1 },
  durationMin: { type: Number, default: 1 },
  notes: String
}, { timestamps: true });

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required']
    },
    avatar: {
      type: String,
      default: '🌸'
    },
    totalMessagesSent: {
      type: Number,
      default: 0
    },
    totalTimeSpentMinutes: {
      type: Number,
      default: 0
    },
    completedSessionsCount: {
      type: Number,
      default: 0
    },
    sessionLogs: [sessionLogSchema],
    preferences: {
      soundVolume: { type: Number, default: 70 },
      readingEase: { type: Boolean, default: false }
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
