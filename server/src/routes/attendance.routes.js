const router = require('express').Router();
const attendanceController = require('../controllers/attendance.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const { validate } = require('../middleware/validate.middleware');
const { rangeQuerySchema } = require('../validators/attendance.validator');

router.use(authenticate);

router.post('/check-in', attendanceController.checkIn);
router.post('/check-out', attendanceController.checkOut);
router.get('/me', validate(rangeQuerySchema), attendanceController.getOwn);

router.get('/', authorize('ADMIN', 'HR'), validate(rangeQuerySchema), attendanceController.getAll);
router.get('/summary/today', authorize('ADMIN', 'HR'), attendanceController.todaySummary);

module.exports = router;
