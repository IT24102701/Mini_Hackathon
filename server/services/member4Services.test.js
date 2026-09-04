const assert = require('node:assert/strict');
const test = require('node:test');

const { calculateMatchScore, rankBoardings } = require('./matchingService');
const { searchBoardings } = require('./searchService');

const sampleBoardings = [
  { location: 'Malabe', monthly_rent: 22000, room_type: 'Single Room', gender_preference: 'Any', wifi: true, kitchen: true, distance_km: 1.2 },
  { location: 'Kaduwela', monthly_rent: 30000, room_type: 'Annex', gender_preference: 'Female', wifi: false, kitchen: true, distance_km: 4 },
];

test('search filters case-insensitively and accepts query-string booleans', () => {
  const results = searchBoardings(sampleBoardings, { location: 'malabe', maxBudget: '25000', roomType: 'single room', wifi: 'true', kitchen: 'true' });
  assert.equal(results.length, 1);
  assert.equal(results[0].location, 'Malabe');
});

test('match score totals 100 for a complete match', () => {
  assert.equal(calculateMatchScore(sampleBoardings[0], { location: 'malabe', maxBudget: '25000', roomType: 'single room', wifi: 'true', kitchen: 'true', maxDistance: '2' }), 100);
});

test('omitted preferences do not reduce the score and rankings are descending', () => {
  assert.equal(calculateMatchScore(sampleBoardings[0], { location: 'Malabe' }), 100);
  assert.deepEqual(rankBoardings(sampleBoardings, { maxBudget: 25000 }).map((boarding) => boarding.location), ['Malabe', 'Kaduwela']);
});
