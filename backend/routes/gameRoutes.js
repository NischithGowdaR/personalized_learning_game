const express = require('express');
const {
  generateGame,
  getGames,
  getGameById,
  submitGame,
} = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All game routes are protected

router.post('/generate', generateGame);
router.get('/', getGames);
router.get('/:id', getGameById);
router.post('/:id/submit', submitGame);

module.exports = router;
