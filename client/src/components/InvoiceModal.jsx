import React from 'react';

const InvoiceModal = ({ booking, show, onClose }) => {
  if (!show || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const room = booking.room || {};
  const guest = booking.guestInfo || {};
  const pricing = booking.pricing || {};

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
          {/* Modal Header */}
          <div className="modal-header bg-dark text-white p-3 no-print">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <i className="bi bi-receipt text-warning"></i> Hotel Reservation Invoice & Voucher
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* Printable Invoice Body */}
          <div className="modal-body p-4 p-md-5" id="printable-invoice">
            {/* Header info */}
            <div className="d-flex justify-content-between align-items-start border-bottom pb-4 mb-4">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-buildings-fill text-warning fs-2"></i>
                  <span className="hp-brand text-dark fs-3"><span>Hotel</span>Pro</span>
                </div>
                <p className="text-muted small mb-0">100 Royal Grand Promenade, Oceanfront District</p>
                <p className="text-muted small mb-0">Phone: +1 (800) 555-HOTELPRO | GST/Tax ID: HP-894102-US</p>
              </div>
              <div className="text-end">
                <span className="badge bg-success fs-6 px-3 py-2 mb-2">
                  <i className="bi bi-check-circle-fill me-1"></i> {booking.paymentStatus?.toUpperCase() || 'PAID'}
                </span>
                <div className="text-muted small">Reservation Code:</div>
                <div className="fw-bold fs-5 text-dark font-monospace">{booking.bookingNumber}</div>
                <div className="text-muted small">Issued: {new Date(booking.createdAt || Date.now()).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Guest & Reservation Metadata Grid */}
            <div className="row g-4 mb-4">
              <div className="col-sm-6">
                <div className="bg-light p-3 rounded-3 h-100 border">
                  <h6 className="text-uppercase text-muted fw-bold small mb-2">Guest Information</h6>
                  <div className="fw-bold fs-6 text-dark">{guest.fullName || 'Guest'}</div>
                  <div className="small text-muted"><i className="bi bi-envelope me-1"></i> {guest.email}</div>
                  <div className="small text-muted"><i className="bi bi-telephone me-1"></i> {guest.phone}</div>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="bg-light p-3 rounded-3 h-100 border">
                  <h6 className="text-uppercase text-muted fw-bold small mb-2">Stay Details</h6>
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="text-muted">Room / Suite:</span>
                    <span className="fw-bold text-dark">{room.title || 'Luxury Suite'} (Room #{room.roomNumber})</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="text-muted">Check-In:</span>
                    <span className="fw-bold text-dark">{new Date(booking.checkInDate).toLocaleDateString()} (from 2:00 PM)</span>
                  </div>
                  <div className="d-flex justify-content-between small">
                    <span className="text-muted">Check-Out:</span>
                    <span className="fw-bold text-dark">{new Date(booking.checkOutDate).toLocaleDateString()} (by 11:00 AM)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="table-responsive mb-4">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Description</th>
                    <th className="text-center">Rate</th>
                    <th className="text-center">Duration</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="fw-bold">{room.title || 'Room Accommodation'}</div>
                      <small className="text-muted">Room #{room.roomNumber} - {booking.totalNights} Night(s) Stay</small>
                    </td>
                    <td className="text-center">${pricing.roomRate || room.pricePerNight} / night</td>
                    <td className="text-center">{booking.totalNights} Night(s)</td>
                    <td className="text-end fw-bold">${pricing.nightsTotal?.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-muted">Sanitization & Cleaning Services</td>
                    <td className="text-end">${pricing.cleaningFee?.toFixed(2) || '35.00'}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-muted">Hospitality Occupancy Tax & VAT (12%)</td>
                    <td className="text-end">${pricing.taxes?.toFixed(2)}</td>
                  </tr>
                  {pricing.discount > 0 && (
                    <tr className="text-success">
                      <td colSpan="3">Promotional Discount Applied</td>
                      <td className="text-end">-${pricing.discount?.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr className="table-active">
                    <td colSpan="3" className="text-uppercase fw-bold fs-6">Grand Total Amount</td>
                    <td className="text-end fw-bold fs-5 text-primary">${pricing.grandTotal?.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment & Transaction Receipt */}
            <div className="border p-3 rounded-3 bg-light d-flex flex-wrap justify-content-between align-items-center mb-4">
              <div>
                <div className="small text-muted">Payment Method:</div>
                <div className="fw-semibold text-dark text-capitalize">
                  <i className="bi bi-credit-card me-1 text-primary"></i>
                  {booking.paymentMethod?.replace('_', ' ')} (ending in {booking.paymentDetails?.cardLast4 || '4242'})
                </div>
              </div>
              <div>
                <div className="small text-muted">Transaction ID:</div>
                <div className="font-monospace fw-bold small text-secondary">
                  {booking.paymentDetails?.transactionId || 'TXN-HOTELPRO'}
                </div>
              </div>
              <div>
                <div className="small text-muted">Payment Date:</div>
                <div className="small text-dark">
                  {booking.paymentDetails?.paidAt ? new Date(booking.paymentDetails.paidAt).toLocaleString() : 'Confirmed'}
                </div>
              </div>
            </div>

            {/* Footer notes */}
            <div className="border-top pt-3 text-muted small text-center">
              <p className="mb-1">Thank you for selecting HotelPro. We look forward to offering you an unforgettable stay.</p>
              <p className="mb-0 text-secondary" style={{ fontSize: '0.75rem' }}>HotelPro Management Systems &copy; {new Date().getFullYear()}. All hospitality operations monitored and secured with 256-bit SSL encryption.</p>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-footer bg-light p-3 no-print">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={handlePrint}>
              <i className="bi bi-printer me-1"></i> Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
