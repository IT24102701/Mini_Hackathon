const express = require('express');
const {
  createBoarding,
  getAllBoardings,
  getBoardingById,
} = require('../controllers/boardingController');

const router = express.Router();

router.get('/', getAllBoardings);
router.get('/:id', getBoardingById);
router.post('/', createBoarding);

module.exports = router;
