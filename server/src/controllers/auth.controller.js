const asyncHandler = require('express-async-handler');
const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/ApiResponse');

const signup = asyncHandler(async (req, res) => {
  const result = await authService.signup(req.body);
  sendSuccess(res, 201, 'Signup successful. Please verify your email.', result);
});

const verifyEmail = asyncHandler(async (req, res) => {
  const result = await authService.verifyEmail(req.body.token);
  sendSuccess(res, 200, 'Email verified successfully', result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body.email, req.body.password);
  sendSuccess(res, 200, 'Login successful', result);
});

const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.body.refreshToken);
  sendSuccess(res, 200, 'Token refreshed', result);
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  sendSuccess(res, 200, 'Logged out successfully');
});

const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  sendSuccess(res, 200, 'If the email exists, a reset link has been sent', result);
});

const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body.token, req.body.newPassword);
  sendSuccess(res, 200, 'Password reset successfully', result);
});

module.exports = { signup, verifyEmail, login, refresh, logout, forgotPassword, resetPassword };
