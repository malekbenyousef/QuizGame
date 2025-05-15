import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
    required: true,
  }],
  correctAnswer: {
    type: Number,
    required: true,
  },
  points: {
    type: Number,
    default: 10,
  },
});

const playerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  answers: [{
    questionIndex: Number,
    answer: Number,
    isCorrect: Boolean,
    timeSpent: Number,
    points: Number,
  }],
});

const gameSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
    unique: true,
  },
  host: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['waiting', 'in-progress', 'completed'],
    default: 'waiting',
  },
  currentQuestion: {
    type: Number,
    default: 0,
  },
  questions: [questionSchema],
  players: [playerSchema],
  startTime: {
    type: Date,
    default: null,
  },
  endTime: Date,
  settings: {
    timePerQuestion: {
      type: Number,
      default: 10,
    },
    showLeaderboard: {
      type: Boolean,
      default: true,
    },
  },
  lastQuestionStartTime: {
    type: Date,
    default: null,
  }
}, {
  timestamps: true,
});

// Generate a unique game ID
gameSchema.pre('save', async function(next) {
  if (!this.gameId) {
    this.gameId = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

export const Game = mongoose.models.Game || mongoose.model('Game', gameSchema); 