import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isStaff, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg hp-navbar sticky-top py-3">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand hp-brand d-flex align-items-center gap-2" to="/">
          <i className="bi bi-buildings-fill text-warning fs-3"></i>
          <span>Hotel</span>Pro
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#hotelProNav"
          aria-controls="hotelProNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list fs-2 text-white"></i>
        </button>

        {/* Navigation Items */}
        <div className="collapse navbar-collapse" id="hotelProNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-1">
            <li className="nav-item">
              <NavLink className="nav-link hp-nav-link" to="/">
                <i className="bi bi-house-door me-1"></i> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link hp-nav-link" to="/rooms">
                <i className="bi bi-door-open me-1"></i> Rooms & Suites
              </NavLink>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink className="nav-link hp-nav-link" to="/my-bookings">
                  <i className="bi bi-calendar-check me-1"></i> My Bookings
                </NavLink>
              </li>
            )}
            {isStaff && (
              <li className="nav-item">
                <NavLink className="nav-link hp-nav-link text-warning fw-semibold" to="/admin">
                  <i className="bi bi-speedometer2 me-1"></i> Operations Console
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right Side: Auth controls */}
          <div className="d-flex align-items-center gap-3">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light d-flex align-items-center gap-2 border-0 bg-transparent dropdown-toggle"
                  type="button"
                  id="userMenuDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={user?.name}
                    className="rounded-circle border border-warning"
                    style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                  />
                  <div className="text-start d-none d-sm-block">
                    <span className="d-block text-white fw-semibold small lh-1">{user?.name}</span>
                    <span className={`badge mt-1 ${user?.role === 'admin' ? 'bg-danger' : user?.role === 'staff' ? 'bg-warning text-dark' : 'bg-primary'}`} style={{ fontSize: '0.65rem' }}>
                      {user?.role?.toUpperCase()}
                    </span>
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-2" aria-labelledby="userMenuDropdown">
                  <li>
                    <div className="px-3 py-2 border-bottom mb-2">
                      <div className="fw-bold">{user?.name}</div>
                      <div className="text-muted small">{user?.email}</div>
                    </div>
                  </li>
                  {isStaff && (
                    <li>
                      <Link className="dropdown-item py-2 rounded" to="/admin">
                        <i className="bi bi-gear-fill me-2 text-primary"></i> Management Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link className="dropdown-item py-2 rounded" to="/my-bookings">
                      <i className="bi bi-journal-bookmark me-2 text-info"></i> My Reservations
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 rounded" to="/profile">
                      <i className="bi bi-person-circle me-2 text-secondary"></i> Guest Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 rounded text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm px-3 py-2">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                </Link>
                <Link to="/register" className="btn btn-hp-gold btn-sm px-3 py-2">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
