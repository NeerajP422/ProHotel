const dataStore = require('../services/dataStore');

// @desc    Get all service and housekeeping requests
// @route   GET /api/services
// @access  Private (Admin or Staff)
exports.getServices = async (req, res, next) => {
  try {
    const { status, room } = req.query;
    const services = await dataStore.getServices({ status, room });
    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit a new service / housekeeping request
// @route   POST /api/services
// @access  Private (Guest or Staff)
exports.createService = async (req, res, next) => {
  try {
    const { roomId, bookingId, type, priority, notes } = req.body;

    if (!roomId || !type || !notes) {
      return res.status(400).json({
        success: false,
        message: 'Please specify room, service type, and details/notes',
      });
    }

    const room = await dataStore.findRoomById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    const service = await dataStore.createService({
      room: roomId,
      booking: bookingId || null,
      user: req.user._id,
      type,
      priority: priority || 'medium',
      notes,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Service request dispatched to front desk & housekeeping team.',
      service,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update service request status
// @route   PUT /api/services/:id
// @access  Private (Admin or Staff)
exports.updateServiceStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const updateData = {};
    if (status) {
      updateData.status = status;
      if (status === 'completed') {
        updateData.completedAt = new Date();
      }
    }
    if (notes) updateData.notes = notes;

    const updated = await dataStore.updateService(req.params.id, updateData);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service status updated',
      service: updated,
    });
  } catch (err) {
    next(err);
  }
};
