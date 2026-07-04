const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');

const updateOwnProfileSchema = z.object({
  body: z.object({
    phone: z.string().min(6).optional(),
    address: z.string().min(1).optional(),
    profilePicture: z.string().url().optional(),
  }),
});

const createEmployeeSchema = z.object({
  body: z.object({
    employeeId: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    role: z.enum(['EMPLOYEE', 'HR', 'ADMIN']).optional(),
    departmentId: objectId.optional(),
    designation: z.string().optional(),
  }),
});

const adminUpdateEmployeeSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    designation: z.string().optional(),
    departmentId: objectId.optional(),
  }),
  params: z.object({ id: objectId }),
});

const employeeIdParamSchema = z.object({
  params: z.object({ id: objectId }),
});

module.exports = {
  updateOwnProfileSchema,
  createEmployeeSchema,
  adminUpdateEmployeeSchema,
  employeeIdParamSchema,
};
