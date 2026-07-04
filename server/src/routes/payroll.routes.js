const router = require('express').Router();
const payrollController = require('../controllers/payroll.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const { validate } = require('../middleware/validate.middleware');
const { updateSalarySchema, generatePayrollSchema } = require('../validators/payroll.validator');

router.use(authenticate);

router.get('/me/salary', payrollController.getOwnSalary);
router.get('/me/payslips', payrollController.getOwnPayslips);

router.get('/', authorize('ADMIN', 'HR'), payrollController.getAll);
router.put(
  '/:employeeId/salary-structure',
  authorize('ADMIN'),
  validate(updateSalarySchema),
  payrollController.updateSalaryStructure
);
router.post('/generate', authorize('ADMIN'), validate(generatePayrollSchema), payrollController.generatePayroll);

module.exports = router;
