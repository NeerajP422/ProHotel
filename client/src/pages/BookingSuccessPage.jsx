import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import InvoiceModal from '../components/InvoiceModal';

const BookingSuccessPage = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }

    const raw = sessionStorage.getItem('hotelpro_confirmed_booking');
    if (raw) {
      try {
        setBooking(JSON.parse(raw));
      } catch (e) {
        navigate('/my-bookings');
      }
    } else {
      navigate('/my-bookings');
    }
  }, [navigate]);

  if (!booking) return null;

  return (
    <div className="container py-5 animate-fade-in text-center">
      <div className="max-w-lg mx-auto" style={{ maxWidth: '680px' }}>
        {/* Success Icon */}
        <div className="p-4 bg-success bg-opacity-10 text-success rounded-circle d-inline-flex mb-3 fs-1 shadow-sm">
          <i className="bi bi-check-circle-fill"></i>
        </div>

        <span className="d-block text-warning text-uppercase fw-bold small tracking-wider mb-1">
          Reservation Confirmed
        </span>
        <h1 className="fw-bold text-dark display-5 mb-3">Pack Your Bags, Alexander!</h1>
        <p className="text-muted mb-4 fs-6">
          Your luxury suite has been successfully reserved. We have delivered a booking confirmation receipt to <strong>{booking.guestInfo?.email}</strong>.
        </p>

        {/* Confirmation Details Card */}
        <div className="card border-0 shadow-sm rounded-4 p-4 text-start mb-4 bg-white">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
            <div>
              <span className="text-muted small">Booking Reference Code:</span>
              <div className="fs-5 fw-bold text-dark font-monospace">{booking.bookingNumber}</div>
            </div>
            <span className="badge bg-success fs-6 px-3 py-2">
              <i className="bi bi-patch-check-fill me-1"></i> Confirmed & Paid
            </span>
          </div>

          <div className="row g-3 small">
            <div className="col-sm-6">
              <div className="text-muted">Suite:</div>
              <div className="fw-bold text-dark">{booking.room?.title || 'Luxury Suite'} (Room #{booking.room?.roomNumber})</div>
            </div>
            <div className="col-sm-6">
              <div className="text-muted">Stay Duration:</div>
              <div className="fw-bold text-dark">
                {new Date(booking.checkInDate).toLocaleDateString()} &rarr; {new Date(booking.checkOutDate).toLocaleDateString()} ({booking.totalNights} nights)
              </div>
            </div>
            <div className="col-sm-6">
              <div className="text-muted">Lead Guest:</div>
              <div className="fw-bold text-dark">{booking.guestInfo?.fullName}</div>
            </div>
            <div className="col-sm-6">
              <div className="text-muted">Total Amount Paid:</div>
              <div className="fw-bold text-primary fs-6">${booking.pricing?.grandTotal?.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <button
            type="button"
            className="btn btn-hp-gold px-4 py-2.5 fw-semibold shadow d-flex align-items-center gap-2"
            onClick={() => setShowInvoice(true)}
          >
            <i className="bi bi-printer-fill"></i> View & Print Official Folio
          </button>

          <Link to="/my-bookings" className="btn btn-outline-dark px-4 py-2.5 fw-semibold d-flex align-items-center gap-2">
            <i className="bi bi-calendar-check"></i> Manage My Reservations
          </Link>

          <Link to="/" className="btn btn-link text-muted px-3 py-2.5 text-decoration-none">
            Return to Home
          </Link>
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        booking={booking}
        show={showInvoice}
        onClose={() => setShowInvoice(false)}
      />
    </div>
  );
};

export default BookingSuccessPage;
