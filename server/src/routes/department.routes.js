const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { z } = require('zod');
const Department = require('../models/Department');
const Employee = require('../models/Employee');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const { validate } = require('../middleware/validate.middleware');
const { sendSuccess } = require('../utils/ApiResponse');
const { ApiError } = require('../utils/ApiError');

const createDeptSchema = z.object({ body: z.object({ name: z.string().min(1) }) });

router.use(authenticate);

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const departments = await Department.find().lean();
    const withCounts = await Promise.all(
      departments.map(async (d) => ({
        ...d,
        employeeCount: await Employee.countDocuments({ departmentId: d._id }),
      }))
    );
    sendSuccess(res, 200, 'Departments fetched', withCounts);
  })
);

router.post(
  '/',
  authorize('ADMIN'),
  validate(createDeptSchema),
  asyncHandler(async (req, res) => {
    const dept = await Department.create({ name: req.body.name });
    sendSuccess(res, 201, 'Department created', dept);
  })
);

router.delete(
  '/:id',
  authorize('ADMIN'),
  asyncHandler(async (req, res) => {
    const dept = await Department.findByIdAndDelete(req.params.id);
    if (!dept) throw ApiError.notFound('Department not found');
    sendSuccess(res, 200, 'Department deleted');
  })
);

module.exports = router;
