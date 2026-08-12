const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

/**
 * Calculates the next difficulty level based on accuracy.
 * @param {string} currentDifficulty - 'Beginner', 'Intermediate', or 'Advanced'
 * @param {number} accuracy - Accuracy percentage (0 to 100)
 * @returns {string} - The next difficulty level
 */
const determineNextDifficulty = (currentDifficulty, accuracy) => {
  let currentIndex = DIFFICULTIES.indexOf(currentDifficulty);
  if (currentIndex === -1) currentIndex = 0; // Default to Beginner

  if (accuracy >= 80) {
    // Increase difficulty if not already Advanced
    if (currentIndex < DIFFICULTIES.length - 1) {
      return DIFFICULTIES[currentIndex + 1];
    }
  } else if (accuracy < 50) {
    // Decrease difficulty if not already Beginner
    if (currentIndex > 0) {
      return DIFFICULTIES[currentIndex - 1];
    }
  }

  return DIFFICULTIES[currentIndex];
};

/**
 * Assesses the strength of a topic based on accuracy.
 * @param {number} accuracy - Accuracy percentage (0 to 100)
 * @returns {string} - 'Strong', 'Average', or 'Weak'
 */
const assessTopicStrength = (accuracy) => {
  if (accuracy >= 80) {
    return 'Strong';
  } else if (accuracy >= 50) {
    return 'Average';
  } else {
    return 'Weak';
  }
};

module.exports = {
  determineNextDifficulty,
  assessTopicStrength,
  DIFFICULTIES,
};
