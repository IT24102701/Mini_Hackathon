const express = require('express');
const {
  createBoarding,
  getAllBoardings,
  getBoardingById,
} = require('../controllers/boardingController');
const { validateCreateBoarding } = require('../middleware/validation');

const router = express.Router();

router.get('/', getAllBoardings);
router.get('/:id', getBoardingById);
router.post('/', validateCreateBoarding, createBoarding);

module.exports = router;
