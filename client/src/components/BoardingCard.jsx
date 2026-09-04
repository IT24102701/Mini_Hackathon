import { Link } from 'react-router-dom';

function BoardingCard({ boarding }) {
  const value = (snake, camel) => boarding[snake] ?? boarding[camel];
  const area = [boarding.location, boarding.district].filter(Boolean).join(', ') || 'Location pending';
  const rent = value('monthly_rent', 'monthlyRent') ?? boarding.rent;
  const roomType = value('room_type', 'roomType');
  const gender = value('gender_preference', 'genderPreference') ?? boarding.gender;
  const distance = value('distance_km', 'distanceKm') ?? boarding.distance;
  const matchScore = value('match_score', 'matchScore');

  return (
    <article className="boarding-card">
      <div className="boarding-card-header">
        <div>
          <p className="boarding-location">{area}</p>
          <h2>{boarding.title || 'Boarding place'}</h2>
        </div>
        {matchScore != null && <span className="match-score">{matchScore}% match</span>}
      </div>
      <p className="boarding-rent">
        {Number.isFinite(Number(rent)) ? `Rs. ${Number(rent).toLocaleString('en-LK')}` : 'Rent on request'} <span>/ month</span>
      </p>
      <div className="boarding-details">
        {roomType && <span>{roomType}</span>}
        {gender && <span>{gender}</span>}
        {distance !== undefined && distance !== null && distance !== '' && <span>{distance} km away</span>}
        <span>{boarding.wifi ? 'Wi-Fi available' : 'No Wi-Fi listed'}</span>
        <span>{boarding.kitchen ? 'Kitchen available' : 'No kitchen listed'}</span>
      </div>
      <Link className="details-link" to={`/boardings/${boarding.id}`}>View Details</Link>
    </article>
  );
}

export default BoardingCard;
