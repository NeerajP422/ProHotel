const dataStore = require('../services/dataStore');

// Helper to calculate total nights
const calculateNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

// @desc    Create a new booking reservation
// @route   POST /api/bookings
// @access  Private (Authenticated users)
exports.createBooking = async (req, res, next) => {
  try {
    const {
      roomId,
      checkInDate,
      checkOutDate,
      guests,
      guestInfo,
      paymentMethod,
      specialRequests,
    } = req.body;

    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roomId, checkInDate, and checkOutDate',
      });
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date',
      });
    }

    // Verify room
    const room = await dataStore.findRoomById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    // Check availability
    const isAvailable = await dataStore.checkAvailability(roomId, checkInDate, checkOutDate);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Room is already reserved for the selected dates. Please choose another date or suite.',
      });
    }

    const totalNights = calculateNights(checkInDate, checkOutDate);
    const nightsTotal = room.pricePerNight * totalNights;
    const taxes = Math.round(nightsTotal * 0.12 * 100) / 100;
    const cleaningFee = 35;
    const grandTotal = Math.round((nightsTotal + taxes + cleaningFee) * 100) / 100;

    const booking = await dataStore.createBooking({
      user: req.user._id,
      room: room._id,
      checkInDate: start,
      checkOutDate: end,
      totalNights,
      guests: guests || { adults: 1, children: 0 },
      guestInfo: {
        fullName: guestInfo?.fullName || req.user.name,
        email: guestInfo?.email || req.user.email,
        phone: guestInfo?.phone || req.user.phone || '+1 (555) 000-0000',
        specialRequests: specialRequests || guestInfo?.specialRequests || '',
      },
      pricing: {
        roomRate: room.pricePerNight,
        nightsTotal,
        taxes,
        cleaningFee,
        discount: 0,
        grandTotal,
      },
      paymentStatus: 'paid', // Instant confirmation simulation
      paymentMethod: paymentMethod || 'credit_card',
      paymentDetails: {
        transactionId: 'TXN-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        cardLast4: '4242',
        paidAt: new Date(),
      },
      status: 'confirmed',
    });

    res.status(201).json({
      success: true,
      message: 'Reservation created and confirmed successfully!',
      booking,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await dataStore.getBookings({ user: req.user._id });
    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all bookings (Admin/Staff)
// @route   GET /api/bookings
// @access  Private (Admin or Staff)
exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let bookings = await dataStore.getBookings({ status });

    if (search) {
      const q = search.toLowerCase();
      bookings = bookings.filter(b => {
        const guestName = b.guestInfo?.fullName?.toLowerCase() || '';
        const email = b.guestInfo?.email?.toLowerCase() || '';
        const bNum = b.bookingNumber?.toLowerCase() || '';
        const roomNum = b.room?.roomNumber?.toLowerCase() || '';
        return guestName.includes(q) || email.includes(q) || bNum.includes(q) || roomNum.includes(q);
      });
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single booking by ID / Invoice
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await dataStore.findBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Ensure only booking owner or staff/admin can view
    const isOwner = booking.user?._id?.toString() === req.user._id.toString() || booking.user?.toString() === req.user._id.toString();
    const isAuthorized = req.user.role === 'admin' || req.user.role === 'staff' || isOwner;

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this booking record.',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update booking status (Check-in, Check-out, etc.)
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin or Staff)
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['confirmed', 'checked_in', 'checked_out', 'cancelled'];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowed.join(', ')}`,
      });
    }

    const booking = await dataStore.findBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    const updateFields = { status };
    if (status === 'checked_in') {
      updateFields.checkInTime = new Date();
      // Update room to booked
      if (booking.room?._id) {
        await dataStore.updateRoom(booking.room._id, { status: 'booked' });
      }
    } else if (status === 'checked_out') {
      updateFields.checkOutTime = new Date();
      // Set room to cleaning
      if (booking.room?._id) {
        await dataStore.updateRoom(booking.room._id, { status: 'cleaning' });
      }
    } else if (status === 'cancelled') {
      // Free up room
      if (booking.room?._id) {
        await dataStore.updateRoom(booking.room._id, { status: 'available' });
      }
    }

    const updated = await dataStore.updateBooking(req.params.id, updateFields);

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking: updated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel booking (Guest or Admin)
// @route   POST /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await dataStore.findBookingById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    const isOwner = booking.user?._id?.toString() === req.user._id.toString() || booking.user?.toString() === req.user._id.toString();
    const isAuthorized = req.user.role === 'admin' || req.user.role === 'staff' || isOwner;

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.status === 'checked_in' || booking.status === 'checked_out') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a stay that is already ${booking.status}.`,
      });
    }

    const updated = await dataStore.updateBooking(req.params.id, {
      status: 'cancelled',
      paymentStatus: 'refunded',
      cancellationReason: reason || 'Guest initiated online cancellation',
    });

    if (booking.room?._id) {
      await dataStore.updateRoom(booking.room._id, { status: 'available' });
    }

    res.status(200).json({
      success: true,
      message: 'Booking successfully cancelled and refund initiated.',
      booking: updated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Process simulated payment
// @route   POST /api/bookings/:id/payment
// @access  Private
exports.processPayment = async (req, res, next) => {
  try {
    const { paymentMethod, cardLast4 } = req.body;
    const booking = await dataStore.findBookingById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    const txnId = 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    const updated = await dataStore.updateBooking(req.params.id, {
      paymentStatus: 'paid',
      paymentMethod: paymentMethod || 'credit_card',
      paymentDetails: {
        transactionId: txnId,
        cardLast4: cardLast4 || '4242',
        paidAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      booking: updated,
    });
  } catch (err) {
    next(err);
  }
};
