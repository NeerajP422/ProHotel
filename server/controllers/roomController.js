const dataStore = require('../services/dataStore');

// @desc    Get all rooms with filters
// @route   GET /api/rooms
// @access  Public
exports.getRooms = async (req, res, next) => {
  try {
    const { roomType, minPrice, maxPrice, guests, status, sort, checkIn, checkOut } = req.query;

    let rooms = await dataStore.getRooms({
      roomType,
      minPrice,
      maxPrice,
      guests,
      status,
      sort,
    });

    // If checkIn and checkOut provided, filter out rooms with date conflicts
    if (checkIn && checkOut) {
      const availableRooms = [];
      for (const room of rooms) {
        const isAvailable = await dataStore.checkAvailability(room._id, checkIn, checkOut);
        if (isAvailable && room.status !== 'maintenance') {
          availableRooms.push(room);
        }
      }
      rooms = availableRooms;
    }

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
exports.getRoom = async (req, res, next) => {
  try {
    const room = await dataStore.findRoomById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found with provided identifier',
      });
    }

    // Get reviews for this room
    const reviews = await dataStore.getReviews(room._id);

    res.status(200).json({
      success: true,
      room,
      reviews,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Check room availability for dates
// @route   GET /api/rooms/:id/availability
// @access  Public
exports.checkRoomAvailability = async (req, res, next) => {
  try {
    const { checkIn, checkOut } = req.query;
    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both checkIn and checkOut dates',
      });
    }

    const isAvailable = await dataStore.checkAvailability(req.params.id, checkIn, checkOut);
    res.status(200).json({
      success: true,
      roomId: req.params.id,
      isAvailable,
      checkIn,
      checkOut,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private (Admin only)
exports.createRoom = async (req, res, next) => {
  try {
    const { roomNumber, title, roomType, pricePerNight, capacity, description, amenities, images, floor, bedType, sizeSqFt } = req.body;

    if (!roomNumber || !title || !roomType || !pricePerNight || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roomNumber, title, roomType, pricePerNight, and description',
      });
    }

    // Check if room number already exists
    const existing = await dataStore.findRoomByNumber(roomNumber);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Room number ${roomNumber} is already registered`,
      });
    }

    const room = await dataStore.createRoom({
      roomNumber,
      title,
      roomType,
      pricePerNight: Number(pricePerNight),
      capacity: capacity || { adults: 2, children: 0 },
      description,
      amenities: amenities || ['High-Speed Wi-Fi', 'Smart TV', 'Climate Control'],
      images: images && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80'
      ],
      floor: Number(floor || 1),
      bedType: bedType || 'King Bed',
      sizeSqFt: Number(sizeSqFt || 450),
      status: 'available',
    });

    res.status(201).json({
      success: true,
      message: 'Room registered successfully',
      room,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update room details or status
// @route   PUT /api/rooms/:id
// @access  Private (Admin or Staff)
exports.updateRoom = async (req, res, next) => {
  try {
    const room = await dataStore.findRoomById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    const updated = await dataStore.updateRoom(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Room details updated',
      room: updated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Admin only)
exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await dataStore.findRoomById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    await dataStore.deleteRoom(req.params.id);

    res.status(200).json({
      success: true,
      message: `Room ${room.roomNumber} has been successfully deleted`,
    });
  } catch (err) {
    next(err);
  }
};
