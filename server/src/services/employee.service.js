const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const User = require('../models/User');
const { ApiError } = require('../utils/ApiError');

const SALT_ROUNDS = 10;

async function getOwnProfile(userId) {
  const employee = await Employee.findOne({ userId }).populate('departmentId');
  if (!employee) throw ApiError.notFound('Employee profile not found');
  return employee;
}

async function updateOwnProfile(userId, data) {
  const employee = await Employee.findOne({ userId });
  if (!employee) throw ApiError.notFound('Employee profile not found');
  Object.assign(employee, data);
  await employee.save();
  return employee;
}

async function listEmployees(page, limit, search) {
  const skip = (page - 1) * limit;
  const filter = search
    ? { $or: [{ firstName: new RegExp(search, 'i') }, { lastName: new RegExp(search, 'i') }] }
    : {};

  const [items, total] = await Promise.all([
    Employee.find(filter).populate('departmentId').populate('userId', 'email employeeId role').skip(skip).limit(limit).sort({ createdAt: -1 }),
    Employee.countDocuments(filter),
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

async function getById(id) {
  const employee = await Employee.findById(id).populate('departmentId').populate('userId', 'email employeeId role');
  if (!employee) throw ApiError.notFound('Employee not found');
  return employee;
}

async function createEmployee(input) {
  const existingEmail = await User.findOne({ email: input.email });
  if (existingEmail) throw ApiError.conflict('Email already in use');
  const existingEmpId = await User.findOne({ employeeId: input.employeeId });
  if (existingEmpId) throw ApiError.conflict('Employee ID already in use');

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await User.create({
    employeeId: input.employeeId,
    email: input.email,
    password: hashedPassword,
    role: input.role || 'EMPLOYEE',
    isEmailVerified: true,
  });

  const employee = await Employee.create({
    userId: user._id,
    firstName: input.firstName,
    lastName: input.lastName,
    departmentId: input.departmentId || null,
    designation: input.designation || null,
  });

  return { user, employee };
}

async function adminUpdateEmployee(id, data) {
  const employee = await Employee.findById(id);
  if (!employee) throw ApiError.notFound('Employee not found');
  Object.assign(employee, data);
  await employee.save();
  return employee;
}

async function deleteEmployee(id) {
  const employee = await Employee.findById(id);
  if (!employee) throw ApiError.notFound('Employee not found');
  await User.deleteOne({ _id: employee.userId });
  await employee.deleteOne();
  return { deleted: true };
}

module.exports = {
  getOwnProfile,
  updateOwnProfile,
  listEmployees,
  getById,
  createEmployee,
  adminUpdateEmployee,
  deleteEmployee,
};
