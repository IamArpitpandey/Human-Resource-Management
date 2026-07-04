const asyncHandler = require('express-async-handler');
const leaveService = require('../services/leave.service');
const { sendSuccess } = require('../utils/ApiResponse');
const notificationService = require('../services/notification.service');
const Employee = require('../models/Employee');

const apply = asyncHandler(async (req, res) => {
  const data = await leaveService.apply(req.user.userId, req.body);
  sendSuccess(res, 201, 'Leave request submitted', data);
});

const getOwnHistory = asyncHandler(async (req, res) => {
  const data = await leaveService.getOwnHistory(req.user.userId);
  sendSuccess(res, 200, 'Leave history fetched', data);
});

const getAll = asyncHandler(async (req, res) => {
  const data = await leaveService.getAll(req.query.status);
  sendSuccess(res, 200, 'Leave requests fetched', data);
});

const decide = asyncHandler(async (req, res) => {
  const { status, adminComment } = req.body;
  const data = await leaveService.decide(req.params.id, status, adminComment);

  const employee = await Employee.findById(data.employeeId);
  if (employee) {
    await notificationService.notify(
      employee.userId,
      `Leave ${status.toLowerCase()}`,
      `Your ${data.leaveType} leave request has been ${status.toLowerCase()}.`
    );
  }

  sendSuccess(res, 200, `Leave request ${status.toLowerCase()}`, data);
});

module.exports = { apply, getOwnHistory, getAll, decide };
