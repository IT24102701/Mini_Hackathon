import { Link } from 'react-router-dom';
function BoardingCard({ boarding }) {
  const rent = boarding.monthlyRent ?? boarding.rent;
  const area = [boarding.location, boarding.district].filter(Boolean).join(', ') || 'Location pending';
  return <article className="boarding-card"><div className="boarding-card-header"><div><p className="boarding-location">{area}</p><h2>{boarding.title || 'Boarding place'}</h2></div>{boarding.matchScore != null && <span className="match-score">{boarding.matchScore}% match</span>}</div><p className="boarding-rent">{Number.isFinite(Number(rent)) ? `Rs. ${Number(rent).toLocaleString('en-LK')}` : 'Rent on request'} <span>/ month</span></p><div className="boarding-details">{boarding.roomType && <span>{boarding.roomType}</span>}{(boarding.genderPreference ?? boarding.gender) && <span>{boarding.genderPreference ?? boarding.gender}</span>}{boarding.distance && <span>{boarding.distance}</span>}<span>{boarding.wifi ? 'Wi-Fi available' : 'No Wi-Fi listed'}</span><span>{boarding.kitchen ? 'Kitchen available' : 'No kitchen listed'}</span></div><Link className="details-link" to={`/boardings/${boarding.id}`}>View Details</Link></article>;
}
export default BoardingCard;
