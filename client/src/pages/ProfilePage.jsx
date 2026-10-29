import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [country, setCountry] = useState(user?.address?.country || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const [profileMsg, setProfileMsg] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg('');

    const res = await updateProfile({
      name,
      phone,
      avatar,
      address: { street, city, country },
    });
    setProfileLoading(false);

    if (res.success) {
      setProfileMsg('Profile information updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } else {
      setProfileMsg('Failed: ' + res.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdLoading(true);
    setPwdMsg('');

    const res = await changePassword(currentPassword, newPassword);
    setPwdLoading(false);

    if (res.success) {
      setPwdMsg('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setPwdMsg(''), 3000);
    } else {
      setPwdMsg('Failed: ' + res.message);
    }
  };

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="d-flex align-items-center gap-3 mb-4">
            <img
              src={avatar || user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={user?.name}
              className="rounded-circle border border-warning border-3 shadow"
              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
            />
            <div>
              <h2 className="fw-bold text-dark mb-0">{user?.name}</h2>
              <div className="text-muted small">
                {user?.email} &bull; <span className="badge bg-dark">{user?.role?.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
            <h5 className="fw-bold text-dark mb-3">Personal & Contact Information</h5>

            {profileMsg && (
              <div className={`alert ${profileMsg.includes('success') ? 'alert-success' : 'alert-danger'} py-2 small`}>
                {profileMsg}
              </div>
            )}

            <form onSubmit={handleProfileSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase">Full Name</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control form-control-sm"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-12">
                  <label className="form-label small fw-bold text-muted text-uppercase">Avatar Photo URL</label>
                  <input
                    type="url"
                    className="form-control form-control-sm"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-bold text-muted text-uppercase">Street Address</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-bold text-muted text-uppercase">City</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-bold text-muted text-uppercase">Country</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>

                <div className="col-12 mt-3">
                  <button type="submit" className="btn btn-hp-gold btn-sm px-4" disabled={profileLoading}>
                    {profileLoading ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold text-dark mb-3">Security & Password</h5>

            {pwdMsg && (
              <div className={`alert ${pwdMsg.includes('success') ? 'alert-success' : 'alert-danger'} py-2 small`}>
                {pwdMsg}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase">Current Password</label>
                  <input
                    type="password"
                    className="form-control form-control-sm"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase">New Password</label>
                  <input
                    type="password"
                    className="form-control form-control-sm"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12 mt-3">
                  <button type="submit" className="btn btn-outline-dark btn-sm px-4" disabled={pwdLoading}>
                    {pwdLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
