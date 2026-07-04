const { z } = require('zod');

const rangeQuerySchema = z.object({
  query: z.object({
    from: z.string().optional(),
    to: z.string().optional(),
  }),
});

module.exports = { rangeQuerySchema };
