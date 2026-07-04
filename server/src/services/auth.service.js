const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const Employee = require('../models/Employee');
const RefreshToken = require('../models/RefreshToken');
const { ApiError } = require('../utils/ApiError');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/token');
const { sendMail, verificationEmailTemplate, resetPasswordEmailTemplate } = require('../utils/mailer');

const SALT_ROUNDS = 10;
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

async function signup(input) {
  const existingEmail = await User.findOne({ email: input.email });
  if (existingEmail) throw ApiError.conflict('Email is already registered');

  const existingEmpId = await User.findOne({ employeeId: input.employeeId });
  if (existingEmpId) throw ApiError.conflict('Employee ID is already registered');

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
  const emailVerifyToken = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    employeeId: input.employeeId,
    email: input.email,
    password: hashedPassword,
    role: input.role || 'EMPLOYEE',
    emailVerifyToken,
  });

  await Employee.create({ userId: user._id, firstName: input.firstName, lastName: input.lastName });

  await sendMail(user.email, 'Verify your HRMS account', verificationEmailTemplate(emailVerifyToken));

  return { id: user._id, email: user.email, employeeId: user.employeeId, role: user.role };
}

async function verifyEmail(token) {
  const user = await User.findOne({ emailVerifyToken: token });
  if (!user) throw ApiError.badRequest('Invalid or expired verification token');
  user.isEmailVerified = true;
  user.emailVerifyToken = null;
  await user.save();
  return { verified: true };
}

async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user) throw ApiError.unauthorized('Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw ApiError.unauthorized('Invalid email or password');

  const employee = await Employee.findOne({ userId: user._id });

  const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role, employeeId: user.employeeId });
  const refreshToken = signRefreshToken(user._id.toString());

  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      employeeId: user.employeeId,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      employee,
    },
  };
}

async function refresh(refreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const stored = await RefreshToken.findOne({ token: refreshToken });
  if (!stored || stored.expiresAt < new Date()) {
    throw ApiError.unauthorized('Refresh token expired or revoked');
  }

  const user = await User.findById(payload.userId);
  if (!user) throw ApiError.unauthorized('User not found');

  const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role, employeeId: user.employeeId });
  return { accessToken };
}

async function logout(refreshToken) {
  await RefreshToken.deleteOne({ token: refreshToken });
  return { loggedOut: true };
}

async function forgotPassword(email) {
  const user = await User.findOne({ email });
  if (!user) return { sent: true }; // do not reveal existence

  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await user.save();

  await sendMail(user.email, 'Reset your HRMS password', resetPasswordEmailTemplate(token));
  return { sent: true };
}

async function resetPassword(token, newPassword) {
  const user = await User.findOne({ resetToken: token });
  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    throw ApiError.badRequest('Invalid or expired reset token');
  }
  user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();
  await RefreshToken.deleteMany({ userId: user._id });
  return { reset: true };
}

module.exports = { signup, verifyEmail, login, refresh, logout, forgotPassword, resetPassword };
