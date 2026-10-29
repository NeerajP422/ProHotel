import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-auto border-top border-secondary">
      <div className="container">
        <div className="row gy-4 mb-4">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-buildings-fill text-warning fs-3"></i>
              <span className="hp-brand fs-4"><span>Hotel</span>Pro</span>
            </div>
            <p className="text-secondary small pe-lg-4">
              HotelPro is the ultimate hotel booking and management solution. Delivering seamless reservations, intelligent room inventory control, and enterprise-grade security for modern hospitality.
            </p>
            <div className="d-flex gap-3 text-secondary mt-3">
              <a href="#facebook" className="text-secondary fs-5 hover-text-warning"><i className="bi bi-facebook"></i></a>
              <a href="#instagram" className="text-secondary fs-5 hover-text-warning"><i className="bi bi-instagram"></i></a>
              <a href="#twitter" className="text-secondary fs-5 hover-text-warning"><i className="bi bi-twitter-x"></i></a>
              <a href="#linkedin" className="text-secondary fs-5 hover-text-warning"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white text-uppercase fw-bold mb-3 small tracking-wider">Explore</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li><Link to="/" className="text-secondary text-decoration-none">Home</Link></li>
              <li><Link to="/rooms" className="text-secondary text-decoration-none">Rooms & Suites</Link></li>
              <li><Link to="/rooms?roomType=Presidential Suite" className="text-secondary text-decoration-none">Presidential Suites</Link></li>
              <li><Link to="/rooms?roomType=Deluxe King" className="text-secondary text-decoration-none">Deluxe Oceanfront</Link></li>
              <li><Link to="/my-bookings" className="text-secondary text-decoration-none">Guest Reservations</Link></li>
            </ul>
          </div>

          {/* Operations & Technology */}
          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="text-white text-uppercase fw-bold mb-3 small tracking-wider">Technology Stack</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li><span className="text-secondary"><i className="bi bi-check2 text-warning me-1"></i> React 19 JSX & Hooks</span></li>
              <li><span className="text-secondary"><i className="bi bi-check2 text-warning me-1"></i> Bootstrap 5 Luxury Design</span></li>
              <li><span className="text-secondary"><i className="bi bi-check2 text-warning me-1"></i> Express.js & Node.js Engine</span></li>
              <li><span className="text-secondary"><i className="bi bi-check2 text-warning me-1"></i> MongoDB & Mongoose Schema</span></li>
              <li><span className="text-secondary"><i className="bi bi-check2 text-warning me-1"></i> JSON Web Token (JWT) Security</span></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white text-uppercase fw-bold mb-3 small tracking-wider">Concierge & Front Desk</h6>
            <div className="text-secondary small d-flex flex-column gap-2">
              <div><i className="bi bi-geo-alt text-warning me-2"></i> 100 Royal Grand Promenade, Ocean District</div>
              <div><i className="bi bi-telephone text-warning me-2"></i> +1 (800) 555-HOTELPRO</div>
              <div><i className="bi bi-envelope text-warning me-2"></i> concierge@hotelpro.com</div>
              <div className="mt-2 p-2 bg-secondary bg-opacity-25 rounded border border-secondary border-opacity-50">
                <span className="badge bg-success me-1">24/7 Active</span> Front Desk Services Always Available
              </div>
            </div>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-secondary small">
          <p className="mb-0">&copy; {new Date().getFullYear()} HotelPro Inc. All rights reserved. Hospitality management platform.</p>
          <div className="d-flex gap-3 mt-2 mt-md-0">
            <span className="text-secondary">Privacy Policy</span>
            <span className="text-secondary">&bull;</span>
            <span className="text-secondary">Terms of Service</span>
            <span className="text-secondary">&bull;</span>
            <span className="text-secondary">PCI-DSS Compliant Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
