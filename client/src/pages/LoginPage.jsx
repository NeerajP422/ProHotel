import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      if (res.user?.role === 'admin' || res.user?.role === 'staff') {
        navigate('/admin');
      } else {
        navigate(from === '/login' ? '/' : from);
      }
    } else {
      setError(res.message);
    }
  };

  // Quick Demo fill & login helper
  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            {/* Top brand banner */}
            <div className="bg-dark p-4 text-center text-white">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <i className="bi bi-buildings-fill text-warning fs-2"></i>
                <span className="hp-brand fs-3"><span>Hotel</span>Pro</span>
              </div>
              <p className="text-secondary small mb-0">Sign in to your personalized hospitality account</p>
            </div>

            <div className="card-body p-4 p-md-5 bg-white">
              {error && (
                <div className="alert alert-danger py-2.5 small d-flex align-items-center gap-2 rounded-3 mb-4">
                  <i className="bi bi-exclamation-circle-fill"></i>
                  <div>{error}</div>
                </div>
              )}

              {/* 1-Click Quick Demo Login Bar */}
              <div className="bg-light p-3 rounded-3 border mb-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="small fw-bold text-uppercase text-muted" style={{ fontSize: '0.72rem' }}>
                    <i className="bi bi-lightning-fill text-warning me-1"></i> Quick Demo Roles
                  </span>
                  <span className="badge bg-secondary text-white" style={{ fontSize: '0.65rem' }}>1-Click Fill</span>
                </div>
                <div className="d-grid gap-1.5">
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm text-start py-1.5 d-flex justify-content-between align-items-center"
                    onClick={() => handleQuickLogin('admin@hotelpro.com', 'Admin@123')}
                  >
                    <span><strong>General Manager</strong> (Admin)</span>
                    <span className="small text-muted font-monospace">admin@hotelpro.com</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-warning btn-sm text-start py-1.5 d-flex justify-content-between align-items-center text-dark"
                    onClick={() => handleQuickLogin('staff@hotelpro.com', 'Staff@123')}
                  >
                    <span><strong>Front Desk</strong> (Staff)</span>
                    <span className="small text-muted font-monospace">staff@hotelpro.com</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm text-start py-1.5 d-flex justify-content-between align-items-center"
                    onClick={() => handleQuickLogin('guest@hotelpro.com', 'Guest@123')}
                  >
                    <span><strong>Traveler</strong> (Guest)</span>
                    <span className="small text-muted font-monospace">guest@hotelpro.com</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted text-uppercase">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><i className="bi bi-envelope text-muted"></i></span>
                    <input
                      type="email"
                      className="form-control border-start-0 py-2"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-bold text-muted text-uppercase mb-0">Password</label>
                    <span className="small text-muted" style={{ fontSize: '0.75rem' }}>Demo pwd: Admin@123</span>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock text-muted"></i></span>
                    <input
                      type="password"
                      className="form-control border-start-0 py-2"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-hp-gold w-100 py-2.5 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mb-3"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    <i className="bi bi-box-arrow-in-right"></i>
                  )}
                  Sign In to HotelPro
                </button>
              </form>

              <div className="text-center text-muted small border-top pt-3">
                Don't have an account yet?{' '}
                <Link to="/register" className="text-primary fw-bold text-decoration-none">
                  Create Guest Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
