const mongoose = require('mongoose');
const { Schema } = mongoose;

const salaryStructureSchema = new Schema(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true, unique: true },
    basic: { type: Number, required: true },
    hra: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SalaryStructure', salaryStructureSchema);
