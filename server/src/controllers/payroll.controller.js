const asyncHandler = require('express-async-handler');
const payrollService = require('../services/payroll.service');
const { sendSuccess } = require('../utils/ApiResponse');

const getOwnSalary = asyncHandler(async (req, res) => {
  const data = await payrollService.getOwnSalary(req.user.userId);
  sendSuccess(res, 200, 'Salary fetched', data);
});

const getOwnPayslips = asyncHandler(async (req, res) => {
  const data = await payrollService.getOwnPayslips(req.user.userId);
  sendSuccess(res, 200, 'Payslips fetched', data);
});

const updateSalaryStructure = asyncHandler(async (req, res) => {
  const data = await payrollService.updateSalaryStructure(req.params.employeeId, req.body);
  sendSuccess(res, 200, 'Salary structure updated', data);
});

const generatePayroll = asyncHandler(async (req, res) => {
  const data = await payrollService.generatePayroll(req.body);
  sendSuccess(res, 201, 'Payroll generated', data);
});

const getAll = asyncHandler(async (req, res) => {
  const month = req.query.month ? parseInt(req.query.month, 10) : undefined;
  const year = req.query.year ? parseInt(req.query.year, 10) : undefined;
  const data = await payrollService.getAllPayrolls(month, year);
  sendSuccess(res, 200, 'Payrolls fetched', data);
});

module.exports = { getOwnSalary, getOwnPayslips, updateSalaryStructure, generatePayroll, getAll };
