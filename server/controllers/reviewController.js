const dataStore = require('../services/dataStore');

// @desc    Get reviews for a room
// @route   GET /api/reviews/room/:roomId
// @access  Public
exports.getRoomReviews = async (req, res, next) => {
  try {
    const reviews = await dataStore.getReviews(req.params.roomId);
    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a review for a room
// @route   POST /api/reviews
// @access  Private (Guest)
exports.createReview = async (req, res, next) => {
  try {
    const { roomId, rating, title, comment, bookingId } = req.body;

    if (!roomId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roomId, rating (1-5), and review comment',
      });
    }

    const room = await dataStore.findRoomById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    const review = await dataStore.createReview({
      user: req.user._id,
      room: roomId,
      booking: bookingId || null,
      rating: Number(rating),
      title: title || 'Exceptional Stay',
      comment,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been published.',
      review,
    });
  } catch (err) {
    next(err);
  }
};
