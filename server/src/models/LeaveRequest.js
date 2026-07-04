const mongoose = require('mongoose');
const { Schema } = mongoose;

const leaveRequestSchema = new Schema(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    leaveType: { type: String, enum: ['PAID', 'SICK', 'CASUAL', 'UNPAID'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    remarks: { type: String, default: null },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    adminComment: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
