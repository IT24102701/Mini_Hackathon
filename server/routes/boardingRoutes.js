const express = require('express');
const {
  createBoarding,
  getAllBoardings,
  getBoardingById,
  searchBoardingsByPreferences,
} = require('../controllers/boardingController');
const { validateCreateBoarding } = require('../middleware/validation');

const router = express.Router();

router.get('/', getAllBoardings);
// This must be registered before /:id, otherwise "search" is treated as an ID.
router.get('/search', searchBoardingsByPreferences);
router.get('/:id', getBoardingById);
router.post('/', validateCreateBoarding, createBoarding);

module.exports = router;
