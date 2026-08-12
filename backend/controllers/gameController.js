const Game = require('../models/Game');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const { generatePersonalizedQuestions } = require('../services/groqService');
const { determineNextDifficulty } = require('../utils/adaptiveLearning');

/**
 * @desc    Generate a new personalized game
 * @route   POST /api/games/generate
 * @access  Private
 */
const generateGame = async (req, res) => {
  try {
    const { subject, topic, difficulty, gameType, numQuestions } = req.body;
    const userId = req.user._id;

    if (!subject || !topic || !difficulty || !gameType || !numQuestions) {
      return res.status(400).json({ message: 'Please provide all game configuration fields' });
    }

    // 1. Fetch user profile context
    const user = await User.findById(userId);
    
    // 2. Fetch specific topic progress to supply performance history to Groq
    const specificProgress = await UserProgress.findOne({ userId, subject, topic });
    const allProgress = await UserProgress.find({ userId });
    
    // Structure topic history for Groq
    const userHistory = {};
    if (specificProgress) {
      userHistory[topic] = {
        accuracy: specificProgress.accuracy,
        correct: specificProgress.correctAnswers,
        total: specificProgress.questionsAttempted,
      };
    }

    // Determine weak/strong topics across the board to inject into prompt
    const weakTopics = allProgress.filter((p) => p.accuracy < 60).map((p) => p.topic);
    const strongTopics = allProgress.filter((p) => p.accuracy >= 80).map((p) => p.topic);

    // If game difficulty is 'Adaptive', look at specific topic history or fall back to Beginner
    let targetDifficulty = difficulty;
    if (difficulty === 'Adaptive') {
      targetDifficulty = specificProgress ? specificProgress.currentDifficulty : 'Beginner';
    }

    console.log(`Generating personalized game for user ${user.name} on topic: ${topic}. Difficulty style: ${difficulty} (Target: ${targetDifficulty})`);

    // 3. Generate questions using Groq SDK service
    const questions = await generatePersonalizedQuestions({
      subject,
      topic,
      difficulty: targetDifficulty,
      gameType,
      numQuestions: parseInt(numQuestions),
      userHistory,
      userLevel: user.level,
      weakTopics,
      strongTopics,
    });

    // 4. Save game instance to MongoDB
    const game = await Game.create({
      userId,
      subject,
      topic,
      difficulty, // Save selected setting (e.g. Adaptive)
      gameType,
      questions,
      completed: false,
    });

    return res.status(201).json(game);
  } catch (error) {
    console.error('Generate Game Controller Error:', error.message);
    return res.status(500).json({ message: error.message || 'Error generating game questions.' });
  }
};

/**
 * @desc    Get user's game history
 * @route   GET /api/games
 * @access  Private
 */
