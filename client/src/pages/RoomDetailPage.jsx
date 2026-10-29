import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const RoomDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();

  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Booking Widget State
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextDay = new Date(tomorrow);
  nextDay.setDate(nextDay.getDate() + 2);

  const formatDate = (d) => d.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || formatDate(tomorrow));
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || formatDate(nextDay));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [specialRequests, setSpecialRequests] = useState('');
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState(null);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchRoomData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/rooms/${id}`);
      if (res.data.success) {
        setRoom(res.data.room);
        setReviews(res.data.reviews || []);
      }
    } catch (err) {
      console.error('Error fetching room details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, [id]);

  // Night calculation
  const calculateNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const nights = calculateNights();
  const roomPrice = room?.pricePerNight || 0;
  const nightsTotal = roomPrice * nights;
  const taxes = Math.round(nightsTotal * 0.12 * 100) / 100;
  const cleaningFee = 35;
  const grandTotal = Math.round((nightsTotal + taxes + cleaningFee) * 100) / 100;

  const handleCheckAvailability = async () => {
    setCheckingAvailability(true);
    setAvailabilityResult(null);
    try {
      const res = await api.get(`/rooms/${id}/availability?checkIn=${checkIn}&checkOut=${checkOut}`);
      if (res.data.success) {
        setAvailabilityResult({
          available: res.data.isAvailable,
          message: res.data.isAvailable
            ? 'Suite is available for your selected dates!'
            : 'Sorry, this suite is already reserved for the selected dates. Please adjust dates.',
        });
      }
    } catch (err) {
      setAvailabilityResult({
        available: false,
        message: 'Could not verify dates: ' + (err.response?.data?.message || err.message),
      });
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/rooms/${id}` } });
      return;
    }

    const bookingPayload = {
      roomId: room._id,
      roomTitle: room.title,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      roomImage: room.images?.[0],
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalNights: nights,
      guests: { adults: Number(adults), children: Number(children) },
      specialRequests,
      pricing: {
        roomRate: roomPrice,
        nightsTotal,
        taxes,
        cleaningFee,
        grandTotal,
      },
    };

    // Store temporarily in sessionStorage
    sessionStorage.setItem('hotelpro_checkout_item', JSON.stringify(bookingPayload));
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    setReviewSuccess('');

    try {
      const res = await api.post('/reviews', {
        roomId: room._id,
        rating: Number(reviewRating),
        title: reviewTitle || 'Outstanding Experience',
        comment: reviewComment,
      });

      if (res.data.success) {
        setReviewSuccess('Thank you! Your verified review has been published.');
        setReviewTitle('');
        setReviewComment('');
        fetchRoomData(); // Refresh reviews
      }
    } catch (err) {
      alert('Error submitting review: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-3 text-muted">Retrieving suite details & real-time inventory...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container py-5 text-center">
        <h3>Room Not Found</h3>
        <button className="btn btn-hp-gold mt-3" onClick={() => navigate('/rooms')}>
          Back to Rooms
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5 animate-fade-in">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><a href="/" className="text-secondary text-decoration-none">Home</a></li>
          <li className="breadcrumb-item"><a href="/rooms" className="text-secondary text-decoration-none">Rooms & Suites</a></li>
          <li className="breadcrumb-item active text-dark fw-bold" aria-current="page">{room.title}</li>
        </ol>
      </nav>

      <div className="row g-4 mb-5">
        {/* Gallery & Room Details */}
        <div className="col-lg-8">
          {/* Main Photo Showcase */}
          <div className="position-relative rounded-4 overflow-hidden shadow-sm mb-3" style={{ height: '460px', backgroundColor: '#0f172a' }}>
            <img
              src={room.images?.[activeImageIndex] || room.images?.[0]}
              alt={room.title}
              className="w-100 h-100 object-fit-cover"
              style={{ objectFit: 'cover' }}
            />
            <div className="position-absolute top-0 start-0 m-3">
              <span className="badge bg-dark bg-opacity-75 text-white px-3 py-2 rounded-pill fs-6">
                Room #{room.roomNumber} &bull; {room.roomType}
              </span>
            </div>
            <div className="position-absolute bottom-0 end-0 m-3">
              <span className="badge bg-warning text-dark fw-bold px-3 py-2 rounded-pill fs-6 shadow">
                ${room.pricePerNight} <span className="fw-normal">/ night</span>
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {room.images && room.images.length > 1 && (
            <div className="d-flex gap-3 mb-4 overflow-auto pb-2">
              {room.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`rounded-3 cursor-pointer border ${activeImageIndex === index ? 'border-warning border-3' : 'opacity-75'}`}
                  style={{ width: '100px', height: '70px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => setActiveImageIndex(index)}
                />
              ))}
            </div>
          )}

          {/* Title & Core Specs */}
          <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
            <div>
              <h1 className="fw-bold text-dark display-6 mb-1">{room.title}</h1>
              <div className="d-flex align-items-center gap-3 text-muted small">
                <span><i className="bi bi-geo-alt text-warning"></i> Level {room.floor} &bull; Ocean Wing</span>
                <span>&bull;</span>
                <span className="text-warning fw-bold"><i className="bi bi-star-fill me-1"></i> {room.rating?.toFixed(1) || '4.9'} ({room.reviewsCount || 0} reviews)</span>
              </div>
            </div>

            <span className={`badge px-3 py-2 rounded-pill fs-6 ${room.status === 'available' ? 'bg-success' : 'bg-primary'}`}>
              {room.status.toUpperCase()}
            </span>
          </div>

          {/* Feature Specs Grid */}
          <div className="row g-3 my-3">
            <div className="col-sm-3 col-6">
              <div className="p-3 bg-light rounded-3 text-center border">
                <i className="bi bi-people text-warning fs-3 mb-1 d-block"></i>
                <div className="small text-muted">Capacity</div>
                <div className="fw-bold small">{room.capacity?.adults} Adults, {room.capacity?.children || 0} Children</div>
              </div>
            </div>
            <div className="col-sm-3 col-6">
              <div className="p-3 bg-light rounded-3 text-center border">
                <i className="bi bi-aspect-ratio text-warning fs-3 mb-1 d-block"></i>
                <div className="small text-muted">Living Space</div>
                <div className="fw-bold small">{room.sizeSqFt || 450} sq ft</div>
              </div>
            </div>
            <div className="col-sm-3 col-6">
              <div className="p-3 bg-light rounded-3 text-center border">
                <i className="bi bi-moon-stars text-warning fs-3 mb-1 d-block"></i>
                <div className="small text-muted">Bedding</div>
                <div className="fw-bold small">{room.bedType || 'King Bed'}</div>
              </div>
            </div>
            <div className="col-sm-3 col-6">
              <div className="p-3 bg-light rounded-3 text-center border">
                <i className="bi bi-layers text-warning fs-3 mb-1 d-block"></i>
                <div className="small text-muted">Floor Level</div>
                <div className="fw-bold small">Level #{room.floor}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="my-4">
            <h4 className="fw-bold text-dark mb-3">Suite Overview & Ambience</h4>
            <p className="text-secondary leading-relaxed fs-6">
              {room.description}
            </p>
          </div>

          {/* Comprehensive Amenities */}
          <div className="my-4">
            <h4 className="fw-bold text-dark mb-3">Room Amenities & Luxuries</h4>
            <div className="row g-2">
              {room.amenities?.map((amenity, idx) => (
                <div key={idx} className="col-sm-6">
                  <div className="p-2.5 bg-white border rounded-3 d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill text-warning fs-5"></i>
                    <span className="small fw-semibold text-dark">{amenity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guest Reviews Section */}
          <div className="my-5 pt-4 border-top">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold text-dark mb-0">Verified Guest Reviews</h4>
                <div className="text-muted small">Based on {reviews.length} authentic guest stays</div>
              </div>
              <span className="badge bg-warning text-dark fs-6 px-3 py-2">
                <i className="bi bi-star-fill me-1"></i> {room.rating?.toFixed(1) || '4.9'} / 5.0
              </span>
            </div>

            {/* Review List */}
            {reviews.length === 0 ? (
              <p className="text-muted small">No reviews posted for this room yet. Be the first to share your experience!</p>
            ) : (
              <div className="d-flex flex-column gap-3 mb-4">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-4 bg-light rounded-4 border">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={rev.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'}
                          alt={rev.user?.name || 'Guest'}
                          className="rounded-circle"
                          style={{ width: '38px', height: '38px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-bold text-dark small">{rev.user?.name || 'Verified Traveler'}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-warning small">
                        {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                          <i key={i} className="bi bi-star-fill me-0.5"></i>
                        ))}
                      </div>
                    </div>
                    {rev.title && <h6 className="fw-bold text-dark mb-1">{rev.title}</h6>}
                    <p className="text-secondary small mb-0">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Write a Review Box */}
            <div className="card p-4 border rounded-4 bg-white shadow-sm">
              <h5 className="fw-bold text-dark mb-3">Share Your Experience</h5>
              {reviewSuccess && <div className="alert alert-success py-2 small">{reviewSuccess}</div>}

              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit}>
                  <div className="row g-3">
                    <div className="col-sm-4">
                      <label className="form-label small fw-bold text-muted">Your Rating</label>
                      <select
                        className="form-select form-select-sm"
                        value={reviewRating}
                        onChange={(e) => setReviewRating(e.target.value)}
                      >
                        <option value="5">⭐⭐⭐⭐⭐ 5 - Exceptional</option>
                        <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                        <option value="3">⭐⭐⭐ 3 - Average</option>
                        <option value="2">⭐⭐ 2 - Disappointing</option>
                        <option value="1">⭐ 1 - Poor</option>
                      </select>
                    </div>

                    <div className="col-sm-8">
                      <label className="form-label small fw-bold text-muted">Review Headline</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Unbelievable ocean views and super comfy bed!"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Review Details</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows="3"
                        placeholder="Tell future travelers about the check-in, cleanliness, breakfast, or amenities..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-hp-gold btn-sm px-4" disabled={submittingReview}>
                        {submittingReview ? 'Submitting...' : 'Post Verified Review'}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="text-muted small">
                  Please <a href="/login" className="text-primary fw-bold">Sign In</a> to write a review.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sticky Booking Widget */}
        <div className="col-lg-4">
          <div className="card border-0 shadow rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
            <div className="d-flex justify-content-between align-items-baseline mb-3 pb-3 border-bottom">
              <div>
                <span className="text-muted small">Starting from</span>
                <div className="fs-3 fw-bold text-dark">
                  ${room.pricePerNight} <small className="fs-6 text-muted font-normal">/ night</small>
                </div>
              </div>
              <span className="badge bg-success bg-opacity-10 text-success fw-bold px-2.5 py-1.5 border border-success border-opacity-25">
                Best Rate Guarantee
              </span>
            </div>

            {/* Booking Form Inputs */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted text-uppercase">Check-In Date</label>
              <input
                type="date"
                className="form-control"
                value={checkIn}
                min={formatDate(today)}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-muted text-uppercase">Check-Out Date</label>
              <input
                type="date"
                className="form-control"
                value={checkOut}
                min={checkIn || formatDate(today)}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="form-label small fw-bold text-muted text-uppercase">Adults</label>
                <select
                  className="form-select form-select-sm"
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                >
                  <option value="1">1 Adult</option>
                  <option value="2">2 Adults</option>
                  <option value="3">3 Adults</option>
                  <option value="4">4 Adults</option>
                </select>
              </div>

              <div className="col-6">
                <label className="form-label small fw-bold text-muted text-uppercase">Children</label>
                <select
                  className="form-select form-select-sm"
                  value={children}
                  onChange={(e) => setChildren(e.target.value)}
                >
                  <option value="0">0 Children</option>
                  <option value="1">1 Child</option>
                  <option value="2">2 Children</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-muted text-uppercase">Special Requests (Optional)</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="e.g. Quiet floor, early check-in, honeymoon setup"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>

            {/* Availability Check Button */}
            <div className="mb-3">
              <button
                type="button"
                className="btn btn-outline-dark btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                onClick={handleCheckAvailability}
                disabled={checkingAvailability}
              >
                {checkingAvailability ? (
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                ) : (
                  <i className="bi bi-calendar2-check"></i>
                )}
                Check Real-Time Availability
              </button>

              {availabilityResult && (
                <div className={`mt-2 p-2 rounded small ${availabilityResult.available ? 'bg-success bg-opacity-10 text-success border border-success' : 'bg-danger bg-opacity-10 text-danger border border-danger'}`}>
                  {availabilityResult.message}
                </div>
              )}
            </div>

            {/* Live Pricing Breakdown */}
            <div className="bg-light p-3 rounded-3 mb-4 border">
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>${roomPrice} &times; {nights} night(s)</span>
                <span>${nightsTotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>Cleaning & Sanitization</span>
                <span>${cleaningFee.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between small text-muted mb-2">
                <span>Hospitality Tax & VAT (12%)</span>
                <span>${taxes.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between fw-bold fs-5 text-dark">
                <span>Total Amount:</span>
                <span className="text-primary">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              className="btn btn-hp-gold w-100 py-3 fw-bold fs-6 shadow d-flex align-items-center justify-content-center gap-2"
              onClick={handleProceedToCheckout}
              disabled={room.status === 'maintenance'}
            >
              <i className="bi bi-shield-check"></i>
              {isAuthenticated ? 'Reserve & Proceed to Payment' : 'Sign In & Reserve'}
            </button>

            <div className="text-center mt-3 text-muted" style={{ fontSize: '0.75rem' }}>
              <i className="bi bi-lock-fill text-success me-1"></i>
              No hidden fees. Instant automated reservation voucher.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;
