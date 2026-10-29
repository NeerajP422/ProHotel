import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import InvoiceModal from '../components/InvoiceModal';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Stats & KPIs
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Reservations
  const [bookings, setBookings] = useState([]);
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Rooms Inventory
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Service Requests
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Users Directory (Admin only)
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Modals & Action States
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState(null);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Add Room Form State
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomType, setNewRoomType] = useState('Deluxe King');
  const [newRoomPrice, setNewRoomPrice] = useState('295');
  const [newRoomAdults, setNewRoomAdults] = useState('2');
  const [newRoomChildren, setNewRoomChildren] = useState('1');
  const [newRoomBed, setNewRoomBed] = useState('King Bed');
  const [newRoomSize, setNewRoomSize] = useState('500');
  const [newRoomFloor, setNewRoomFloor] = useState('2');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [newRoomAmenities, setNewRoomAmenities] = useState('Ocean View Balcony, High-Speed Wi-Fi, Smart 4K TV, Nespresso Bar');
  const [newRoomImage, setNewRoomImage] = useState('https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200');

  // Fetch KPI Stats
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.get('/dashboard/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch Bookings
  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const params = new URLSearchParams();
      if (bookingStatusFilter !== 'all') params.append('status', bookingStatusFilter);
      if (bookingSearch) params.append('search', bookingSearch);
      const res = await api.get(`/bookings?${params.toString()}`);
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Fetch Rooms
  const fetchRooms = async () => {
    setLoadingRooms(true);
    try {
      const res = await api.get('/rooms');
      if (res.data.success) {
        setRooms(res.data.rooms);
      }
    } catch (err) {
      console.error('Failed to load rooms:', err);
    } finally {
      setLoadingRooms(false);
    }
  };

  // Fetch Services
  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const res = await api.get('/services');
      if (res.data.success) {
        setServices(res.data.services);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoadingServices(false);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    if (!isAdmin) return;
    setLoadingUsers(true);
    try {
      const res = await api.get('/auth/users');
      if (res.data.success) {
        setUsersList(res.data.users);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchBookings();
    fetchRooms();
    fetchServices();
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  // Front Desk Check-In / Check-Out operations
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data.success) {
        setActionSuccess(`Reservation updated to ${newStatus.toUpperCase()}`);
        setTimeout(() => setActionSuccess(''), 3000);
        fetchBookings();
        fetchRooms();
        fetchStats();
      }
    } catch (err) {
      alert('Failed to update reservation: ' + (err.response?.data?.message || err.message));
    }
  };

  // Room status changer
  const handleUpdateRoomStatus = async (roomId, newStatus) => {
    try {
      const res = await api.put(`/rooms/${roomId}`, { status: newStatus });
      if (res.data.success) {
        fetchRooms();
        fetchStats();
      }
    } catch (err) {
      alert('Failed to update room status: ' + (err.response?.data?.message || err.message));
    }
  };

  // Delete Room
  const handleDeleteRoom = async (roomId, roomNumber) => {
    if (!window.confirm(`Are you sure you want to permanently delete Room #${roomNumber}?`)) {
      return;
    }
    try {
      const res = await api.delete(`/rooms/${roomId}`);
      if (res.data.success) {
        setActionSuccess(`Room #${roomNumber} deleted successfully.`);
        setTimeout(() => setActionSuccess(''), 3000);
        fetchRooms();
        fetchStats();
      }
    } catch (err) {
      alert('Failed to delete room: ' + (err.response?.data?.message || err.message));
    }
  };

  // Service ticket status update
  const handleUpdateServiceStatus = async (serviceId, newStatus) => {
    try {
      const res = await api.put(`/services/${serviceId}`, { status: newStatus });
      if (res.data.success) {
        fetchServices();
        fetchStats();
      }
    } catch (err) {
      alert('Failed to update service ticket: ' + (err.response?.data?.message || err.message));
    }
  };

  // Create new room handler
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const amenitiesArr = newRoomAmenities.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.post('/rooms', {
        roomNumber: newRoomNumber,
        title: newRoomTitle,
        roomType: newRoomType,
        pricePerNight: Number(newRoomPrice),
        capacity: { adults: Number(newRoomAdults), children: Number(newRoomChildren) },
        bedType: newRoomBed,
        sizeSqFt: Number(newRoomSize),
        floor: Number(newRoomFloor),
        description: newRoomDesc,
        amenities: amenitiesArr,
        images: [newRoomImage],
      });

      if (res.data.success) {
        setActionSuccess(`Room #${newRoomNumber} registered successfully into hotel inventory!`);
        setTimeout(() => setActionSuccess(''), 4000);
        setShowAddRoomModal(false);
        // Reset inputs
        setNewRoomNumber('');
        setNewRoomTitle('');
        setNewRoomDesc('');
        fetchRooms();
        fetchStats();
      }
    } catch (err) {
      alert('Failed to create room: ' + (err.response?.data?.message || err.message));
    }
  };

  const kpi = stats?.kpi || {};

  return (
    <div className="container-fluid py-4 px-md-5 animate-fade-in">
      {/* Top Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-warning text-dark fw-bold text-uppercase px-2.5 py-1">
              {user?.role === 'admin' ? 'General Manager Portal' : 'Front Desk & Operations'}
            </span>
            <span className="badge bg-dark text-white px-2.5 py-1">
              <i className="bi bi-hdd-network-fill text-success me-1"></i> {stats?.databaseType || 'Database Active'}
            </span>
          </div>
          <h1 className="fw-bold text-dark display-6 mb-0">HotelPro Management Console</h1>
        </div>

        <div className="d-flex gap-2">
          {isAdmin && (
            <button
              className="btn btn-hp-gold shadow-sm d-flex align-items-center gap-2"
              onClick={() => setShowAddRoomModal(true)}
            >
              <i className="bi bi-plus-circle-fill"></i> Add Luxury Suite
            </button>
          )}
          <button
            className="btn btn-outline-dark shadow-sm"
            onClick={() => {
              fetchStats();
              fetchBookings();
              fetchRooms();
              fetchServices();
            }}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh Data
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="alert alert-success d-flex align-items-center gap-2 p-3 rounded-3 mb-4 shadow-sm">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <div>{actionSuccess}</div>
        </div>
      )}

      {/* KPI Stats Row */}
      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-sm-6">
          <div className="hp-kpi-card">
            <div>
              <span className="text-muted small fw-bold text-uppercase">Total Revenue</span>
              <h3 className="fw-bold text-dark mb-0 mt-1">
                ${kpi.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
              </h3>
              <small className="text-success"><i className="bi bi-graph-up-arrow me-1"></i> Paid Bookings</small>
            </div>
            <div className="hp-kpi-icon bg-warning bg-opacity-10 text-warning">
              <i className="bi bi-currency-dollar"></i>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="hp-kpi-card">
            <div>
              <span className="text-muted small fw-bold text-uppercase">Occupancy Rate</span>
              <h3 className="fw-bold text-dark mb-0 mt-1">{kpi.occupancyRate || 0}%</h3>
              <small className="text-muted">{kpi.bookedRooms || 0} of {kpi.totalRooms || 0} suites occupied</small>
            </div>
            <div className="hp-kpi-icon bg-primary bg-opacity-10 text-primary">
              <i className="bi bi-pie-chart-fill"></i>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="hp-kpi-card">
            <div>
              <span className="text-muted small fw-bold text-uppercase">Currently In Residence</span>
              <h3 className="fw-bold text-dark mb-0 mt-1">{kpi.checkedInGuests || 0}</h3>
              <small className="text-info"><i className="bi bi-key-fill me-1"></i> Active Room Keys</small>
            </div>
            <div className="hp-kpi-icon bg-info bg-opacity-10 text-info">
              <i className="bi bi-person-walking"></i>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="hp-kpi-card">
            <div>
              <span className="text-muted small fw-bold text-uppercase">Pending Services</span>
              <h3 className="fw-bold text-dark mb-0 mt-1">{kpi.pendingServices || 0}</h3>
              <small className="text-danger"><i className="bi bi-bell-fill me-1"></i> Housekeeping / Maintenance</small>
            </div>
            <div className="hp-kpi-icon bg-danger bg-opacity-10 text-danger">
              <i className="bi bi-tools"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4 border-bottom">
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold px-4 py-2.5 ${activeTab === 'overview' ? 'active text-primary border-bottom border-primary border-3' : 'text-secondary'}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="bi bi-speedometer2 me-2"></i> Operations Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold px-4 py-2.5 ${activeTab === 'bookings' ? 'active text-primary border-bottom border-primary border-3' : 'text-secondary'}`}
            onClick={() => setActiveTab('bookings')}
          >
            <i className="bi bi-calendar-check me-2"></i> Reservations & Front Desk ({bookings.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold px-4 py-2.5 ${activeTab === 'rooms' ? 'active text-primary border-bottom border-primary border-3' : 'text-secondary'}`}
            onClick={() => setActiveTab('rooms')}
          >
            <i className="bi bi-door-open me-2"></i> Room Inventory ({rooms.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold px-4 py-2.5 ${activeTab === 'services' ? 'active text-primary border-bottom border-primary border-3' : 'text-secondary'}`}
            onClick={() => setActiveTab('services')}
          >
            <i className="bi bi-bell-fill me-2"></i> Service Tickets ({services.length})
          </button>
        </li>
        {isAdmin && (
          <li className="nav-item">
            <button
              className={`nav-link fw-semibold px-4 py-2.5 ${activeTab === 'users' ? 'active text-primary border-bottom border-primary border-3' : 'text-secondary'}`}
              onClick={() => setActiveTab('users')}
            >
              <i className="bi bi-people-fill me-2"></i> Staff & Guest Directory ({usersList.length})
            </button>
          </li>
        )}
      </ul>

      {/* Tab 1: Operations Overview */}
      {activeTab === 'overview' && (
        <div className="row g-4">
          {/* Room status distribution */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
              <h5 className="fw-bold text-dark mb-3">Room Status Breakdown</h5>
              <div className="d-flex flex-column gap-3">
                <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                  <span className="d-flex align-items-center gap-2 small fw-bold">
                    <span className="hp-dot hp-dot-green"></span> Available for Booking
                  </span>
                  <span className="badge bg-success fs-6">{kpi.availableRooms || 0}</span>
                </div>
                <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                  <span className="d-flex align-items-center gap-2 small fw-bold">
                    <span className="hp-dot hp-dot-blue"></span> Currently Occupied
                  </span>
                  <span className="badge bg-primary fs-6">{kpi.bookedRooms || 0}</span>
                </div>
                <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                  <span className="d-flex align-items-center gap-2 small fw-bold">
                    <span className="hp-dot hp-dot-yellow"></span> Turn-Down / Cleaning
                  </span>
                  <span className="badge bg-warning text-dark fs-6">{kpi.cleaningRooms || 0}</span>
                </div>
                <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                  <span className="d-flex align-items-center gap-2 small fw-bold">
                    <span className="hp-dot hp-dot-red"></span> Under Maintenance
                  </span>
                  <span className="badge bg-danger fs-6">{kpi.maintenanceRooms || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reservations Table */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">Recent Reservations</h5>
                <button className="btn btn-link btn-sm text-decoration-none" onClick={() => setActiveTab('bookings')}>
                  View All &rarr;
                </button>
              </div>

              <div className="table-responsive">
                <table className="table align-middle small">
                  <thead className="table-light">
                    <tr>
                      <th>Booking #</th>
                      <th>Guest</th>
                      <th>Room</th>
                      <th>Dates</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b._id}>
                        <td className="font-monospace fw-bold">{b.bookingNumber}</td>
                        <td>{b.guestInfo?.fullName}</td>
                        <td>Room #{b.room?.roomNumber}</td>
                        <td>{new Date(b.checkInDate).toLocaleDateString()}</td>
                        <td className="fw-bold text-primary">${b.pricing?.grandTotal?.toFixed(2)}</td>
                        <td>
                          <span className={`badge ${b.status === 'confirmed' ? 'bg-success' : b.status === 'checked_in' ? 'bg-primary' : 'bg-secondary'}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Reservations & Front Desk */}
      {activeTab === 'bookings' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <h5 className="fw-bold text-dark mb-0">Front Desk Reservations Management</h5>

            <div className="d-flex gap-2 flex-wrap">
              {/* Filter */}
              <select
                className="form-select form-select-sm"
                style={{ width: '180px' }}
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked_in">Checked In</option>
                <option value="checked_out">Checked Out</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Search input */}
              <div className="input-group input-group-sm" style={{ width: '240px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Guest name, code, room"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                />
                <button className="btn btn-outline-secondary" onClick={fetchBookings}>
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
          </div>

          {loadingBookings ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle hp-table mb-0">
                <thead>
                  <tr>
                    <th>Ref Code</th>
                    <th>Lead Guest</th>
                    <th>Room Assigned</th>
                    <th>Stay Window</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th className="text-end">Front Desk Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td className="font-monospace fw-bold text-dark">{b.bookingNumber}</td>
                      <td>
                        <div className="fw-bold">{b.guestInfo?.fullName}</div>
                        <small className="text-muted">{b.guestInfo?.phone}</small>
                      </td>
                      <td>
                        <div className="fw-bold">Room #{b.room?.roomNumber}</div>
                        <small className="text-muted">{b.room?.roomType}</small>
                      </td>
                      <td>
                        <div>{new Date(b.checkInDate).toLocaleDateString()} &rarr; {new Date(b.checkOutDate).toLocaleDateString()}</div>
                        <small className="text-muted">{b.totalNights} nights &bull; {b.guests?.adults} adults</small>
                      </td>
                      <td>
                        <div className="fw-bold text-primary">${b.pricing?.grandTotal?.toFixed(2)}</div>
                        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25" style={{ fontSize: '0.65rem' }}>
                          {b.paymentStatus?.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${b.status === 'confirmed' ? 'bg-success' : b.status === 'checked_in' ? 'bg-primary' : b.status === 'checked_out' ? 'bg-secondary' : 'bg-danger'}`}>
                          {b.status?.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          {b.status === 'confirmed' && (
                            <button
                              className="btn btn-primary btn-sm px-2.5 py-1"
                              title="Check-In Guest"
                              onClick={() => handleUpdateBookingStatus(b._id, 'checked_in')}
                            >
                              <i className="bi bi-box-arrow-in-right me-1"></i> Check-In
                            </button>
                          )}

                          {b.status === 'checked_in' && (
                            <button
                              className="btn btn-warning text-dark btn-sm px-2.5 py-1 fw-semibold"
                              title="Check-Out Guest"
                              onClick={() => handleUpdateBookingStatus(b._id, 'checked_out')}
                            >
                              <i className="bi bi-box-arrow-left me-1"></i> Check-Out
                            </button>
                          )}

                          <button
                            className="btn btn-outline-dark btn-sm px-2 py-1"
                            title="View Invoice"
                            onClick={() => setSelectedBookingForInvoice(b)}
                          >
                            <i className="bi bi-receipt"></i>
                          </button>

                          {b.status === 'confirmed' && (
                            <button
                              className="btn btn-outline-danger btn-sm px-2 py-1"
                              title="Cancel Reservation"
                              onClick={() => handleUpdateBookingStatus(b._id, 'cancelled')}
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Room Inventory Control */}
      {activeTab === 'rooms' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h5 className="fw-bold text-dark mb-0">Room Inventory & Housekeeping Status</h5>
              <small className="text-muted">Manage nightly rates, live availability, cleaning status, and room specifications.</small>
            </div>

            {isAdmin && (
              <button className="btn btn-hp-gold btn-sm px-3" onClick={() => setShowAddRoomModal(true)}>
                <i className="bi bi-plus-lg me-1"></i> Add Room
              </button>
            )}
          </div>

          <div className="table-responsive">
            <table className="table align-middle hp-table mb-0">
              <thead>
                <tr>
                  <th>Room #</th>
                  <th>Image</th>
                  <th>Title & Suite Type</th>
                  <th>Floor</th>
                  <th>Rate / Night</th>
                  <th>Capacity</th>
                  <th>Current Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room._id}>
                    <td className="fw-bold font-monospace fs-6">#{room.roomNumber}</td>
                    <td>
                      <img
                        src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=100'}
                        alt={room.title}
                        className="rounded-2"
                        style={{ width: '56px', height: '40px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{room.title}</div>
                      <small className="text-muted">{room.roomType}</small>
                    </td>
                    <td>Level {room.floor}</td>
                    <td className="fw-bold text-primary">${room.pricePerNight}</td>
                    <td>{room.capacity?.adults} Adults, {room.capacity?.children || 0} Ch.</td>
                    <td>
                      <select
                        className={`form-select form-select-sm fw-semibold ${room.status === 'available' ? 'text-success' : room.status === 'booked' ? 'text-primary' : room.status === 'cleaning' ? 'text-warning' : 'text-danger'}`}
                        value={room.status}
                        onChange={(e) => handleUpdateRoomStatus(room._id, e.target.value)}
                        style={{ width: '140px' }}
                      >
                        <option value="available">🟢 Available</option>
                        <option value="booked">🔵 Occupied</option>
                        <option value="cleaning">🟡 Cleaning</option>
                        <option value="maintenance">🔴 Maintenance</option>
                      </select>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <a href={`/rooms/${room._id}`} target="_blank" rel="noreferrer" className="btn btn-outline-secondary btn-sm">
                          <i className="bi bi-box-arrow-up-right"></i>
                        </a>
                        {isAdmin && (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteRoom(room._id, room.roomNumber)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Service Requests Board */}
      {activeTab === 'services' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="fw-bold text-dark mb-0">Operational Service Requests & Housekeeping Board</h5>
              <small className="text-muted">Live tasks dispatched from guest portal and front desk dispatch.</small>
            </div>
            <button className="btn btn-outline-dark btn-sm" onClick={fetchServices}>
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh Tickets
            </button>
          </div>

          <div className="table-responsive">
            <table className="table align-middle hp-table mb-0">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Service Type</th>
                  <th>Priority</th>
                  <th>Request Details</th>
                  <th>Submitted At</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s._id}>
                    <td className="fw-bold">Room #{s.room?.roomNumber || 'N/A'}</td>
                    <td>
                      <span className="badge bg-dark px-2.5 py-1.5">{s.type}</span>
                    </td>
                    <td>
                      <span className={`badge ${s.priority === 'urgent' || s.priority === 'high' ? 'bg-danger' : s.priority === 'medium' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                        {s.priority?.toUpperCase()}
                      </span>
                    </td>
                    <td className="small" style={{ maxWidth: '320px' }}>{s.notes}</td>
                    <td className="small text-muted">{new Date(s.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>
                      <span className={`badge ${s.status === 'completed' ? 'bg-success' : s.status === 'in_progress' ? 'bg-info text-dark' : 'bg-warning text-dark'}`}>
                        {s.status?.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        {s.status === 'pending' && (
                          <button
                            className="btn btn-outline-primary btn-sm px-2 py-1"
                            onClick={() => handleUpdateServiceStatus(s._id, 'in_progress')}
                          >
                            Mark In Progress
                          </button>
                        )}
                        {s.status !== 'completed' && (
                          <button
                            className="btn btn-success btn-sm px-2 py-1"
                            onClick={() => handleUpdateServiceStatus(s._id, 'completed')}
                          >
                            <i className="bi bi-check2"></i> Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Users Directory (Admin only) */}
      {isAdmin && activeTab === 'users' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h5 className="fw-bold text-dark mb-3">User & Staff Accounts Directory</h5>
          <div className="table-responsive">
            <table className="table align-middle hp-table mb-0">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                        alt={u.name}
                        className="rounded-circle"
                        style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                      />
                    </td>
                    <td className="fw-bold text-dark">{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'bg-danger' : u.role === 'staff' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                        {u.role?.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-muted small">{u.phone}</td>
                    <td className="text-muted small">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Luxury Room */}
      {showAddRoomModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header bg-dark text-white p-3">
                <h5 className="modal-title d-flex align-items-center gap-2 fs-6">
                  <i className="bi bi-door-open-fill text-warning"></i> Add New Luxury Suite to Inventory
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddRoomModal(false)}></button>
              </div>

              <form onSubmit={handleCreateRoom}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-sm-4">
                      <label className="form-label small fw-bold text-muted">Room Number</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. 502"
                        value={newRoomNumber}
                        onChange={(e) => setNewRoomNumber(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-sm-8">
                      <label className="form-label small fw-bold text-muted">Suite Title</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Royal Mediterranean Panorama Suite"
                        value={newRoomTitle}
                        onChange={(e) => setNewRoomTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-sm-4">
                      <label className="form-label small fw-bold text-muted">Suite Category</label>
                      <select
                        className="form-select form-select-sm"
                        value={newRoomType}
                        onChange={(e) => setNewRoomType(e.target.value)}
                      >
                        <option value="Deluxe King">Deluxe King</option>
                        <option value="Executive Suite">Executive Suite</option>
                        <option value="Presidential Suite">Presidential Suite</option>
                        <option value="Premium Double">Premium Double</option>
                        <option value="Skyline Penthouse">Skyline Penthouse</option>
                        <option value="Garden Villa">Garden Villa</option>
                        <option value="Family Suite">Family Suite</option>
                      </select>
                    </div>

                    <div className="col-sm-4">
                      <label className="form-label small fw-bold text-muted">Price Per Night ($)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={newRoomPrice}
                        onChange={(e) => setNewRoomPrice(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-sm-4">
                      <label className="form-label small fw-bold text-muted">Floor Level</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={newRoomFloor}
                        onChange={(e) => setNewRoomFloor(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-sm-4">
                      <label className="form-label small fw-bold text-muted">Adults</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={newRoomAdults}
                        onChange={(e) => setNewRoomAdults(e.target.value)}
                        min="1"
                        required
                      />
                    </div>

                    <div className="col-sm-4">
                      <label className="form-label small fw-bold text-muted">Children</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={newRoomChildren}
                        onChange={(e) => setNewRoomChildren(e.target.value)}
                        min="0"
                        required
                      />
                    </div>

                    <div className="col-sm-4">
                      <label className="form-label small fw-bold text-muted">Bed Type</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={newRoomBed}
                        onChange={(e) => setNewRoomBed(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Description</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows="3"
                        placeholder="Describe the architectural details, views, ambiance, and comfort..."
                        value={newRoomDesc}
                        onChange={(e) => setNewRoomDesc(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Amenities (Comma separated)</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={newRoomAmenities}
                        onChange={(e) => setNewRoomAmenities(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">Image URL (Unsplash or direct URL)</label>
                      <input
                        type="url"
                        className="form-control form-control-sm"
                        value={newRoomImage}
                        onChange={(e) => setNewRoomImage(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light p-3">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowAddRoomModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-hp-gold btn-sm px-4">
                    Save & Publish Room
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal
        booking={selectedBookingForInvoice}
        show={!!selectedBookingForInvoice}
        onClose={() => setSelectedBookingForInvoice(null)}
      />
    </div>
  );
};

export default AdminDashboard;
