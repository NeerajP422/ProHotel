import React, { useState } from 'react';
import api from '../api/axios';

const ServiceModal = ({ show, onClose, booking, onServiceCreated }) => {
  const [type, setType] = useState('Housekeeping');
  const [priority, setPriority] = useState('medium');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  if (!show || !booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notes.trim()) return;

    setSubmitting(true);
    setMessage('');

    try {
      const res = await api.post('/services', {
        roomId: booking.room?._id || booking.room,
        bookingId: booking._id,
        type,
        priority,
        notes,
      });

      if (res.data.success) {
        setMessage('Service dispatched! Front desk & housekeeping have been alerted.');
        setNotes('');
        setTimeout(() => {
          if (onServiceCreated) onServiceCreated();
          onClose();
        }, 1500);
      }
    } catch (err) {
      setMessage('Failed to submit request: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          <div className="modal-header bg-dark text-white p-3">
            <h5 className="modal-title d-flex align-items-center gap-2 fs-6">
              <i className="bi bi-bell-fill text-warning"></i>
              Front Desk & Concierge Request - Room #{booking.room?.roomNumber || 'Room'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {message && (
                <div className={`alert ${message.includes('dispatched') ? 'alert-success' : 'alert-danger'} py-2 small`}>
                  {message}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase">Service Category</label>
                <select
                  className="form-select fw-semibold"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="Housekeeping">Housekeeping (Fresh Towels, Turn-Down, Linens)</option>
                  <option value="Room Service">Room Service (Artisan Dining, Wine, Refreshments)</option>
                  <option value="Maintenance">Maintenance (Air Conditioning, AV/Smart TV, Tech)</option>
                  <option value="Luggage Assistance">Luggage & Bellhop Assistance</option>
                  <option value="Wakeup Call">Automated / Front Desk Wakeup Call</option>
                  <option value="Concierge">Concierge (Chauffeur, City Tour, Reservations)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase">Urgency / Priority</label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="priority"
                      id="pLow"
                      value="low"
                      checked={priority === 'low'}
                      onChange={() => setPriority('low')}
                    />
                    <label className="form-check-label small" htmlFor="pLow">Standard (Within 2 hrs)</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="priority"
                      id="pMed"
                      value="medium"
                      checked={priority === 'medium'}
                      onChange={() => setPriority('medium')}
                    />
                    <label className="form-check-label small fw-semibold text-primary" htmlFor="pMed">Medium (Prompt)</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="priority"
                      id="pHigh"
                      value="high"
                      checked={priority === 'high'}
                      onChange={() => setPriority('high')}
                    />
                    <label className="form-check-label small fw-bold text-danger" htmlFor="pHigh">Urgent (Immediate)</label>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase">Instructions / Special Notes</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="e.g. Please bring two extra plush king towels and refresh espresso capsules."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

            <div className="modal-footer bg-light p-3">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-hp-gold btn-sm px-4" disabled={submitting}>
                {submitting ? 'Dispatching...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
