const SalaryStructure = require('../models/SalaryStructure');
const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const { ApiError } = require('../utils/ApiError');

async function getOwnSalary(userId) {
  const employee = await Employee.findOne({ userId });
  if (!employee) throw ApiError.notFound('Employee profile not found');
  const salary = await SalaryStructure.findOne({ employeeId: employee._id });
  if (!salary) throw ApiError.notFound('Salary structure not set for this employee yet');
  return salary;
}

async function getOwnPayslips(userId) {
  const employee = await Employee.findOne({ userId });
  if (!employee) throw ApiError.notFound('Employee profile not found');
  return Payroll.find({ employeeId: employee._id }).sort({ year: -1, month: -1 });
}

async function updateSalaryStructure(employeeId, data) {
  const employee = await Employee.findById(employeeId);
  if (!employee) throw ApiError.notFound('Employee not found');

  return SalaryStructure.findOneAndUpdate(
    { employeeId },
    { $set: data },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
}

async function generatePayroll(input) {
  const employee = await Employee.findById(input.employeeId);
  if (!employee) throw ApiError.notFound('Employee not found');

  const existing = await Payroll.findOne({ employeeId: input.employeeId, month: input.month, year: input.year });
  if (existing) throw ApiError.conflict('Payroll already generated for this employee for this month');

  const salary = await SalaryStructure.findOne({ employeeId: input.employeeId });
  if (!salary) throw ApiError.badRequest('Salary structure not set for this employee');

  const grossPay = salary.basic + salary.hra + salary.allowances;
  const netPay = grossPay - salary.deductions;

  return Payroll.create({
    employeeId: input.employeeId,
    month: input.month,
    year: input.year,
    grossPay,
    netPay,
    deductions: salary.deductions,
    allowances: salary.allowances + salary.hra,
  });
}

async function getAllPayrolls(month, year) {
  const filter = {};
  if (month) filter.month = month;
  if (year) filter.year = year;
  return Payroll.find(filter).populate('employeeId', 'firstName lastName').sort({ year: -1, month: -1 });
}

module.exports = { getOwnSalary, getOwnPayslips, updateSalaryStructure, generatePayroll, getAllPayrolls };
