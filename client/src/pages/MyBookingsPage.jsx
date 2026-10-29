import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import InvoiceModal from '../components/InvoiceModal';
import ServiceModal from '../components/ServiceModal';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Modals state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showService, setShowService] = useState(false);

  // Cancel action state
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/my-bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Error fetching user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you wish to cancel this reservation? Refund will be processed.')) {
      return;
    }

    setCancellingId(id);
    try {
      const res = await api.post(`/bookings/${id}/cancel`, {
        reason: 'Guest initiated cancellation from portal',
      });
      if (res.data.success) {
        fetchBookings();
      }
    } catch (err) {
      alert('Failed to cancel booking: ' + (err.response?.data?.message || err.message));
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2.5 py-1.5"><i className="bi bi-calendar-check me-1"></i> Confirmed</span>;
      case 'checked_in':
        return <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2.5 py-1.5"><i className="bi bi-key-fill me-1"></i> In Residence</span>;
      case 'checked_out':
        return <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-2.5 py-1.5"><i className="bi bi-check2-circle me-1"></i> Completed Stay</span>;
      case 'cancelled':
        return <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2.5 py-1.5"><i className="bi bi-x-circle me-1"></i> Cancelled & Refunded</span>;
      default:
        return <span className="badge bg-light text-dark border px-2.5 py-1.5">{status}</span>;
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return b.status === 'checked_in';
    if (activeTab === 'upcoming') return b.status === 'confirmed';
    if (activeTab === 'past') return b.status === 'checked_out';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <div className="container py-5 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <span className="text-warning text-uppercase fw-bold small tracking-wider">Guest Portal</span>
          <h1 className="fw-bold text-dark display-6 mb-1">My Reservations & Stays</h1>
          <p className="text-muted small mb-0">View your active keys, reservation vouchers, room service dispatch, and stay history.</p>
        </div>

        <Link to="/rooms" className="btn btn-hp-gold shadow-sm">
          <i className="bi bi-plus-lg me-1"></i> Book Another Suite
        </Link>
      </div>

      {/* Filter Tabs */}
      <ul className="nav nav-pills gap-2 mb-4 p-1 bg-white rounded-3 shadow-sm border d-inline-flex">
        <li className="nav-item">
          <button
            className={`nav-link btn-sm fw-semibold ${activeTab === 'all' ? 'active bg-dark' : 'text-secondary'}`}
            onClick={() => setActiveTab('all')}
          >
            All Stays ({bookings.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn-sm fw-semibold ${activeTab === 'upcoming' ? 'active bg-dark' : 'text-secondary'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming ({bookings.filter(b => b.status === 'confirmed').length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn-sm fw-semibold ${activeTab === 'active' ? 'active bg-dark' : 'text-secondary'}`}
            onClick={() => setActiveTab('active')}
          >
            In Residence ({bookings.filter(b => b.status === 'checked_in').length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn-sm fw-semibold ${activeTab === 'past' ? 'active bg-dark' : 'text-secondary'}`}
            onClick={() => setActiveTab('past')}
          >
            Past ({bookings.filter(b => b.status === 'checked_out').length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn-sm fw-semibold ${activeTab === 'cancelled' ? 'active bg-dark' : 'text-secondary'}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status"></div>
          <p className="mt-2 text-muted small">Loading your reservations...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border p-5 shadow-sm">
          <div className="p-3 bg-light rounded-circle d-inline-block text-warning fs-1 mb-3">
            <i className="bi bi-journal-x"></i>
          </div>
          <h4 className="fw-bold text-dark">No Stays Found</h4>
          <p className="text-muted small max-w-md mx-auto mb-4">
            You currently have no reservations under this tab. Explore our luxury suites and reserve your next getaway!
          </p>
          <Link to="/rooms" className="btn btn-hp-gold">
            Browse Luxury Suites
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {filteredBookings.map((b) => {
            const room = b.room || {};
            const pricing = b.pricing || {};

            return (
              <div key={b._id} className="col-12">
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                  <div className="card-body p-4">
                    <div className="row g-4 align-items-center">
                      {/* Image Thumbnail */}
                      <div className="col-lg-3 col-md-4">
                        <div className="rounded-3 overflow-hidden position-relative" style={{ height: '170px' }}>
                          <img
                            src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600'}
                            alt={room.title}
                            className="w-100 h-100 object-fit-cover"
                            style={{ objectFit: 'cover' }}
                          />
                          <span className="position-absolute top-0 start-0 m-2 badge bg-dark bg-opacity-75">
                            Room #{room.roomNumber}
                          </span>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="col-lg-6 col-md-5">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span className="font-monospace small text-muted">#{b.bookingNumber}</span>
                          {getStatusBadge(b.status)}
                        </div>

                        <h5 className="fw-bold text-dark mb-1">{room.title || 'Luxury Suite'}</h5>
                        <p className="text-muted small mb-3">
                          {room.roomType} &bull; Floor #{room.floor || 1} &bull; {b.totalNights} Night(s) Stay
                        </p>

                        <div className="row g-2 small text-secondary">
                          <div className="col-sm-6">
                            <i className="bi bi-box-arrow-in-right text-success me-1"></i>
                            <strong>Check-In:</strong> {new Date(b.checkInDate).toLocaleDateString()}
                          </div>
                          <div className="col-sm-6">
                            <i className="bi bi-box-arrow-left text-danger me-1"></i>
                            <strong>Check-Out:</strong> {new Date(b.checkOutDate).toLocaleDateString()}
                          </div>
                          <div className="col-sm-6">
                            <i className="bi bi-people text-primary me-1"></i>
                            <strong>Guests:</strong> {b.guests?.adults} Adults, {b.guests?.children || 0} Children
                          </div>
                          <div className="col-sm-6">
                            <i className="bi bi-cash-stack text-warning me-1"></i>
                            <strong>Total:</strong> ${pricing.grandTotal?.toFixed(2)} ({b.paymentStatus?.toUpperCase()})
                          </div>
                        </div>

                        {b.guestInfo?.specialRequests && (
                          <div className="mt-2 text-muted small bg-light p-2 rounded">
                            <i className="bi bi-info-circle me-1 text-primary"></i>
                            <strong>Special Request:</strong> {b.guestInfo.specialRequests}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="col-lg-3 col-md-3 text-lg-end d-flex flex-column gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-dark btn-sm py-2 d-flex align-items-center justify-content-center gap-2"
                          onClick={() => {
                            setSelectedBooking(b);
                            setShowInvoice(true);
                          }}
                        >
                          <i className="bi bi-receipt"></i> View Folio / Invoice
                        </button>

                        {(b.status === 'confirmed' || b.status === 'checked_in') && (
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm py-2 d-flex align-items-center justify-content-center gap-2"
                            onClick={() => {
                              setSelectedBooking(b);
                              setShowService(true);
                            }}
                          >
                            <i className="bi bi-bell-fill text-warning"></i> Request Concierge/Service
                          </button>
                        )}

                        {b.status === 'confirmed' && (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm py-2"
                            disabled={cancellingId === b._id}
                            onClick={() => handleCancelBooking(b._id)}
                          >
                            {cancellingId === b._id ? 'Cancelling...' : 'Cancel Reservation'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal
        booking={selectedBooking}
        show={showInvoice}
        onClose={() => {
          setShowInvoice(false);
          setSelectedBooking(null);
        }}
      />

      {/* Service Request Modal */}
      <ServiceModal
        booking={selectedBooking}
        show={showService}
        onClose={() => {
          setShowService(false);
          setSelectedBooking(null);
        }}
        onServiceCreated={fetchBookings}
      />
    </div>
  );
};

export default MyBookingsPage;
