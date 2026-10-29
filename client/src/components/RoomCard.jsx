import React from 'react';
import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return <span className="hp-status-chip hp-status-available"><span className="hp-dot hp-dot-green"></span> Available</span>;
      case 'booked':
        return <span className="hp-status-chip hp-status-booked"><span className="hp-dot hp-dot-blue"></span> Occupied</span>;
      case 'cleaning':
        return <span className="hp-status-chip hp-status-cleaning"><span className="hp-dot hp-dot-yellow"></span> Cleaning</span>;
      case 'maintenance':
        return <span className="hp-status-chip hp-status-maintenance"><span className="hp-dot hp-dot-red"></span> Maintenance</span>;
      default:
        return <span className="hp-status-chip hp-status-available">{status}</span>;
    }
  };

  const imageSrc = room.images && room.images.length > 0 
    ? room.images[0] 
    : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800';

  return (
    <div className="card hp-card h-100">
      <div className="hp-card-img-wrap">
        <img src={imageSrc} className="hp-card-img" alt={room.title} />
        
        {/* Room Type badge */}
        <div className="position-absolute top-0 start-0 m-3">
          <span className="badge bg-dark bg-opacity-75 text-white px-2.5 py-1.5 rounded-pill shadow-sm">
            {room.roomType}
          </span>
        </div>

        {/* Room Number pill */}
        <div className="position-absolute top-0 end-0 m-3">
          <span className="badge bg-warning text-dark fw-bold px-2.5 py-1.5 rounded-pill shadow-sm">
            Room #{room.roomNumber}
          </span>
        </div>

        {/* Price Tag */}
        <div className="hp-price-tag">
          <span>${room.pricePerNight}</span> <small className="text-white-50">/ night</small>
        </div>
      </div>

      <div className="card-body p-4 d-flex flex-column">
        {/* Status & Rating */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          {getStatusBadge(room.status)}
          <div className="d-flex align-items-center text-warning small fw-bold">
            <i className="bi bi-star-fill me-1"></i>
            <span>{room.rating?.toFixed(1) || '4.9'}</span>
            <span className="text-muted ms-1">({room.reviewsCount || 0})</span>
          </div>
        </div>

        {/* Room Title */}
        <h5 className="card-title fw-bold text-dark mb-2 text-truncate" title={room.title}>
          {room.title}
        </h5>

        {/* Short Specs */}
        <div className="d-flex gap-3 text-secondary small mb-3">
          <span><i className="bi bi-people me-1 text-primary"></i> Up to {room.capacity?.adults + (room.capacity?.children || 0)} Guests</span>
          <span><i className="bi bi-aspect-ratio me-1 text-primary"></i> {room.sizeSqFt || 450} sq ft</span>
          <span><i className="bi bi-layers me-1 text-primary"></i> Floor {room.floor || 1}</span>
        </div>

        <p className="card-text text-muted small line-clamp-2 mb-3 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {room.description}
        </p>

        {/* Amenities Highlights */}
        <div className="d-flex flex-wrap gap-1 mb-4">
          {room.amenities?.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="hp-amenity-chip">
              <i className="bi bi-check-circle-fill text-warning" style={{ fontSize: '0.65rem' }}></i>
              {amenity}
            </span>
          ))}
          {room.amenities?.length > 3 && (
            <span className="hp-amenity-chip text-muted">
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="d-flex gap-2 pt-2 border-top">
          <Link to={`/rooms/${room._id}`} className="btn btn-outline-dark btn-sm flex-grow-1 py-2 fw-semibold">
            <i className="bi bi-eye me-1"></i> View Details
          </Link>
          <Link
            to={`/rooms/${room._id}?action=reserve`}
            className={`btn btn-hp-gold btn-sm px-3 py-2 ${room.status === 'maintenance' ? 'disabled' : ''}`}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