const getGames = async (req, res) => {
  try {
    const games = await Game.find({ userId: req.user._id, completed: true }).sort({ createdAt: -1 });
    return res.json(games);
  } catch (error) {
    console.error('Get Games Error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get details of a single game
 * @route   GET /api/games/:id
 * @access  Private
 */
const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Verify ownership
    if (game.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this game' });
    }

    return res.json(game);
  } catch (error) {
    console.error('Get Game By ID Error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Submit game results and update user progress + level + badges
 * @route   POST /api/games/:id/submit
 * @access  Private
 */
const submitGame = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body; // answers is an array of strings corresponding to selected options
    const gameId = req.params.id;
    const userId = req.user._id;

    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.completed) {
      return res.status(400).json({ message: 'Game has already been submitted' });
    }

    // Verify ownership
    if (game.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to submit this game' });
    }

    // Calculate score and accuracy
    const questions = game.questions;
    let correctAnswersCount = 0;
    
    // Evaluate correctness of each answer
    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      question.userAnswer = userAnswer || '';
      if (userAnswer && userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()) {
        correctAnswersCount++;
      }
    });

    const totalQuestions = questions.length;
    const wrongAnswersCount = totalQuestions - correctAnswersCount;
    const gameAccuracy = Math.round((correctAnswersCount / totalQuestions) * 100);

    // 1. Update Game document
    game.score = correctAnswersCount;
    game.correctAnswers = correctAnswersCount;
    game.wrongAnswers = wrongAnswersCount;
    game.accuracy = gameAccuracy;
    game.timeTaken = timeTaken || 0;
    game.completed = true;
    game.completedAt = new Date();
    await game.save();

    // 2. Update UserProgress (on a per-topic level)
    let progress = await UserProgress.findOne({
      userId,
      subject: game.subject,
      topic: game.topic,
    });

    const oldDifficulty = progress ? progress.currentDifficulty : 'Beginner';

    if (!progress) {
      progress = new UserProgress({
        userId,
        subject: game.subject,
        topic: game.topic,
        questionsAttempted: totalQuestions,
        correctAnswers: correctAnswersCount,
        accuracy: gameAccuracy,
        currentDifficulty: 'Beginner', // Start point
      });
    } else {
      progress.questionsAttempted += totalQuestions;
      progress.correctAnswers += correctAnswersCount;
      progress.accuracy = Math.round(
        (progress.correctAnswers / progress.questionsAttempted) * 100
      );
    }

    // Run Adaptive Learning engine: Adjust topic difficulty based on this game's accuracy
    progress.currentDifficulty = determineNextDifficulty(oldDifficulty, gameAccuracy);
    progress.lastPlayed = new Date();
    await progress.save();

    // 3. Update overall user stats, calculate level-ups & badges
    const user = await User.findById(userId);

    // Fetch all completed games to calculate true historical statistics
    const allCompletedGames = await Game.find({ userId, completed: true });
    
    const totalGames = allCompletedGames.length;
    const totalQuestionsSum = allCompletedGames.reduce((sum, g) => sum + g.questions.length, 0);
    const totalCorrectSum = allCompletedGames.reduce((sum, g) => sum + g.correctAnswers, 0);
    const overallAccuracy = totalQuestionsSum > 0 ? Math.round((totalCorrectSum / totalQuestionsSum) * 100) : 0;
    
    // Average score: total correct answers / total games (or average accuracy)
    const averageScore = totalGames > 0 ? parseFloat((totalCorrectSum / totalGames).toFixed(1)) : 0;

    user.totalGames = totalGames;
    user.totalQuestions = totalQuestionsSum;
    user.averageScore = averageScore;
    user.accuracy = overallAccuracy;

    // Gamification - Badges logic
    const newBadges = [...user.badges];

    if (totalGames >= 1 && !newBadges.includes('🎯 First Game')) {
      newBadges.push('🎯 First Game');
    }
    if (totalGames >= 5 && !newBadges.includes('🔥 5 Games Completed')) {
      newBadges.push('🔥 5 Games Completed');
    }
    if (totalGames >= 10 && !newBadges.includes('🏆 10 Games Completed')) {
      newBadges.push('🏆 10 Games Completed');
    }
    if (gameAccuracy >= 90 && !newBadges.includes('🧠 90% Accuracy')) {
      newBadges.push('🧠 90% Accuracy');
    }
    
    // Fast Learner badge: Completed a game with >= 5 questions in under 10 seconds per question average
    if (totalQuestions >= 5 && (game.timeTaken / totalQuestions) <= 10 && !newBadges.includes('⚡ Fast Learner')) {
      newBadges.push('⚡ Fast Learner');
    }
    user.badges = newBadges;

    // Gamification - Level logic
    // Level 1: Starter
    // Level 2: Learner (1+ games)
    // Level 3: Intermediate (3+ games)
    // Level 4: Advanced (7+ games)
    // Level 5: Expert (12+ games AND average accuracy >= 80%)
    let currentLevel = 1;
    if (totalGames >= 12 && overallAccuracy >= 80) {
      currentLevel = 5;
    } else if (totalGames >= 7) {
      currentLevel = 4;
    } else if (totalGames >= 3) {
      currentLevel = 3;
    } else if (totalGames >= 1) {
      currentLevel = 2;
    }
    user.level = currentLevel;

    await user.save();

    return res.json({
      game,
      levelUp: user.level > req.user.level,
      currentLevel: user.level,
      unlockedBadges: newBadges.filter(b => !req.user.badges.includes(b)),
    });
  } catch (error) {
    console.error('Submit Game Error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateGame,
  getGames,
  getGameById,
  submitGame,
};
