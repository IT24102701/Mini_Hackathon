import { useEffect, useState } from 'react';
import BoardingCard from '../components/BoardingCard';
import api from '../services/api';

const locations = ['Malabe', 'Kaduwela', 'Battaramulla', 'Rajagiriya', 'Nugegoda', 'Maharagama', 'Homagama', 'Colombo'];
const roomTypes = ['Single Room', 'Shared Room', 'Annex'];
const genderPreferences = ['Male', 'Female', 'Any'];
const emptyFilters = { location: '', maxBudget: '', roomType: '', gender: '', wifi: false, kitchen: false };

function getBoardings(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.boardings)) return data.boardings;
  return Array.isArray(data?.data) ? data.data : [];
}

function getErrorMessage(error, fallback) {
  const data = error.response?.data;
  return data?.message || data?.error || fallback;
}

function validateFilters(filters) {
  const errors = {};

  if (filters.location && !locations.includes(filters.location)) {
    errors.location = 'Please select a listed location or choose Any location.';
  }

  if (filters.maxBudget !== '') {
    const maxBudget = Number(filters.maxBudget);
    if (!Number.isFinite(maxBudget) || maxBudget <= 0) {
      errors.maxBudget = 'Maximum budget must be greater than Rs. 0.';
    }
  }

  if (filters.roomType && !roomTypes.includes(filters.roomType)) {
    errors.roomType = 'Please select a valid room type.';
  }

  if (filters.gender && !genderPreferences.includes(filters.gender)) {
    errors.gender = 'Please select a valid gender preference.';
  }

  return errors;
}

function FindBoarding() {
  const [filters, setFilters] = useState(emptyFilters);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    let active = true;

    api.get('/boardings')
      .then(({ data }) => { if (active) setResults(getBoardings(data)); })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError, 'We could not load boardings right now. Please try again shortly.'));
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, []);

  function change(event) {
    const { name, type, checked, value } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;
    setFilters((current) => ({ ...current, [name]: nextValue }));
    if (validationErrors[name]) {
      setValidationErrors((current) => {
        const next = { ...current };
        delete next[name];
        return next;
      });
    }
  }

  function validateField(event) {
    const { name } = event.target;
    const fieldErrors = validateFilters(filters);
    setValidationErrors((current) => ({ ...current, [name]: fieldErrors[name] }));
  }

  async function search(event) {
    event.preventDefault();
    const nextErrors = validateFilters(filters);
    setValidationErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const params = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== '' && value !== false)
    );

    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/boardings/search', { params });
      setResults(getBoardings(data));
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'We could not search boardings right now. Please try again shortly.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="find-page content-width">
      <section className="find-heading">
        <p className="eyebrow eyebrow-dark">Browse boardings</p>
        <h1>Find a place that fits.</h1>
        <p>Start with your preferred area, budget, and essentials.</p>
      </section>
      <form className="search-form" onSubmit={search} noValidate>
        <div className="form-grid">
          <label>Location
            <select name="location" value={filters.location} onChange={change} onBlur={validateField} aria-invalid={Boolean(validationErrors.location)} aria-describedby={validationErrors.location ? 'location-error' : undefined}>
              <option value="">Any location</option>
              {locations.map((location) => <option key={location}>{location}</option>)}
            </select>
            {validationErrors.location && <span id="location-error" className="field-error" role="alert">{validationErrors.location}</span>}
          </label>
          <label>Maximum budget (Rs.)
            <input name="maxBudget" type="number" min="1" step="1" inputMode="numeric" placeholder="e.g. 25000" value={filters.maxBudget} onChange={change} onBlur={validateField} aria-invalid={Boolean(validationErrors.maxBudget)} aria-describedby={validationErrors.maxBudget ? 'maximum-budget-error' : undefined} />
            {validationErrors.maxBudget && <span id="maximum-budget-error" className="field-error" role="alert">{validationErrors.maxBudget}</span>}
          </label>
          <label>Room type
            <select name="roomType" value={filters.roomType} onChange={change} onBlur={validateField} aria-invalid={Boolean(validationErrors.roomType)} aria-describedby={validationErrors.roomType ? 'room-type-error' : undefined}>
              <option value="">Any room type</option><option>Single Room</option><option>Shared Room</option><option>Annex</option>
            </select>
            {validationErrors.roomType && <span id="room-type-error" className="field-error" role="alert">{validationErrors.roomType}</span>}
          </label>
          <label>Gender preference
            <select name="gender" value={filters.gender} onChange={change} onBlur={validateField} aria-invalid={Boolean(validationErrors.gender)} aria-describedby={validationErrors.gender ? 'gender-error' : undefined}>
              <option value="">Any preference</option><option>Male</option><option>Female</option><option>Any</option>
            </select>
            {validationErrors.gender && <span id="gender-error" className="field-error" role="alert">{validationErrors.gender}</span>}
          </label>
        </div>
        <div className="form-actions">
          <label className="check-label"><input name="wifi" type="checkbox" checked={filters.wifi} onChange={change} /> Wi-Fi required</label>
          <label className="check-label"><input name="kitchen" type="checkbox" checked={filters.kitchen} onChange={change} /> Kitchen required</label>
          <button className="button button-primary" type="submit">Search boardings</button>
        </div>
      </form>
      <section className="results-section">
        <h2>{loading ? 'Searching boardings...' : `${results.length} boarding${results.length === 1 ? '' : 's'} found`}</h2>
        {error && <p className="state-message state-error" role="alert">{error}</p>}
        {loading && <p className="state-message" role="status">Looking for available boarding places...</p>}
        {!loading && !error && !results.length && <p className="state-message">No boardings match those filters yet. Try broadening your search.</p>}
        <div className="boarding-grid">{results.map((boarding) => <BoardingCard key={boarding.id} boarding={boarding} />)}</div>
      </section>
    </div>
  );
}

export default FindBoarding;
