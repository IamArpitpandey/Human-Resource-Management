const asyncHandler = require('express-async-handler');
const notificationService = require('../services/notification.service');
const { sendSuccess } = require('../utils/ApiResponse');

const getOwn = asyncHandler(async (req, res) => {
  const data = await notificationService.getOwn(req.user.userId);
  sendSuccess(res, 200, 'Notifications fetched', data);
});

const markRead = asyncHandler(async (req, res) => {
  await notificationService.markRead(req.params.id, req.user.userId);
  sendSuccess(res, 200, 'Notification marked as read');
});

module.exports = { getOwn, markRead };
