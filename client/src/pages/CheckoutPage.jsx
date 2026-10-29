import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Guest details form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Payment details form
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');

  useEffect(() => {
    const raw = sessionStorage.getItem('hotelpro_checkout_item');
    if (!raw) {
      navigate('/rooms');
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setBookingData(parsed);
      setSpecialRequests(parsed.specialRequests || '');
    } catch (e) {
      navigate('/rooms');
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '+1 (555) 000-0000');
      setCardHolder(user.name?.toUpperCase() || 'ALEXANDER WRIGHT');
    }
  }, [user]);

  if (!bookingData) {
    return null;
  }

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      setError('Please provide all mandatory guest information fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        roomId: bookingData.roomId,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        guests: bookingData.guests,
        guestInfo: {
          fullName,
          email,
          phone,
          specialRequests,
        },
        paymentMethod,
      };

      const res = await api.post('/bookings', payload);
      if (res.data.success) {
        // Clear checkout session item
        sessionStorage.removeItem('hotelpro_checkout_item');
        // Save confirmed booking in session for success display
        sessionStorage.setItem('hotelpro_confirmed_booking', JSON.stringify(res.data.booking));
        navigate('/booking-success');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Booking reservation could not be processed. Please check dates.');
    } finally {
      setLoading(false);
    }
  };

  const pricing = bookingData.pricing || {};

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row g-4 justify-content-center">
        {/* Main Checkout Form */}
        <div className="col-lg-8">
          <div className="mb-4">
            <span className="text-warning text-uppercase fw-bold small tracking-wider">Step 2 of 2 &bull; Secure Checkout</span>
            <h2 className="fw-bold text-dark display-6">Complete Your Reservation</h2>
            <p className="text-muted small">
              Enterprise-grade 256-bit SSL encrypted transaction with real-time room confirmation.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 p-3 rounded-3 mb-4">
              <i className="bi bi-exclamation-triangle-fill fs-5"></i>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmitBooking}>
            {/* Guest Information Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-person-badge-fill text-warning"></i> 1. Guest Information
              </h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase">Full Legal Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase">Phone / Mobile Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase">Special Concierge Requests</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Airport limousine, high floor, fruit basket"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-credit-card-2-front-fill text-warning"></i> 2. Payment Details
              </h5>

              {/* Payment selector tabs */}
              <div className="d-flex gap-2 mb-4">
                <button
                  type="button"
                  className={`btn btn-sm px-3 py-2 flex-grow-1 ${paymentMethod === 'credit_card' ? 'btn-dark' : 'btn-outline-secondary'}`}
                  onClick={() => setPaymentMethod('credit_card')}
                >
                  <i className="bi bi-credit-card me-1"></i> Credit / Debit Card
                </button>
                <button
                  type="button"
                  className={`btn btn-sm px-3 py-2 flex-grow-1 ${paymentMethod === 'paypal' ? 'btn-dark' : 'btn-outline-secondary'}`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <i className="bi bi-paypal me-1"></i> PayPal Express
                </button>
                <button
                  type="button"
                  className={`btn btn-sm px-3 py-2 flex-grow-1 ${paymentMethod === 'pay_at_desk' ? 'btn-dark' : 'btn-outline-secondary'}`}
                  onClick={() => setPaymentMethod('pay_at_desk')}
                >
                  <i className="bi bi-building me-1"></i> Pay at Front Desk
                </button>
              </div>

              {paymentMethod === 'credit_card' && (
                <div className="bg-light p-3 rounded-3 border">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="small text-muted fw-bold text-uppercase">Instant Card Payment</span>
                    <div className="d-flex gap-2 fs-5 text-secondary">
                      <i className="bi bi-credit-card-2-back text-primary"></i>
                      <i className="bi bi-shield-check text-success"></i>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Cardholder Name</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Card Number</label>
                      <input
                        type="text"
                        className="form-control form-control-sm font-monospace"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-6">
                      <label className="form-label small fw-bold text-muted">Expiration Date</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-6">
                      <label className="form-label small fw-bold text-muted">Security Code (CVV)</label>
                      <input
                        type="password"
                        className="form-control form-control-sm"
                        maxLength="4"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="alert alert-light border p-4 text-center rounded-3">
                  <i className="bi bi-paypal text-primary fs-1 mb-2 d-block"></i>
                  <h6 className="fw-bold">PayPal Express Sandbox Activated</h6>
                  <p className="text-muted small mb-0">
                    Clicking Confirm will simulate an instant tokenized PayPal approval for ${pricing.grandTotal?.toFixed(2)}.
                  </p>
                </div>
              )}

              {paymentMethod === 'pay_at_desk' && (
                <div className="alert alert-light border p-4 text-center rounded-3">
                  <i className="bi bi-building-check text-success fs-1 mb-2 d-block"></i>
                  <h6 className="fw-bold">Pay Upon Check-In at Front Desk</h6>
                  <p className="text-muted small mb-0">
                    Your suite reservation will be held guaranteed. You may settle charges via cash or card upon physical arrival.
                  </p>
                </div>
              )}
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="btn btn-hp-gold btn-lg w-100 py-3 shadow fw-bold d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  Confirming Reservation & Generating Voucher...
                </>
              ) : (
                <>
                  <i className="bi bi-lock-fill"></i>
                  Confirm & Authorize ${pricing.grandTotal?.toFixed(2)}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar Summary Card */}
        <div className="col-lg-4">
          <div className="card border-0 shadow rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
            <h5 className="fw-bold text-dark mb-3">Reservation Summary</h5>

            <div className="rounded-3 overflow-hidden mb-3" style={{ height: '160px' }}>
              <img
                src={bookingData.roomImage || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600'}
                alt={bookingData.roomTitle}
                className="w-100 h-100 object-fit-cover"
                style={{ objectFit: 'cover' }}
              />
            </div>

            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h6 className="fw-bold text-dark mb-0">{bookingData.roomTitle}</h6>
                <small className="text-muted">Room #{bookingData.roomNumber} &bull; {bookingData.roomType}</small>
              </div>
            </div>

            <hr className="my-3" />

            <div className="small text-muted mb-3 d-flex flex-column gap-2">
              <div className="d-flex justify-content-between">
                <span>Check-In:</span>
                <span className="fw-bold text-dark">{new Date(bookingData.checkInDate).toLocaleDateString()}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Check-Out:</span>
                <span className="fw-bold text-dark">{new Date(bookingData.checkOutDate).toLocaleDateString()}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Stay Duration:</span>
                <span className="fw-bold text-dark">{bookingData.totalNights} Night(s)</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Guests:</span>
                <span className="fw-bold text-dark">
                  {bookingData.guests?.adults} Adults, {bookingData.guests?.children || 0} Children
                </span>
              </div>
            </div>

            <div className="bg-light p-3 rounded-3 border">
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>Room Charges:</span>
                <span>${pricing.nightsTotal?.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>Cleaning & Sanitization:</span>
                <span>${pricing.cleaningFee?.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between small text-muted mb-2">
                <span>Hospitality Tax & VAT:</span>
                <span>${pricing.taxes?.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between fw-bold fs-5 text-dark">
                <span>Total Due:</span>
                <span className="text-primary">${pricing.grandTotal?.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-center mt-3">
              <Link to={`/rooms/${bookingData.roomId}`} className="text-decoration-none small text-muted">
                <i className="bi bi-arrow-left me-1"></i> Edit Room or Dates
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
