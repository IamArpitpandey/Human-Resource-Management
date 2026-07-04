const { z } = require('zod');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const signupSchema = z.object({
  body: z.object({
    employeeId: z.string().min(1, 'Employee ID is required'),
    email: z.string().email('Invalid email address'),
    password: passwordSchema,
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    role: z.enum(['EMPLOYEE', 'HR']).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({ email: z.string().email('Invalid email address') }),
});

const resetPasswordSchema = z.object({
  body: z.object({ token: z.string().min(1), newPassword: passwordSchema }),
});

const verifyEmailSchema = z.object({
  body: z.object({ token: z.string().min(1) }),
});

const refreshTokenSchema = z.object({
  body: z.object({ refreshToken: z.string().min(1) }),
});

module.exports = {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  refreshTokenSchema,
};
