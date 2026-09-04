function normalize(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : value;
}

function parseOptionalBoolean(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }

  return undefined;
}

function searchBoardings(boardings, filters = {}) {
  if (!Array.isArray(boardings)) {
    return [];
  }

  const location = normalize(filters.location);
  const roomType = normalize(filters.roomType ?? filters.room_type);
  const gender = normalize(filters.gender ?? filters.genderPreference ?? filters.gender_preference);
  const maxBudget = Number(filters.maxBudget ?? filters.max_budget);
  const wifi = parseOptionalBoolean(filters.wifi);
  const kitchen = parseOptionalBoolean(filters.kitchen);

  return boardings.filter((boarding) => {
    if (location && !normalize(boarding.location).includes(location)) return false;
    if (Number.isFinite(maxBudget) && Number(boarding.monthly_rent) > maxBudget) return false;
    if (roomType && normalize(boarding.room_type) !== roomType) return false;
    if (gender && normalize(boarding.gender_preference) !== gender) return false;
    if (wifi !== undefined && Boolean(boarding.wifi) !== wifi) return false;
    if (kitchen !== undefined && Boolean(boarding.kitchen) !== kitchen) return false;
    return true;
  });
}

module.exports = {
  searchBoardings,
};
