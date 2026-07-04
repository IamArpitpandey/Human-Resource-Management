const nodemailer = require('nodemailer');
const env = require('../config/env');

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.port === 465,
  auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
});

async function sendMail(to, subject, html) {
  if (!env.smtp.host) {
    console.log(`[MAIL SKIPPED - no SMTP configured] To: ${to} | Subject: ${subject}`);
    return;
  }
  await transporter.sendMail({ from: env.smtp.from, to, subject, html });
}

function verificationEmailTemplate(token) {
  const link = `${env.clientUrl}/verify-email?token=${token}`;
  return `<p>Welcome to HRMS! Please verify your email by clicking <a href="${link}">here</a>.</p>`;
}

function resetPasswordEmailTemplate(token) {
  const link = `${env.clientUrl}/reset-password?token=${token}`;
  return `<p>You requested a password reset. Click <a href="${link}">here</a> to reset it. This link expires in 1 hour.</p>`;
}

module.exports = { sendMail, verificationEmailTemplate, resetPasswordEmailTemplate };
