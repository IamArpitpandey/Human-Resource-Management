const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');

const updateSalarySchema = z.object({
  body: z.object({
    basic: z.number().positive(),
    hra: z.number().nonnegative().optional(),
    allowances: z.number().nonnegative().optional(),
    deductions: z.number().nonnegative().optional(),
  }),
  params: z.object({ employeeId: objectId }),
});

const generatePayrollSchema = z.object({
  body: z.object({
    employeeId: objectId,
    month: z.number().int().min(1).max(12),
    year: z.number().int().min(2000),
  }),
});

module.exports = { updateSalarySchema, generatePayrollSchema };
