function FacilityBadge({ label, available }) {
  return (
    <span className={`facility-badge ${available ? 'facility-badge-available' : 'facility-badge-unavailable'}`}>
      <span aria-hidden="true">{available ? '✓' : '—'}</span> {label}
    </span>
  );
}

export default FacilityBadge;
