const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  getUserBadges,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All profile routes are protected

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/badges', getUserBadges);

module.exports = router;
