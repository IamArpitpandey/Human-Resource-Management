const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const { ApiError } = require('../utils/ApiError');

const OFFICE_START_HOUR = 9;
const OFFICE_START_MINUTE = 30;

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function checkIn(userId) {
  const employee = await Employee.findOne({ userId });
  if (!employee) throw ApiError.notFound('Employee profile not found');

  const today = startOfDay(new Date());
  const existing = await Attendance.findOne({ employeeId: employee._id, date: today });
  if (existing) throw ApiError.conflict('Already checked in today');

  const now = new Date();
  const isLate =
    now.getHours() > OFFICE_START_HOUR ||
    (now.getHours() === OFFICE_START_HOUR && now.getMinutes() > OFFICE_START_MINUTE);

  return Attendance.create({
    employeeId: employee._id,
    date: today,
    checkIn: now,
    status: 'PRESENT',
    isLate,
  });
}

async function checkOut(userId) {
  const employee = await Employee.findOne({ userId });
  if (!employee) throw ApiError.notFound('Employee profile not found');

  const today = startOfDay(new Date());
  const record = await Attendance.findOne({ employeeId: employee._id, date: today });
  if (!record) throw ApiError.badRequest('You have not checked in today');
  if (record.checkOut) throw ApiError.conflict('Already checked out today');

  const checkOutTime = new Date();
  const workingHours = (checkOutTime.getTime() - record.checkIn.getTime()) / (1000 * 60 * 60);

  record.checkOut = checkOutTime;
  record.workingHours = Math.round(workingHours * 100) / 100;
  if (workingHours < 4) record.status = 'HALF_DAY';
  await record.save();
  return record;
}

async function getOwnAttendance(userId, from, to) {
  const employee = await Employee.findOne({ userId });
  if (!employee) throw ApiError.notFound('Employee profile not found');

  const fromDate = from ? new Date(from) : new Date(new Date().setDate(1));
  const toDate = to ? new Date(to) : new Date();

  return Attendance.find({ employeeId: employee._id, date: { $gte: fromDate, $lte: toDate } }).sort({
    date: 1,
  });
}

async function getAllAttendance(from, to) {
  const fromDate = from ? new Date(from) : new Date(new Date().setDate(1));
  const toDate = to ? new Date(to) : new Date();
  return Attendance.find({ date: { $gte: fromDate, $lte: toDate } })
    .populate('employeeId', 'firstName lastName')
    .sort({ date: -1 });
}

async function getTodaySummary() {
  const today = startOfDay(new Date());
  return Attendance.aggregate([
    { $match: { date: today } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
}

module.exports = { checkIn, checkOut, getOwnAttendance, getAllAttendance, getTodaySummary };
