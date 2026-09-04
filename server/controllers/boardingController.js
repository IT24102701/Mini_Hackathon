function getAllBoardings(req, res) {
  res.json({ message: 'Placeholder: list all boardings' });
}

function getBoardingById(req, res) {
  res.json({
    message: 'Placeholder: get boarding details',
    id: req.params.id,
  });
}

function createBoarding(req, res) {
  res.status(201).json({ message: 'Placeholder: create a boarding' });
}

module.exports = {
  getAllBoardings,
  getBoardingById,
  createBoarding,
};
