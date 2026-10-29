const { getDbStatus } = require('../config/db');
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const ServiceRequest = require('../models/ServiceRequest');
const {
  initialUsers,
  initialRooms,
  initialBookings,
  initialReviews,
  initialServices,
} = require('../data/initialData');

// In-Memory store fallback
let memoryUsers = JSON.parse(JSON.stringify(initialUsers));
let memoryRooms = JSON.parse(JSON.stringify(initialRooms));
let memoryBookings = JSON.parse(JSON.stringify(initialBookings));
let memoryReviews = JSON.parse(JSON.stringify(initialReviews));
let memoryServices = JSON.parse(JSON.stringify(initialServices));

// Helper to generate 24-character hex ID similar to Mongo ObjectId
const generateId = () => {
  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
};

const dataStore = {
  isMongo: () => getDbStatus(),

  // ================= USERS =================
  async findUserByEmail(email, includePassword = false) {
    if (this.isMongo()) {
      const query = User.findOne({ email: email.toLowerCase() });
      if (includePassword) query.select('+password');
      return await query.exec();
    }
    const user = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    const cloned = { ...user };
    if (!includePassword) delete cloned.password;
    return cloned;
  },

  async findUserById(id, includePassword = false) {
    if (this.isMongo()) {
      const query = User.findById(id);
      if (includePassword) query.select('+password');
      return await query.exec();
    }
    const user = memoryUsers.find(u => u._id.toString() === id.toString());
    if (!user) return null;
    const cloned = { ...user };
    if (!includePassword) delete cloned.password;
    return cloned;
  },

  async createUser(userData) {
    if (this.isMongo()) {
      return await User.create(userData);
    }
    const newUser = {
      _id: generateId(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password, // already hashed in controller or pre-hashed
      role: userData.role || 'guest',
      phone: userData.phone || '+1 (555) 000-0000',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      address: userData.address || { street: '', city: '', country: '' },
      createdAt: new Date(),
    };
    memoryUsers.push(newUser);
    const returnUser = { ...newUser };
    delete returnUser.password;
    return returnUser;
  },

  async updateUser(id, updateData) {
    if (this.isMongo()) {
      return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }
    const index = memoryUsers.findIndex(u => u._id.toString() === id.toString());
    if (index === -1) return null;
    memoryUsers[index] = { ...memoryUsers[index], ...updateData };
    const cloned = { ...memoryUsers[index] };
    delete cloned.password;
    return cloned;
  },

  async getAllUsers() {
    if (this.isMongo()) {
      return await User.find().select('-password');
    }
    return memoryUsers.map(u => {
      const cloned = { ...u };
      delete cloned.password;
      return cloned;
    });
  },

  // ================= ROOMS =================
  async getRooms(query = {}) {
    if (this.isMongo()) {
      const filter = {};
      if (query.roomType && query.roomType !== 'all') {
        filter.roomType = query.roomType;
      }
      if (query.status && query.status !== 'all') {
        filter.status = query.status;
      }
      if (query.minPrice || query.maxPrice) {
        filter.pricePerNight = {};
        if (query.minPrice) filter.pricePerNight.$gte = Number(query.minPrice);
        if (query.maxPrice) filter.pricePerNight.$lte = Number(query.maxPrice);
      }
      if (query.guests) {
        filter['capacity.adults'] = { $gte: Number(query.guests) };
      }
      return await Room.find(filter).sort({ pricePerNight: 1 });
    }

    let rooms = [...memoryRooms];
    if (query.roomType && query.roomType !== 'all') {
      rooms = rooms.filter(r => r.roomType.toLowerCase() === query.roomType.toLowerCase());
    }
    if (query.status && query.status !== 'all') {
      rooms = rooms.filter(r => r.status === query.status);
    }
    if (query.minPrice) {
      rooms = rooms.filter(r => r.pricePerNight >= Number(query.minPrice));
    }
    if (query.maxPrice) {
      rooms = rooms.filter(r => r.pricePerNight <= Number(query.maxPrice));
    }
    if (query.guests) {
      rooms = rooms.filter(r => (r.capacity.adults + r.capacity.children) >= Number(query.guests));
    }
    if (query.sort === 'price_asc') {
      rooms.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (query.sort === 'price_desc') {
      rooms.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (query.sort === 'rating') {
      rooms.sort((a, b) => b.rating - a.rating);
    }
    return rooms;
  },

  async findRoomById(id) {
    if (this.isMongo()) {
      return await Room.findById(id);
    }
    return memoryRooms.find(r => r._id.toString() === id.toString()) || null;
  },

  async findRoomByNumber(roomNumber) {
    if (this.isMongo()) {
      return await Room.findOne({ roomNumber });
    }
    return memoryRooms.find(r => r.roomNumber === roomNumber) || null;
  },

  async createRoom(roomData) {
    if (this.isMongo()) {
      return await Room.create(roomData);
    }
    const newRoom = {
      _id: generateId(),
      roomNumber: roomData.roomNumber,
      title: roomData.title,
      roomType: roomData.roomType,
      pricePerNight: Number(roomData.pricePerNight),
      capacity: roomData.capacity || { adults: 2, children: 0 },
      bedType: roomData.bedType || 'King Bed',
      sizeSqFt: Number(roomData.sizeSqFt || 450),
      floor: Number(roomData.floor || 1),
      description: roomData.description,
      amenities: roomData.amenities || ['High-Speed Wi-Fi', 'Smart TV'],
      images: roomData.images && roomData.images.length > 0 ? roomData.images : [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80'
      ],
      status: roomData.status || 'available',
      rating: Number(roomData.rating || 4.8),
      reviewsCount: Number(roomData.reviewsCount || 0),
      isFeatured: !!roomData.isFeatured,
      createdAt: new Date(),
    };
    memoryRooms.push(newRoom);
    return newRoom;
  },

  async updateRoom(id, updateData) {
    if (this.isMongo()) {
      return await Room.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }
    const index = memoryRooms.findIndex(r => r._id.toString() === id.toString());
    if (index === -1) return null;
    memoryRooms[index] = { ...memoryRooms[index], ...updateData };
    return memoryRooms[index];
  },

  async deleteRoom(id) {
    if (this.isMongo()) {
      return await Room.findByIdAndDelete(id);
    }
    const index = memoryRooms.findIndex(r => r._id.toString() === id.toString());
    if (index === -1) return null;
    const deleted = memoryRooms.splice(index, 1)[0];
    return deleted;
  },

  // ================= BOOKINGS =================
  async getBookings(query = {}) {
    if (this.isMongo()) {
      const filter = {};
      if (query.user) filter.user = query.user;
      if (query.room) filter.room = query.room;
      if (query.status && query.status !== 'all') filter.status = query.status;
      return await Booking.find(filter)
        .populate('room')
        .populate('user', 'name email phone avatar')
        .sort({ createdAt: -1 });
    }

    let bookings = [...memoryBookings];
    if (query.user) {
      bookings = bookings.filter(b => b.user.toString() === query.user.toString());
    }
    if (query.room) {
      bookings = bookings.filter(b => b.room.toString() === query.room.toString());
    }
    if (query.status && query.status !== 'all') {
      bookings = bookings.filter(b => b.status === query.status);
    }

    // Populate room and user references
    return bookings.map(b => {
      const room = memoryRooms.find(r => r._id.toString() === (b.room._id ? b.room._id.toString() : b.room.toString()));
      const user = memoryUsers.find(u => u._id.toString() === (b.user._id ? b.user._id.toString() : b.user.toString()));
      const populated = { ...b, room: room || b.room };
      if (user) {
        const uClone = { ...user };
        delete uClone.password;
        populated.user = uClone;
      }
      return populated;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async findBookingById(id) {
    if (this.isMongo()) {
      return await Booking.findById(id).populate('room').populate('user', 'name email phone avatar');
    }
    const booking = memoryBookings.find(b => b._id.toString() === id.toString());
    if (!booking) return null;
    const room = memoryRooms.find(r => r._id.toString() === (booking.room._id ? booking.room._id.toString() : booking.room.toString()));
    const user = memoryUsers.find(u => u._id.toString() === (booking.user._id ? booking.user._id.toString() : booking.user.toString()));
    const populated = { ...booking, room: room || booking.room };
    if (user) {
      const uClone = { ...user };
      delete uClone.password;
      populated.user = uClone;
    }
    return populated;
  },

  async checkAvailability(roomId, checkIn, checkOut, excludeBookingId = null) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const bookings = await this.getBookings({ room: roomId });
    const conflicting = bookings.filter(b => {
      if (excludeBookingId && b._id.toString() === excludeBookingId.toString()) return false;
      if (b.status === 'cancelled') return false;

      const bStart = new Date(b.checkInDate);
      const bEnd = new Date(b.checkOutDate);

      // Overlap condition: start < bEnd && end > bStart
      return start < bEnd && end > bStart;
    });

    return conflicting.length === 0;
  },

  async createBooking(bookingData) {
    if (this.isMongo()) {
      const created = await Booking.create(bookingData);
      return await Booking.findById(created._id).populate('room').populate('user', 'name email phone avatar');
    }
    const newBooking = {
      _id: generateId(),
      bookingNumber: 'HP-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      ...bookingData,
      createdAt: new Date(),
    };
    memoryBookings.push(newBooking);

    // If room status is available and check-in date is today, update room status
    const room = memoryRooms.find(r => r._id.toString() === bookingData.room.toString());
    return await this.findBookingById(newBooking._id);
  },

  async updateBooking(id, updateData) {
    if (this.isMongo()) {
      return await Booking.findByIdAndUpdate(id, updateData, { new: true })
        .populate('room')
        .populate('user', 'name email phone avatar');
    }
    const index = memoryBookings.findIndex(b => b._id.toString() === id.toString());
    if (index === -1) return null;
    memoryBookings[index] = { ...memoryBookings[index], ...updateData };
    return await this.findBookingById(id);
  },

  // ================= REVIEWS =================
  async getReviews(roomId = null) {
    if (this.isMongo()) {
      const filter = roomId ? { room: roomId } : {};
      return await Review.find(filter).populate('user', 'name avatar').sort({ createdAt: -1 });
    }
    let reviews = [...memoryReviews];
    if (roomId) {
      reviews = reviews.filter(rev => rev.room.toString() === roomId.toString());
    }
    return reviews.map(rev => {
      const user = memoryUsers.find(u => u._id.toString() === rev.user.toString());
      return {
        ...rev,
        user: user ? { _id: user._id, name: user.name, avatar: user.avatar } : { name: 'Verified Guest' }
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async createReview(reviewData) {
    if (this.isMongo()) {
      const review = await Review.create(reviewData);
      // Recalculate room rating
      const reviews = await Review.find({ room: reviewData.room });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await Room.findByIdAndUpdate(reviewData.room, {
        rating: Math.round(avgRating * 10) / 10,
        reviewsCount: reviews.length,
      });
      return review;
    }

    const newReview = {
      _id: generateId(),
      ...reviewData,
      createdAt: new Date(),
    };
    memoryReviews.push(newReview);

    // Recalculate room rating in memory
    const roomReviews = memoryReviews.filter(r => r.room.toString() === reviewData.room.toString());
    const avg = roomReviews.reduce((sum, r) => sum + r.rating, 0) / roomReviews.length;
    const roomIndex = memoryRooms.findIndex(r => r._id.toString() === reviewData.room.toString());
    if (roomIndex !== -1) {
      memoryRooms[roomIndex].rating = Math.round(avg * 10) / 10;
      memoryRooms[roomIndex].reviewsCount = roomReviews.length;
    }

    return newReview;
  },

  // ================= SERVICES / OPERATIONS =================
  async getServices(query = {}) {
    if (this.isMongo()) {
      const filter = {};
      if (query.status && query.status !== 'all') filter.status = query.status;
      if (query.room) filter.room = query.room;
      return await ServiceRequest.find(filter)
        .populate('room')
        .populate('user', 'name email phone avatar')
        .sort({ requestedAt: -1 });
    }
    let services = [...memoryServices];
    if (query.status && query.status !== 'all') {
      services = services.filter(s => s.status === query.status);
    }
    if (query.room) {
      services = services.filter(s => s.room.toString() === query.room.toString());
    }
    return services.map(s => {
      const room = memoryRooms.find(r => r._id.toString() === (s.room._id ? s.room._id.toString() : s.room.toString()));
      const user = memoryUsers.find(u => u._id.toString() === (s.user._id ? s.user._id.toString() : s.user.toString()));
      return {
        ...s,
        room: room || s.room,
        user: user ? { _id: user._id, name: user.name, email: user.email, phone: user.phone } : s.user
      };
    }).sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
  },

  async createService(serviceData) {
    if (this.isMongo()) {
      return await ServiceRequest.create(serviceData);
    }
    const newService = {
      _id: generateId(),
      ...serviceData,
      requestedAt: new Date(),
    };
    memoryServices.push(newService);
    return newService;
  },

  async updateService(id, updateData) {
    if (this.isMongo()) {
      return await ServiceRequest.findByIdAndUpdate(id, updateData, { new: true });
    }
    const index = memoryServices.findIndex(s => s._id.toString() === id.toString());
    if (index === -1) return null;
    memoryServices[index] = { ...memoryServices[index], ...updateData };
    return memoryServices[index];
  },

  // ================= DASHBOARD KPI STATS =================
  async getDashboardStats() {
    const rooms = await this.getRooms();
    const bookings = await this.getBookings();
    const services = await this.getServices();

    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(r => r.status === 'available').length;
    const bookedRooms = rooms.filter(r => r.status === 'booked').length;
    const cleaningRooms = rooms.filter(r => r.status === 'cleaning').length;
    const maintenanceRooms = rooms.filter(r => r.status === 'maintenance').length;

    // Occupancy calculation
    const occupancyRate = totalRooms > 0 ? Math.round((bookedRooms / totalRooms) * 100) : 0;

    // Total revenue from all confirmed/checked_in/checked_out bookings
    const totalRevenue = bookings
      .filter(b => b.paymentStatus === 'paid' && b.status !== 'cancelled')
      .reduce((sum, b) => sum + (b.pricing ? b.pricing.grandTotal : 0), 0);

    const checkedInGuests = bookings.filter(b => b.status === 'checked_in').length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const pendingServices = services.filter(s => s.status === 'pending' || s.status === 'in_progress').length;

    return {
      kpi: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        occupancyRate,
        totalRooms,
        availableRooms,
        bookedRooms,
        cleaningRooms,
        maintenanceRooms,
        checkedInGuests,
        confirmedBookings,
        pendingServices,
      },
      recentBookings: bookings.slice(0, 5),
      recentServices: services.slice(0, 5),
      databaseType: this.isMongo() ? 'MongoDB (Connected Live)' : 'In-Memory High Speed Store (Active)',
    };
  }
};

module.exports = dataStore;
