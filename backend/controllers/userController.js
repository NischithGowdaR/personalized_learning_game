const User = require('../models/User');

/**
 * @desc    Get user profile details
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error('Get User Profile Error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update user profile details
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email } = req.body;

    // Update name if provided
    if (name) {
      user.name = name.trim();
    }

    // Check if email has changed and perform validation
    if (email && email.trim().toLowerCase() !== user.email.toLowerCase()) {
      const targetEmail = email.trim().toLowerCase();

      // Check format
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(targetEmail)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      // Check if email is already taken by another user
      const emailExists = await User.findOne({ email: targetEmail });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Email is already taken by another user' });
      }

      user.email = targetEmail;
    }

    const updatedUser = await user.save();

    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      level: updatedUser.level,
      totalGames: updatedUser.totalGames,
      totalQuestions: updatedUser.totalQuestions,
      averageScore: updatedUser.averageScore,
      accuracy: updatedUser.accuracy,
      badges: updatedUser.badges,
    });
  } catch (error) {
    console.error('Update User Profile Error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get user earned badges
 * @route   GET /api/users/badges
 * @access  Private
 */
const getUserBadges = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('badges');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user.badges);
  } catch (error) {
    console.error('Get User Badges Error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserBadges,
};
