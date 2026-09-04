function normalize(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : value;
}

function hasPreference(value) {
  return value !== undefined && value !== null && value !== '';
}

function parseOptionalBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  return undefined;
}

function matchesText(actual, expected) {
  return normalize(actual) === normalize(expected);
}

function calculateMatchScore(boarding = {}, preferences = {}) {
  let score = 0;
  const requestedLocation = preferences.location;
  const requestedBudget = preferences.maxBudget ?? preferences.max_budget;
  const requestedRoomType = preferences.roomType ?? preferences.room_type;
  const requestedGender = preferences.gender ?? preferences.genderPreference ?? preferences.gender_preference;
  const requestedWifi = parseOptionalBoolean(preferences.wifi);
  const requestedKitchen = parseOptionalBoolean(preferences.kitchen);
  const rawDistance = preferences.maxDistance ?? preferences.max_distance_km;
  const requestedDistance = Number(rawDistance);
  const hasBudget = hasPreference(requestedBudget) && Number.isFinite(Number(requestedBudget));
  const hasDistance = hasPreference(rawDistance) && Number.isFinite(requestedDistance);

  score += !hasPreference(requestedLocation) || matchesText(boarding.location, requestedLocation) ? 30 : 0;
  score += !hasBudget || Number(boarding.monthly_rent) <= Number(requestedBudget) ? 25 : 0;
  score += !hasPreference(requestedRoomType) || matchesText(boarding.room_type, requestedRoomType) ? 15 : 0;

  if (requestedWifi === undefined || Boolean(boarding.wifi) === requestedWifi) score += 10;
  if (requestedKitchen === undefined || Boolean(boarding.kitchen) === requestedKitchen) score += 10;

  score += !hasDistance || Number(boarding.distance_km) <= requestedDistance ? 10 : 0;

  return Math.max(0, Math.min(100, score));
}

function rankBoardings(boardings, preferences = {}) {
  if (!Array.isArray(boardings)) return [];

  return boardings
    .map((boarding, index) => ({
      ...boarding,
      match_score: calculateMatchScore(boarding, preferences),
      _rankingIndex: index,
    }))
    .sort((first, second) => second.match_score - first.match_score || first._rankingIndex - second._rankingIndex)
    .map(({ _rankingIndex, ...boarding }) => boarding);
}

module.exports = {
  calculateMatchScore,
  rankBoardings,
};
