const UserProgress = require('../models/UserProgress');

/**
 * Generates user-specific recommendations based on historical progress data.
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - An object with recommendation string and prefill game options
 */
const getRecommendation = async (userId) => {
  try {
    // Get all progress for this user
    const progressList = await UserProgress.find({ userId }).sort({ accuracy: 1 }); // Ascending order, lowest accuracy first

    // If no progress, provide a welcoming default starter recommendation
    if (progressList.length === 0) {
      return {
        recommendation: 'Welcome! We recommend launching your first game in Web Development (HTML Basics) at Beginner level to test your skills.',
        subject: 'Web Development',
        topic: 'HTML Basics',
        difficulty: 'Beginner',
        gameType: 'Multiple Choice',
        numQuestions: 10,
        isDefault: true,
      };
    }

    // Find the weakest topic (accuracy < 70%)
    const weakProgress = progressList.find((p) => p.accuracy < 70);

    if (weakProgress) {
      // Suggest practicing at one level below or maintain Beginner
      let suggestedDifficulty = 'Beginner';
      if (weakProgress.currentDifficulty === 'Advanced') {
        suggestedDifficulty = 'Intermediate';
      }

      return {
        recommendation: `Your performance in ${weakProgress.topic} is low (${weakProgress.accuracy}% accuracy). We recommend practicing ${weakProgress.topic} at ${suggestedDifficulty} level.`,
        subject: weakProgress.subject,
        topic: weakProgress.topic,
        difficulty: suggestedDifficulty,
        gameType: 'Multiple Choice',
        numQuestions: 10,
        isDefault: false,
      };
    }

    // If no weak topics exist (accuracy >= 70% for all), recommend leveling up their most played topic
    const highestProgress = [...progressList].sort(
      (a, b) => b.questionsAttempted - a.questionsAttempted
    )[0];

    let nextDifficulty = 'Intermediate';
    if (highestProgress.currentDifficulty === 'Beginner') {
      nextDifficulty = 'Intermediate';
    } else if (highestProgress.currentDifficulty === 'Intermediate') {
      nextDifficulty = 'Advanced';
    } else {
      nextDifficulty = 'Advanced';
    }

    return {
      recommendation: `Great job! You have solid scores in ${highestProgress.topic} (${highestProgress.accuracy}% accuracy). Challenge yourself with ${highestProgress.topic} at ${nextDifficulty} level!`,
      subject: highestProgress.subject,
      topic: highestProgress.topic,
      difficulty: nextDifficulty,
      gameType: 'Multiple Choice',
      numQuestions: 10,
      isDefault: false,
    };
  } catch (error) {
    console.error('Error generating recommendation:', error.message);
    throw error;
  }
};

module.exports = {
  getRecommendation,
};
