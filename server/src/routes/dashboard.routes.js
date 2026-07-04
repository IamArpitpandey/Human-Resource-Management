const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const dashboardService = require('../services/dashboard.service');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const { sendSuccess } = require('../utils/ApiResponse');
const { ApiError } = require('../utils/ApiError');

router.use(authenticate);

router.get(
  '/employee',
  asyncHandler(async (req, res) => {
    const data = await dashboardService.getEmployeeDashboard(req.user.userId);
    if (!data) throw ApiError.notFound('Employee profile not found');
    sendSuccess(res, 200, 'Employee dashboard fetched', data);
  })
);

router.get(
  '/admin',
  authorize('ADMIN', 'HR'),
  asyncHandler(async (_req, res) => {
    const data = await dashboardService.getAdminDashboard();
    sendSuccess(res, 200, 'Admin dashboard fetched', data);
  })
);

module.exports = router;
