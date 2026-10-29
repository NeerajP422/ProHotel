const express = require('express');
const {
  getRooms,
  getRoom,
  checkRoomAvailability,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getRooms)
  .post(protect, authorize('admin'), createRoom);

router.route('/:id')
  .get(getRoom)
  .put(protect, authorize('admin', 'staff'), updateRoom)
  .delete(protect, authorize('admin'), deleteRoom);

router.get('/:id/availability', checkRoomAvailability);

module.exports = router;
