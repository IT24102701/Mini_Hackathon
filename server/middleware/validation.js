const ROOM_TYPES = ['Single Room', 'Shared Room', 'Annex'];
const GENDER_PREFERENCES = ['Male', 'Female', 'Any'];
const SRI_LANKAN_MOBILE_REGEX = /^(?:\+94|0)7\d{8}$/;

function sanitizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function sanitizeOptionalText(value) {
  if (value == null) {
    return '';
  }

  return typeof value === 'string' ? value.trim() : String(value).trim();
}

function sanitizePhoneNumber(value) {
  return sanitizeText(value).replace(/[\s-]/g, '');
}

function sanitizeBoolean(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }

  return Boolean(value);
}

function validateCreateBoarding(req, res, next) {
  const title = sanitizeText(req.body.title);
  const location = sanitizeText(req.body.location);
  const district = sanitizeText(req.body.district);
  const roomType = sanitizeText(req.body.room_type);
  const genderPreference = sanitizeText(req.body.gender_preference);
  const contactNumber = sanitizePhoneNumber(req.body.contact_number);
  const description = sanitizeOptionalText(req.body.description);

  const monthlyRent = Number(req.body.monthly_rent);
  const rawDistance = req.body.distance_km;
  const distanceKm =
    rawDistance === '' || rawDistance == null ? null : Number(rawDistance);

  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a title for the boarding.',
    });
  }

  if (!location) {
    return res.status(400).json({
      success: false,
      message: 'Please provide the boarding location.',
    });
  }

  if (!district) {
    return res.status(400).json({
      success: false,
      message: 'Please provide the district.',
    });
  }

  if (!Number.isFinite(monthlyRent) || monthlyRent <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Monthly rent must be a number greater than 0.',
    });
  }

  if (!roomType) {
    return res.status(400).json({
      success: false,
      message: 'Please provide the room type.',
    });
  }

  if (!ROOM_TYPES.includes(roomType)) {
    return res.status(400).json({
      success: false,
      message: 'Room type must be Single Room, Shared Room, or Annex.',
    });
  }

  if (!genderPreference) {
    return res.status(400).json({
      success: false,
      message: 'Please provide the gender preference.',
    });
  }

  if (!GENDER_PREFERENCES.includes(genderPreference)) {
    return res.status(400).json({
      success: false,
      message: 'Gender preference must be Male, Female, or Any.',
    });
  }

  if (!contactNumber) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a contact number.',
    });
  }

  if (!SRI_LANKAN_MOBILE_REGEX.test(contactNumber)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid Sri Lankan mobile number.',
    });
  }

  if (distanceKm !== null && (!Number.isFinite(distanceKm) || distanceKm < 0)) {
    return res.status(400).json({
      success: false,
      message: 'Distance must be a number greater than or equal to 0.',
    });
  }

  req.validatedBoarding = {
    title,
    location,
    district,
    monthly_rent: monthlyRent,
    room_type: roomType,
    gender_preference: genderPreference,
    contact_number: contactNumber,
    wifi: sanitizeBoolean(req.body.wifi),
    kitchen: sanitizeBoolean(req.body.kitchen),
    attached_bathroom: sanitizeBoolean(req.body.attached_bathroom),
    parking: sanitizeBoolean(req.body.parking),
    distance_km: distanceKm,
    description,
  };

  next();
}

module.exports = {
  validateCreateBoarding,
};
