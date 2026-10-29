const dataStore = require('../services/dataStore');

// @desc    Get dashboard metrics, occupancy stats, and operational overview
// @route   GET /api/dashboard/stats
// @access  Private (Admin or Staff)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const stats = await dataStore.getDashboardStats();
    res.status(200).json({
      success: true,
      stats,
    });
  } catch (err) {
    next(err);
  }
};
