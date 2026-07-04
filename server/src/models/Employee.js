const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, default: null },
    address: { type: String, default: null },
    profilePicture: { type: String, default: null },
    designation: { type: String, default: null },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', default: null },
    dateOfJoining: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
