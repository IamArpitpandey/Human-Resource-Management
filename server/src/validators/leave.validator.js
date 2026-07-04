const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');

const applyLeaveSchema = z.object({
  body: z
    .object({
      leaveType: z.enum(['PAID', 'SICK', 'CASUAL', 'UNPAID']),
      startDate: z.string(),
      endDate: z.string(),
      remarks: z.string().optional(),
    })
    .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
      message: 'startDate must be before or equal to endDate',
      path: ['startDate'],
    }),
});

const decideLeaveSchema = z.object({
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED']),
    adminComment: z.string().optional(),
  }),
  params: z.object({ id: objectId }),
});

module.exports = { applyLeaveSchema, decideLeaveSchema };
