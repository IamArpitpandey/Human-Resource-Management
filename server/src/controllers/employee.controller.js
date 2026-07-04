const asyncHandler = require('express-async-handler');
const employeeService = require('../services/employee.service');
const { sendSuccess } = require('../utils/ApiResponse');

const getOwnProfile = asyncHandler(async (req, res) => {
  const data = await employeeService.getOwnProfile(req.user.userId);
  sendSuccess(res, 200, 'Profile fetched', data);
});

const updateOwnProfile = asyncHandler(async (req, res) => {
  const data = await employeeService.updateOwnProfile(req.user.userId, req.body);
  sendSuccess(res, 200, 'Profile updated', data);
});

const listEmployees = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);
  const data = await employeeService.listEmployees(page, limit, req.query.search);
  sendSuccess(res, 200, 'Employees fetched', data);
});

const getById = asyncHandler(async (req, res) => {
  const data = await employeeService.getById(req.params.id);
  sendSuccess(res, 200, 'Employee fetched', data);
});

const create = asyncHandler(async (req, res) => {
  const data = await employeeService.createEmployee(req.body);
  sendSuccess(res, 201, 'Employee created', data);
});

const adminUpdate = asyncHandler(async (req, res) => {
  const data = await employeeService.adminUpdateEmployee(req.params.id, req.body);
  sendSuccess(res, 200, 'Employee updated', data);
});

const remove = asyncHandler(async (req, res) => {
  await employeeService.deleteEmployee(req.params.id);
  sendSuccess(res, 200, 'Employee deleted');
});

module.exports = { getOwnProfile, updateOwnProfile, listEmployees, getById, create, adminUpdate, remove };
