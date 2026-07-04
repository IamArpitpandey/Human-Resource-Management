const router = require('express').Router();
const employeeController = require('../controllers/employee.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  updateOwnProfileSchema,
  createEmployeeSchema,
  adminUpdateEmployeeSchema,
  employeeIdParamSchema,
} = require('../validators/employee.validator');

router.use(authenticate);

router.get('/me', employeeController.getOwnProfile);
router.patch('/me', validate(updateOwnProfileSchema), employeeController.updateOwnProfile);

router.get('/', authorize('ADMIN', 'HR'), employeeController.listEmployees);
router.post('/', authorize('ADMIN'), validate(createEmployeeSchema), employeeController.create);
router.get('/:id', authorize('ADMIN', 'HR'), validate(employeeIdParamSchema), employeeController.getById);
router.patch('/:id', authorize('ADMIN', 'HR'), validate(adminUpdateEmployeeSchema), employeeController.adminUpdate);
router.delete('/:id', authorize('ADMIN'), validate(employeeIdParamSchema), employeeController.remove);

module.exports = router;
