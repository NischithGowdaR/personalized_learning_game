const express = require('express');
const {
  getProgressOverview,
  getTopicProgress,
  getRecommendations,
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All progress routes are protected

router.get('/', getProgressOverview);
router.get('/topics', getTopicProgress);
router.get('/recommendations', getRecommendations);

module.exports = router;
