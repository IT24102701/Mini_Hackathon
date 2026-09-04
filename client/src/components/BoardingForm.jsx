import { useState } from 'react';
import api from '../services/api';
import './BoardingForm.css';

const LOCATIONS = ['Malabe', 'Kaduwela', 'Battaramulla', 'Rajagiriya', 'Nugegoda', 'Maharagama', 'Homagama', 'Colombo'];
const TITLE_LIMIT = 120;
const LOCATION_LIMIT = 100;
const DISTRICT_LIMIT = 100;
const DESCRIPTION_LIMIT = 1000;

const initialValues = {
  title: '', location: '', district: '', monthlyRent: '', roomType: '',
  genderPreference: '', contactNumber: '', wifi: false, kitchen: false,
  attachedBathroom: false, parking: false, distanceKm: '', description: '',
};

function validate(values) {
  const errors = {};
  if (!values.title.trim()) errors.title = 'Please enter a title for the boarding.';
  else if (values.title.trim().length > TITLE_LIMIT) errors.title = `Title must be ${TITLE_LIMIT} characters or fewer.`;
  if (!values.location.trim()) errors.location = 'Please enter the town or area.';
  else if (values.location.trim().length > LOCATION_LIMIT) errors.location = `Location must be ${LOCATION_LIMIT} characters or fewer.`;
  if (!values.district.trim()) errors.district = 'Please enter the district.';
  else if (values.district.trim().length > DISTRICT_LIMIT) errors.district = `District must be ${DISTRICT_LIMIT} characters or fewer.`;
  if (values.monthlyRent === '') errors.monthlyRent = 'Please enter the monthly rent.';
  else if (!Number.isFinite(Number(values.monthlyRent)) || Number(values.monthlyRent) <= 0) errors.monthlyRent = 'Monthly rent must be greater than Rs. 0.';
  if (!values.roomType) errors.roomType = 'Please select a room type.';
  if (!values.genderPreference) errors.genderPreference = 'Please select a gender preference.';
  if (!values.contactNumber.trim()) errors.contactNumber = 'Please enter a contact number.';
  else if (!/^(?:\+94|0)7\d{8}$/.test(values.contactNumber.replace(/[\s-]/g, ''))) errors.contactNumber = 'Enter a valid Sri Lankan mobile number, such as 0771234567 or +94771234567.';
  if (values.distanceKm !== '' && (!Number.isFinite(Number(values.distanceKm)) || Number(values.distanceKm) < 0)) errors.distanceKm = 'Distance cannot be negative.';
  if (values.description.length > DESCRIPTION_LIMIT) errors.description = `Description must be ${DESCRIPTION_LIMIT} characters or fewer.`;
  return errors;
}

function backendMessage(error) {
  const data = error.response?.data;
  return data?.message || data?.error || (typeof data === 'string' ? data : '') || 'We could not add this boarding right now. Please try again.';
}

function FieldError({ id, children }) {
  return children ? <span id={id} className="field-error" role="alert">{children}</span> : null;
}

function BoardingForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;
    setValues((current) => ({ ...current, [name]: nextValue }));
    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[name];
        return next;
      });
    }
  }

  function handleBlur(event) {
    const field = event.target.name;
    const fieldErrors = validate(values);
    setErrors((current) => ({ ...current, [field]: fieldErrors[field] }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setStatus({ type: '', message: '' });
    if (Object.keys(nextErrors).length) return;

    const payload = {
      title: values.title.trim(),
      location: values.location.trim(),
      district: values.district.trim(),
      monthly_rent: Number(values.monthlyRent),
      room_type: values.roomType,
      gender_preference: values.genderPreference,
      contact_number: values.contactNumber.replace(/[\s-]/g, ''),
      wifi: values.wifi,
      kitchen: values.kitchen,
      attached_bathroom: values.attachedBathroom,
      parking: values.parking,
      distance_km: values.distanceKm === '' ? null : Number(values.distanceKm),
      description: values.description.trim(),
    };

    setSubmitting(true);
    try {
      await api.post('/boardings', payload);
      setValues(initialValues);
      setErrors({});
      setStatus({ type: 'success', message: 'Boarding added successfully.' });
    } catch (error) {
      setStatus({ type: 'error', message: backendMessage(error) });
    } finally {
      setSubmitting(false);
    }
  }

  const inputProps = (name) => ({
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form className="boarding-form" onSubmit={handleSubmit} noValidate>
      <div className="boarding-form-grid">
        <label className="form-field form-field-wide">Title <span aria-hidden="true">*</span>
          <input {...inputProps('title')} maxLength={TITLE_LIMIT} placeholder="Student Room Near SLIIT" />
          <FieldError id="title-error">{errors.title}</FieldError>
        </label>
        <label className="form-field">Location <span aria-hidden="true">*</span>
          <input {...inputProps('location')} list="sri-lankan-locations" maxLength={LOCATION_LIMIT} placeholder="Malabe" />
          <datalist id="sri-lankan-locations">{LOCATIONS.map((location) => <option key={location} value={location} />)}</datalist>
          <FieldError id="location-error">{errors.location}</FieldError>
        </label>
        <label className="form-field">District <span aria-hidden="true">*</span>
          <input {...inputProps('district')} maxLength={DISTRICT_LIMIT} placeholder="Colombo" />
          <FieldError id="district-error">{errors.district}</FieldError>
        </label>
        <label className="form-field">Monthly rent (Rs.) <span aria-hidden="true">*</span>
          <input {...inputProps('monthlyRent')} type="number" min="1" step="1" inputMode="numeric" placeholder="22000" />
          <FieldError id="monthlyRent-error">{errors.monthlyRent}</FieldError>
        </label>
        <label className="form-field">Distance (km)
          <input {...inputProps('distanceKm')} type="number" min="0" step="0.1" inputMode="decimal" placeholder="1.2" />
          <FieldError id="distanceKm-error">{errors.distanceKm}</FieldError>
        </label>
        <label className="form-field">Room type <span aria-hidden="true">*</span>
          <select {...inputProps('roomType')}><option value="">Select room type</option><option>Single Room</option><option>Shared Room</option><option>Annex</option></select>
          <FieldError id="roomType-error">{errors.roomType}</FieldError>
        </label>
        <label className="form-field">Gender preference <span aria-hidden="true">*</span>
          <select {...inputProps('genderPreference')}><option value="">Select preference</option><option>Male</option><option>Female</option><option>Any</option></select>
          <FieldError id="genderPreference-error">{errors.genderPreference}</FieldError>
        </label>
        <label className="form-field form-field-wide">Contact number <span aria-hidden="true">*</span>
          <input {...inputProps('contactNumber')} type="tel" inputMode="tel" placeholder="0771234567" />
          <FieldError id="contactNumber-error">{errors.contactNumber}</FieldError>
        </label>
        <fieldset className="facility-options form-field-wide">
          <legend>Facilities</legend>
          {[
            ['wifi', 'Wi-Fi'], ['kitchen', 'Kitchen'],
            ['attachedBathroom', 'Attached bathroom'], ['parking', 'Parking'],
          ].map(([name, label]) => <label key={name}><input name={name} type="checkbox" checked={values[name]} onChange={handleChange} /> {label}</label>)}
        </fieldset>
        <label className="form-field form-field-wide">Description
          <textarea {...inputProps('description')} rows="5" maxLength={DESCRIPTION_LIMIT} placeholder="Describe the room, furnishings, nearby landmarks, and any house rules." />
          <span className="character-count">{values.description.length}/{DESCRIPTION_LIMIT}</span>
          <FieldError id="description-error">{errors.description}</FieldError>
        </label>
      </div>
      {status.message && <p className={`form-status form-status-${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>{status.message}</p>}
      <button className="button button-primary submit-button" type="submit" disabled={submitting}>{submitting ? 'Adding boarding…' : 'Add boarding'}</button>
    </form>
  );
}

export default BoardingForm;
