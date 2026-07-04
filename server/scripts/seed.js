require('dotenv').config();
const bcrypt = require('bcryptjs');
const env = require('../src/config/env');
const { connectDB, mongoose } = require('../src/config/db');
const User = require('../src/models/User');
const Employee = require('../src/models/Employee');
const Department = require('../src/models/Department');
const SalaryStructure = require('../src/models/SalaryStructure');

async function seed() {
  await connectDB(env.mongoUri);
  console.log('Seeding database...');

  const deptNames = ['Engineering', 'Human Resources', 'Finance', 'Sales'];
  const departments = {};
  for (const name of deptNames) {
    const dept = await Department.findOneAndUpdate({ name }, { name }, { upsert: true, new: true });
    departments[name] = dept;
  }

  const adminEmail = 'admin@hrms.com';
  let adminUser = await User.findOne({ email: adminEmail });
  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    adminUser = await User.create({
      employeeId: 'ADM001',
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
      isEmailVerified: true,
    });
    const adminEmployee = await Employee.create({
      userId: adminUser._id,
      firstName: 'System',
      lastName: 'Admin',
      designation: 'Administrator',
      departmentId: departments['Human Resources']._id,
    });
    await SalaryStructure.create({
      employeeId: adminEmployee._id,
      basic: 80000,
      hra: 20000,
      allowances: 5000,
      deductions: 3000,
    });
    console.log(`Admin created: ${adminEmail} / Admin@123`);
  } else {
    console.log('Admin already exists, skipping.');
  }

  console.log('Seeding complete.');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
