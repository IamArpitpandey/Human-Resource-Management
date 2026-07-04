const LeaveRequest = require('../models/LeaveRequest');
const Employee = require('../models/Employee');
const { ApiError } = require('../utils/ApiError');

async function apply(userId, input) {
  const employee = await Employee.findOne({ userId });
  if (!employee) throw ApiError.notFound('Employee profile not found');

  const startDate = new Date(input.startDate);
  const endDate = new Date(input.endDate);

  const overlap = await LeaveRequest.findOne({
    employeeId: employee._id,
    status: { $in: ['PENDING', 'APPROVED'] },
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  });
  if (overlap) throw ApiError.conflict('You already have a leave request overlapping these dates');

  return LeaveRequest.create({
    employeeId: employee._id,
    leaveType: input.leaveType,
    startDate,
    endDate,
    remarks: input.remarks,
  });
}

async function getOwnHistory(userId) {
  const employee = await Employee.findOne({ userId });
  if (!employee) throw ApiError.notFound('Employee profile not found');
  return LeaveRequest.find({ employeeId: employee._id }).sort({ createdAt: -1 });
}

async function getAll(status) {
  return LeaveRequest.find(status ? { status } : {})
    .populate('employeeId', 'firstName lastName')
    .sort({ createdAt: -1 });
}

async function decide(id, status, adminComment) {
  const leave = await LeaveRequest.findById(id);
  if (!leave) throw ApiError.notFound('Leave request not found');
  if (leave.status !== 'PENDING') throw ApiError.conflict('This leave request has already been decided');

  leave.status = status;
  leave.adminComment = adminComment || null;
  await leave.save();
  return leave;
}

module.exports = { apply, getOwnHistory, getAll, decide };
