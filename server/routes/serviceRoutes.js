const express = require('express');
const {
  getServices,
  createService,
  updateServiceStatus,
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', authorize('admin', 'staff'), getServices);
router.post('/', createService);
router.put('/:id', authorize('admin', 'staff'), updateServiceStatus);

module.exports = router;
