const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/employees', require('./employee.routes'));
router.use('/attendance', require('./attendance.routes'));
router.use('/leaves', require('./leave.routes'));
router.use('/payroll', require('./payroll.routes'));
router.use('/notifications', require('./notification.routes'));
router.use('/departments', require('./department.routes'));
router.use('/dashboard', require('./dashboard.routes'));

module.exports = router;
