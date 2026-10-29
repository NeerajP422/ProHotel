import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('guest');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters in length');
      return;
    }

    setSubmitting(true);
    const res = await register({ name, email, password, phone, role });
    setSubmitting(false);

    if (res.success) {
      if (res.user?.role === 'admin' || res.user?.role === 'staff') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="bg-dark p-4 text-center text-white">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <i className="bi bi-buildings-fill text-warning fs-2"></i>
                <span className="hp-brand fs-3"><span>Hotel</span>Pro</span>
              </div>
              <p className="text-secondary small mb-0">Create your verified guest or staff membership</p>
            </div>

            <div className="card-body p-4 p-md-5 bg-white">
              {error && (
                <div className="alert alert-danger py-2.5 small d-flex align-items-center gap-2 rounded-3 mb-4">
                  <i className="bi bi-exclamation-circle-fill"></i>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted text-uppercase">Full Name</label>
                    <input
                      type="text"
                      className="form-control py-2"
                      placeholder="e.g. Alexander Wright"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted text-uppercase">Email Address</label>
                    <input
                      type="email"
                      className="form-control py-2"
                      placeholder="alexander@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted text-uppercase">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control py-2"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted text-uppercase">Account Type</label>
                    <select
                      className="form-select py-2"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="guest">Guest / Leisure Traveler</option>
                      <option value="staff">Hotel Staff / Front Desk</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted text-uppercase">Password (Min 6 chars)</label>
                    <input
                      type="password"
                      className="form-control py-2"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      className="btn btn-hp-gold w-100 py-2.5 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                      ) : (
                        <i className="bi bi-person-plus-fill"></i>
                      )}
                      Register HotelPro Membership
                    </button>
                  </div>
                </div>
              </form>

              <div className="text-center text-muted small border-top pt-3 mt-4">
                Already registered?{' '}
                <Link to="/login" className="text-primary fw-bold text-decoration-none">
                  Sign In to Your Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
