import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import RoomCard from '../components/RoomCard';

const RoomsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [roomType, setRoomType] = useState(searchParams.get('roomType') || 'all');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '1000');
  const [guests, setGuests] = useState(searchParams.get('guests') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [sort, setSort] = useState('price_asc');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roomType && roomType !== 'all') params.append('roomType', roomType);
      if (status && status !== 'all') params.append('status', status);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (guests) params.append('guests', guests);
      if (sort) params.append('sort', sort);
      if (checkIn) params.append('checkIn', checkIn);
      if (checkOut) params.append('checkOut', checkOut);

      const res = await api.get(`/rooms?${params.toString()}`);
      if (res.data.success) {
        setRooms(res.data.rooms);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [roomType, maxPrice, guests, status, sort, checkIn, checkOut]);

  // Client-side text keyword filter
  const filteredRooms = rooms.filter((r) => {
    if (!searchKeyword.trim()) return true;
    const q = searchKeyword.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.roomNumber.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.roomType.toLowerCase().includes(q)
    );
  });

  const clearAllFilters = () => {
    setRoomType('all');
    setMaxPrice('1000');
    setGuests('');
    setStatus('all');
    setSort('price_asc');
    setSearchKeyword('');
    setCheckIn('');
    setCheckOut('');
    setSearchParams({});
  };

  return (
    <div className="container py-5 animate-fade-in">
      {/* Page Header */}
      <div className="mb-4">
        <span className="text-warning text-uppercase fw-bold small tracking-wider">Luxury Hotel Accommodations</span>
        <h1 className="fw-bold text-dark display-5">Rooms, Suites & Penthouses</h1>
        <p className="text-muted">
          Browse our collection of custom-designed hotel rooms with premium bedding, modern marble bathrooms, and panoramic city or ocean vistas.
        </p>
      </div>

      {/* Date Search notice if dates active */}
      {checkIn && checkOut && (
        <div className="alert alert-info d-flex align-items-center justify-content-between p-3 rounded-3 mb-4">
          <div>
            <i className="bi bi-calendar-range me-2 text-primary fs-5"></i>
            Showing rooms available between <strong>{checkIn}</strong> and <strong>{checkOut}</strong>
          </div>
          <button className="btn btn-outline-primary btn-sm" onClick={() => { setCheckIn(''); setCheckOut(''); }}>
            Clear Dates
          </button>
        </div>
      )}

      <div className="row g-4">
        {/* Left Filter Sidebar */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 text-dark fs-6 text-uppercase tracking-wider">
                <i className="bi bi-sliders me-1 text-warning"></i> Filter Rooms
              </h5>
              <button className="btn btn-link btn-sm text-muted p-0 text-decoration-none" onClick={clearAllFilters}>
                Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted text-uppercase">Keyword Search</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><i className="bi bi-search text-muted"></i></span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="e.g. Ocean, Suite, 101"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>
            </div>

            {/* Room Type */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted text-uppercase">Suite Type</label>
              <select
                className="form-select form-select-sm"
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

            {/* Max Price Range */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label small fw-bold text-muted text-uppercase mb-0">Max Nightly Rate</label>
                <span className="badge bg-warning text-dark fw-bold">${maxPrice}</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="150"
                max="1000"
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.75rem' }}>
                <span>$150</span>
                <span>$1,000</span>
              </div>
            </div>

            {/* Guests */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted text-uppercase">Min Guests Capacity</label>
              <select
                className="form-select form-select-sm"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              >
                <option value="">Any Capacity</option>
                <option value="1">1+ Guest</option>
                <option value="2">2+ Guests</option>
                <option value="3">3+ Guests</option>
                <option value="4">4+ Guests</option>
                <option value="5">5+ Guests (Family)</option>
              </select>
            </div>

            {/* Status */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted text-uppercase">Room Availability</label>
              <select
                className="form-select form-select-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">All Rooms</option>
                <option value="available">Only Available</option>
                <option value="booked">Occupied / Booked</option>
                <option value="cleaning">Under Housekeeping</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="mb-2">
              <label className="form-label small fw-bold text-muted text-uppercase">Sort By</label>
              <select
                className="form-select form-select-sm"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Guest Rating (Highest)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Content Area: Room Grid */}
        <div className="col-lg-9">
          {/* Top stats bar */}
          <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded-3 border shadow-sm">
            <span className="text-secondary small fw-semibold">
              Showing <strong className="text-dark">{filteredRooms.length}</strong> luxurious accommodations
            </span>
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small d-none d-sm-inline">Sort:</span>
              <span className="badge bg-light text-dark border">
                {sort === 'price_asc' ? 'Rate: Low to High' : sort === 'price_desc' ? 'Rate: High to Low' : 'Highest Rated'}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
              <p className="mt-3 text-muted">Refreshing hotel inventory...</p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 border p-5 shadow-sm">
              <div className="p-3 bg-light rounded-circle d-inline-block text-warning fs-1 mb-3">
                <i className="bi bi-door-closed"></i>
              </div>
              <h4 className="fw-bold text-dark">No Suites Match Your Search Criteria</h4>
              <p className="text-muted small max-w-md mx-auto mb-4">
                Try widening your price range, choosing "All Room Types", or selecting alternative dates.
              </p>
              <button className="btn btn-hp-gold" onClick={clearAllFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {filteredRooms.map((room) => (
                <div key={room._id} className="col-md-6">
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;
