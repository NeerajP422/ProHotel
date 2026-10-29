const express = require('express');
const { getRoomReviews, createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/room/:roomId', getRoomReviews);
router.post('/', protect, createReview);

module.exports = router;
