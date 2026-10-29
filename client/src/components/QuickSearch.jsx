import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuickSearch = () => {
  const navigate = useNavigate();

  // Defaults: checkIn tomorrow, checkOut 3 days later
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextDay = new Date(tomorrow);
  nextDay.setDate(nextDay.getDate() + 2);

  const formatDate = (d) => d.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(formatDate(tomorrow));
  const [checkOut, setCheckOut] = useState(formatDate(nextDay));
  const [roomType, setRoomType] = useState('all');
  const [guests, setGuests] = useState('2');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (roomType !== 'all') params.append('roomType', roomType);
    if (guests) params.append('guests', guests);

    navigate(`/rooms?${params.toString()}`);
  };

  return (
    <div className="hp-search-bar animate-fade-in">
      <form onSubmit={handleSearch} className="row g-3 align-items-end">
        {/* Check-in */}
        <div className="col-lg-3 col-md-6">
          <label className="form-label small fw-bold text-uppercase text-muted mb-1">
            <i className="bi bi-calendar-event me-1 text-warning"></i> Check-in Date
          </label>
          <input
            type="date"
            className="form-control py-2.5 fw-semibold"
            value={checkIn}
            min={formatDate(today)}
            onChange={(e) => setCheckIn(e.target.value)}
            required
          />
        </div>

        {/* Check-out */}
        <div className="col-lg-3 col-md-6">
          <label className="form-label small fw-bold text-uppercase text-muted mb-1">
            <i className="bi bi-calendar-check me-1 text-warning"></i> Check-out Date
          </label>
          <input
            type="date"
            className="form-control py-2.5 fw-semibold"
            value={checkOut}
            min={checkIn || formatDate(today)}
            onChange={(e) => setCheckOut(e.target.value)}
            required
          />
        </div>

        {/* Room Category */}
        <div className="col-lg-2 col-md-6">
          <label className="form-label small fw-bold text-uppercase text-muted mb-1">
            <i className="bi bi-door-closed me-1 text-warning"></i> Suite Type
          </label>
          <select
            className="form-select py-2.5 fw-semibold"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <option value="all">All Room Types</option>
            <option value="Deluxe King">Deluxe King</option>
            <option value="Executive Suite">Executive Suite</option>
            <option value="Presidential Suite">Presidential Suite</option>
            <option value="Premium Double">Premium Double</option>
            <option value="Skyline Penthouse">Skyline Penthouse</option>
            <option value="Garden Villa">Garden Villa</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>

        {/* Guests */}
        <div className="col-lg-2 col-md-6">
          <label className="form-label small fw-bold text-uppercase text-muted mb-1">
            <i className="bi bi-person me-1 text-warning"></i> Guests
          </label>
          <select
            className="form-select py-2.5 fw-semibold"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          >
            <option value="1">1 Adult</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="5">5+ Guests (Family)</option>
          </select>
        </div>

        {/* Submit */}
        <div className="col-lg-2 col-12">
          <button type="submit" className="btn btn-hp-gold w-100 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2">
            <i className="bi bi-search"></i> Check Rates
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuickSearch;
