const express = require('express');
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  processPayment,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All booking routes require authentication

router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.get('/', authorize('admin', 'staff'), getAllBookings);
router.get('/:id', getBookingById);
router.put('/:id/status', authorize('admin', 'staff'), updateBookingStatus);
router.post('/:id/cancel', cancelBooking);
router.post('/:id/payment', processPayment);

module.exports = router;
