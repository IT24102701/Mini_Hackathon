import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FacilityBadge from '../components/FacilityBadge';
import api from '../services/api';
import '../components/BoardingForm.css';

const value = (boarding, snake, camel) => boarding?.[snake] ?? boarding?.[camel];

function getBoarding(data) {
  return data?.boarding ?? data?.data ?? data;
}

function getErrorMessage(error) {
  if (error.response?.status === 404) return '';
  const data = error.response?.data;
  return data?.message || data?.error || (typeof data === 'string' ? data : '') || 'We could not load this boarding right now. Please try again.';
}

function BoardingDetails() {
  const { id } = useParams();
  const [boarding, setBoarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    setError('');
    api.get(`/boardings/${encodeURIComponent(id)}`)
      .then(({ data }) => {
        if (!active) return;
        const result = getBoarding(data);
        if (!result || typeof result !== 'object' || Array.isArray(result)) setNotFound(true);
        else setBoarding(result);
      })
      .catch((requestError) => {
        if (!active) return;
        if (requestError.response?.status === 404) setNotFound(true);
        else setError(getErrorMessage(requestError));
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <main className="member-page content-width"><div className="details-state" role="status"><span className="loading-spinner" aria-hidden="true" /> Loading boarding details…</div></main>;
  if (notFound) return <main className="member-page content-width"><div className="details-state"><h1>Boarding not found</h1><p>This listing may have been removed or the link may be incorrect.</p><Link className="button button-primary" to="/find">Browse boardings</Link></div></main>;
  if (error) return <main className="member-page content-width"><div className="details-state details-state-error" role="alert"><h1>Unable to load boarding</h1><p>{error}</p><button className="button button-primary" type="button" onClick={() => window.location.reload()}>Try again</button></div></main>;

  const rent = value(boarding, 'monthly_rent', 'monthlyRent') ?? boarding.rent;
  const distance = value(boarding, 'distance_km', 'distanceKm') ?? boarding.distance;
  const details = [
    ['Room type', value(boarding, 'room_type', 'roomType')],
    ['Gender preference', value(boarding, 'gender_preference', 'genderPreference') ?? boarding.gender],
    ['Distance', distance !== undefined && distance !== null && distance !== '' ? `${distance} km` : null],
    ['Contact number', value(boarding, 'contact_number', 'contactNumber')],
  ];

  return (
    <main className="member-page content-width">
      <Link className="back-link" to="/find">← Back to boardings</Link>
      <article className="details-card">
        <header className="details-header">
          <div><p className="eyebrow eyebrow-dark">Boarding details</p><h1>{boarding.title || 'Boarding place'}</h1><p className="details-location">{[boarding.location, boarding.district].filter(Boolean).join(', ') || 'Location not provided'}</p></div>
          <p className="details-rent">{Number.isFinite(Number(rent)) ? `Rs. ${Number(rent).toLocaleString('en-LK')}` : 'Rent not provided'}<span>{Number.isFinite(Number(rent)) ? ' / month' : ''}</span></p>
        </header>
        <dl className="details-list">{details.map(([label, item]) => <div key={label}><dt>{label}</dt><dd>{item || 'Not provided'}</dd></div>)}</dl>
        <section className="details-section"><h2>Facilities</h2><div className="facility-list"><FacilityBadge label="Wi-Fi" available={Boolean(boarding.wifi)} /><FacilityBadge label="Kitchen" available={Boolean(boarding.kitchen)} /><FacilityBadge label="Attached Bathroom" available={Boolean(value(boarding, 'attached_bathroom', 'attachedBathroom'))} /><FacilityBadge label="Parking" available={Boolean(boarding.parking)} /></div></section>
        <section className="details-section"><h2>Description</h2><p className="details-description">{boarding.description || 'No description has been provided for this boarding.'}</p></section>
      </article>
    </main>
  );
}

export default BoardingDetails;
