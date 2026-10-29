import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container py-5 text-center my-5 animate-fade-in">
      <div className="display-1 fw-bold text-warning mb-2">404</div>
      <h2 className="fw-bold text-dark mb-3">Suite or Destination Not Found</h2>
      <p className="text-muted max-w-md mx-auto mb-4">
        The hospitality page or room reservation you were looking for does not exist or has been relocated.
      </p>
      <Link to="/" className="btn btn-hp-gold px-4 py-2.5">
        <i className="bi bi-house-door-fill me-2"></i> Return to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
