import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import QuickSearch from '../components/QuickSearch';
import RoomCard from '../components/RoomCard';

const HomePage = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get('/rooms');
        if (res.data.success) {
          // Select featured or top 3 rooms
          const featured = res.data.rooms.filter(r => r.isFeatured).slice(0, 3);
          setFeaturedRooms(featured.length > 0 ? featured : res.data.rooms.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching featured rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hp-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <div className="hp-hero-badge mb-3">
                <i className="bi bi-patch-check-fill"></i> Modern Hospitality Management & Booking Platform
              </div>
              <h1 className="display-4 fw-bold text-white mb-3">
                Experience Grand Luxury & Intuitive Hospitality
              </h1>
              <p className="lead text-white-50 mb-4 px-md-5">
                From oceanfront penthouses to executive business suites, HotelPro delivers seamless reservation management, real-time availability, and 5-star digital concierge service.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/rooms" className="btn btn-hp-gold btn-lg px-4 py-2.5 shadow">
                  <i className="bi bi-door-open me-2"></i> Explore Rooms & Suites
                </Link>
                <a href="#amenities" className="btn btn-outline-light btn-lg px-4 py-2.5">
                  <i className="bi bi-gem me-2"></i> Hotel Amenities
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search Floating Container */}
      <div className="container mb-5">
        <QuickSearch />
      </div>

      {/* Operational Highlights Banner */}
      <section className="py-4 bg-white border-bottom border-top mb-5">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-3 col-6">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-circle fs-3">
                  <i className="bi bi-shield-lock-fill"></i>
                </div>
                <div className="text-start">
                  <h6 className="fw-bold mb-0 text-dark">Enterprise Security</h6>
                  <small className="text-muted">JWT & Encrypted Folios</small>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle fs-3">
                  <i className="bi bi-lightning-charge-fill"></i>
                </div>
                <div className="text-start">
                  <h6 className="fw-bold mb-0 text-dark">Instant Confirmation</h6>
                  <small className="text-muted">Zero Waiting Time</small>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div className="p-3 bg-success bg-opacity-10 text-success rounded-circle fs-3">
                  <i className="bi bi-headset"></i>
                </div>
                <div className="text-start">
                  <h6 className="fw-bold mb-0 text-dark">24/7 Concierge</h6>
                  <small className="text-muted">Front Desk & Housekeeping</small>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div className="p-3 bg-danger bg-opacity-10 text-danger rounded-circle fs-3">
                  <i className="bi bi-award-fill"></i>
                </div>
                <div className="text-start">
                  <h6 className="fw-bold mb-0 text-dark">Best Rate Guarantee</h6>
                  <small className="text-muted">Direct Luxury Booking</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Suites & Accommodations */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="text-warning text-uppercase fw-bold small tracking-wider">World-Class Accommodations</span>
              <h2 className="text-dark fw-bold mb-0">Featured Rooms & Suites</h2>
            </div>
            <Link to="/rooms" className="btn btn-outline-dark btn-sm px-3 py-2 fw-semibold">
              View All Suites <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
              <p className="mt-2 text-muted small">Loading luxury inventory...</p>
            </div>
          ) : (
            <div className="row g-4">
              {featuredRooms.map((room) => (
                <div key={room._id} className="col-lg-4 col-md-6">
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Hotel Amenities & Experiences */}
      <section id="amenities" className="py-5 bg-light border-top border-bottom">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-5">
            <span className="text-warning text-uppercase fw-bold small tracking-wider">Unmatched Hospitality</span>
            <h2 className="text-dark fw-bold">Curated Guest Experiences</h2>
            <p className="text-muted">Every aspect of your stay is tailored with thoughtful precision, modern comforts, and personalized service.</p>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
                <div className="d-inline-flex p-3 bg-primary bg-opacity-10 text-primary rounded-3 fs-2 mb-3">
                  <i className="bi bi-water"></i>
                </div>
                <h5 className="fw-bold text-dark">Infinity Ocean Plunge Pool</h5>
                <p className="text-muted small">
                  Suspended over panoramic coastal waters with heated cabanas, sun deck cocktails, and towel service available day and night.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
                <div className="d-inline-flex p-3 bg-warning bg-opacity-10 text-warning rounded-3 fs-2 mb-3">
                  <i className="bi bi-cup-hot-fill"></i>
                </div>
                <h5 className="fw-bold text-dark">Michelin Star Gourmet Dining</h5>
                <p className="text-muted small">
                  Exquisite international culinary creations prepared fresh by award-winning executive chefs with private dining arrangements.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
                <div className="d-inline-flex p-3 bg-success bg-opacity-10 text-success rounded-3 fs-2 mb-3">
                  <i className="bi bi-flower1"></i>
                </div>
                <h5 className="fw-bold text-dark">Holistic Ayurvedic Spa</h5>
                <p className="text-muted small">
                  Rejuvenate your senses with bespoke aromatherapy treatments, Swedish deep tissue massages, and private cedar sauna chambers.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
                <div className="d-inline-flex p-3 bg-info bg-opacity-10 text-info rounded-3 fs-2 mb-3">
                  <i className="bi bi-wifi"></i>
                </div>
                <h5 className="fw-bold text-dark">Gigabit Wi-Fi & Smart Room Hub</h5>
                <p className="text-muted small">
                  Ultra-fast fiber optic wireless connection, touch-free digital room keys, and voice-assisted environmental lighting controls.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
                <div className="d-inline-flex p-3 bg-danger bg-opacity-10 text-danger rounded-3 fs-2 mb-3">
                  <i className="bi bi-car-front-fill"></i>
                </div>
                <h5 className="fw-bold text-dark">VIP Chauffeur & Airport Shuttle</h5>
                <p className="text-muted small">
                  Seamless executive transportation between the terminal and hotel with private Mercedes Maybach fleet and luggage care.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
                <div className="d-inline-flex p-3 bg-secondary bg-opacity-10 text-secondary rounded-3 fs-2 mb-3">
                  <i className="bi bi-bell-fill"></i>
                </div>
                <h5 className="fw-bold text-dark">Dedicated 24/7 Butler Team</h5>
                <p className="text-muted small">
                  From packing and pressing to itinerary coordination and priority restaurant bookings, our butlers cater to your every request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Guest Voice */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-warning text-uppercase fw-bold small tracking-wider">Guest Testimonials</span>
            <h2 className="text-dark fw-bold">Loved by Travelers Worldwide</h2>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 bg-light rounded-4 h-100 border">
                <div className="text-warning mb-2">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <p className="text-secondary small italic mb-3">
                  "HotelPro redefined what luxury hospitality feels like. The online booking, mobile voucher, and instant housekeeping dispatch made our family vacation completely effortless."
                </p>
                <div className="d-flex align-items-center gap-2">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Guest" className="rounded-circle" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                  <div>
                    <h6 className="mb-0 fw-bold small text-dark">Alexander Wright</h6>
                    <small className="text-muted">Stayed in Deluxe Oceanfront</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 bg-light rounded-4 h-100 border">
                <div className="text-warning mb-2">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <p className="text-secondary small italic mb-3">
                  "The Presidential Suite was utterly breathtaking. Check-in was done in under 30 seconds at the front desk, and our anniversary champagne was already iced upon arrival."
                </p>
                <div className="d-flex align-items-center gap-2">
                  <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100" alt="Guest" className="rounded-circle" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                  <div>
                    <h6 className="mb-0 fw-bold small text-dark">Sophia Montgomery</h6>
                    <small className="text-muted">Stayed in Executive Suite</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 bg-light rounded-4 h-100 border">
                <div className="text-warning mb-2">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <p className="text-secondary small italic mb-3">
                  "As a frequent corporate traveler, the high-speed connectivity and quiet ergonomic work environment in the Executive Suite gave me the most productive stay ever."
                </p>
                <div className="d-flex align-items-center gap-2">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="Guest" className="rounded-circle" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                  <div>
                    <h6 className="mb-0 fw-bold small text-dark">David K. Chen</h6>
                    <small className="text-muted">Stayed in Skyline Penthouse</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-5 bg-dark text-white text-center position-relative overflow-hidden">
        <div className="container position-relative z-1 py-4">
          <h2 className="display-6 fw-bold mb-3">Reserve Your Escape Today</h2>
          <p className="text-white-50 max-w-lg mx-auto mb-4">
            Join thousands of satisfied guests who trust HotelPro for extraordinary stays, guaranteed best rates, and transparent reservations.
          </p>
          <Link to="/rooms" className="btn btn-hp-gold btn-lg px-5 py-3 fw-bold shadow-lg">
            Find Your Ideal Suite
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
