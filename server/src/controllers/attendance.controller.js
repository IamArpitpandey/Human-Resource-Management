const asyncHandler = require('express-async-handler');
const attendanceService = require('../services/attendance.service');
const { sendSuccess } = require('../utils/ApiResponse');

const checkIn = asyncHandler(async (req, res) => {
  const data = await attendanceService.checkIn(req.user.userId);
  sendSuccess(res, 201, 'Checked in successfully', data);
});

const checkOut = asyncHandler(async (req, res) => {
  const data = await attendanceService.checkOut(req.user.userId);
  sendSuccess(res, 200, 'Checked out successfully', data);
});

const getOwn = asyncHandler(async (req, res) => {
  const data = await attendanceService.getOwnAttendance(req.user.userId, req.query.from, req.query.to);
  sendSuccess(res, 200, 'Attendance fetched', data);
});

const getAll = asyncHandler(async (req, res) => {
  const data = await attendanceService.getAllAttendance(req.query.from, req.query.to);
  sendSuccess(res, 200, 'Attendance fetched', data);
});

const todaySummary = asyncHandler(async (_req, res) => {
  const data = await attendanceService.getTodaySummary();
  sendSuccess(res, 200, "Today's summary fetched", data);
});

module.exports = { checkIn, checkOut, getOwn, getAll, todaySummary };
