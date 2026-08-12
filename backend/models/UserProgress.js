const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    questionsAttempted: {
      type: Number,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    currentDifficulty: {
      type: String,
      default: 'Beginner',
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    lastPlayed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure index for speed queries searching by user, subject, topic
userProgressSchema.index({ userId: 1, subject: 1, topic: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
