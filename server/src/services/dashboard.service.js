const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const SalaryStructure = require('../models/SalaryStructure');
const Payroll = require('../models/Payroll');
const Department = require('../models/Department');

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function getEmployeeDashboard(userId) {
  const employee = await Employee.findOne({ userId }).populate('departmentId');
  if (!employee) return null;

  const fromDate = new Date(new Date().setDate(1));
  const toDate = new Date();

  const [attendanceThisMonth, leaves, salary] = await Promise.all([
    Attendance.find({ employeeId: employee._id, date: { $gte: fromDate, $lte: toDate } }),
    LeaveRequest.find({ employeeId: employee._id }).sort({ createdAt: -1 }),
    SalaryStructure.findOne({ employeeId: employee._id }),
  ]);

  return {
    profile: employee,
    attendanceSummary: {
      present: attendanceThisMonth.filter((a) => a.status === 'PRESENT').length,
      absent: attendanceThisMonth.filter((a) => a.status === 'ABSENT').length,
      halfDay: attendanceThisMonth.filter((a) => a.status === 'HALF_DAY').length,
    },
    leaveSummary: {
      pending: leaves.filter((l) => l.status === 'PENDING').length,
      approved: leaves.filter((l) => l.status === 'APPROVED').length,
      rejected: leaves.filter((l) => l.status === 'REJECTED').length,
    },
    salarySummary: salary,
    recentLeaves: leaves.slice(0, 5),
  };
}

async function getAdminDashboard() {
  const today = startOfDay(new Date());

  const [employeeCount, pendingLeaves, todayAttendance, payrollCount, departmentCount] = await Promise.all([
    Employee.countDocuments(),
    LeaveRequest.countDocuments({ status: 'PENDING' }),
    Attendance.aggregate([{ $match: { date: today } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Payroll.countDocuments(),
    Department.countDocuments(),
  ]);

  return { employeeCount, pendingLeaves, todayAttendance, payrollCount, departmentCount };
}

module.exports = { getEmployeeDashboard, getAdminDashboard };
