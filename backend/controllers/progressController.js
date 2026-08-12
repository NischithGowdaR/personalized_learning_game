const UserProgress = require('../models/UserProgress');
const Game = require('../models/Game');
const User = require('../models/User');
const { getRecommendation } = require('../services/recommendationService');

/**
 * @desc    Get overall student progress data and analytics history
 * @route   GET /api/progress
 * @access  Private
 */
const getProgressOverview = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Get user profile metrics
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Fetch all completed games to construct score-over-time charts
    const completedGames = await Game.find({ userId, completed: true })
      .sort({ createdAt: 1 }) // Chronological order
      .select('createdAt score accuracy subject topic questions');

    // Format score history for charts (e.g. date, score, accuracy)
    const scoreHistory = completedGames.map((game) => ({
      gameId: game._id,
      date: new Date(game.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
      score: game.score,
      totalQuestions: game.questions.length,
      accuracy: game.accuracy,
      topic: game.topic,
    }));

    // 3. Fetch topic progress to identify strong vs. weak domains
    const progressList = await UserProgress.find({ userId });
    
    const strongTopics = progressList
      .filter((p) => p.accuracy >= 80)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 5)
      .map((p) => ({ topic: p.topic, accuracy: p.accuracy }));

    const weakTopics = progressList
      .filter((p) => p.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5)
      .map((p) => ({ topic: p.topic, accuracy: p.accuracy }));

    return res.json({
      level: user.level,
      totalGames: user.totalGames,
      totalQuestions: user.totalQuestions,
      averageScore: user.averageScore,
      accuracy: user.accuracy,
      badges: user.badges,
      strongTopics,
      weakTopics,
      scoreHistory,
      topicProgress: progressList.map((p) => ({
        topic: p.topic,
        subject: p.subject,
        accuracy: p.accuracy,
        attempts: p.questionsAttempted,
        correct: p.correctAnswers,
        difficulty: p.currentDifficulty,
      })),
    });
  } catch (error) {
    console.error('Get Progress Overview Error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get topic-wise accuracy metrics
 * @route   GET /api/progress/topics
 * @access  Private
 */
const getTopicProgress = async (req, res) => {
  try {
    const topics = await UserProgress.find({ userId: req.user._id }).sort({ accuracy: -1 });
    return res.json(topics);
  } catch (error) {
    console.error('Get Topic Progress Error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get adaptive recommendations
 * @route   GET /api/progress/recommendations
 * @access  Private
 */
const getRecommendations = async (req, res) => {
  try {
    const recommendationData = await getRecommendation(req.user._id);
    return res.json(recommendationData);
  } catch (error) {
    console.error('Get Recommendations Error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProgressOverview,
  getTopicProgress,
  getRecommendations,
};
