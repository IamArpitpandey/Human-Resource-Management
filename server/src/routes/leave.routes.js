const router = require('express').Router();
const leaveController = require('../controllers/leave.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const { validate } = require('../middleware/validate.middleware');
const { applyLeaveSchema, decideLeaveSchema } = require('../validators/leave.validator');

router.use(authenticate);

router.post('/', validate(applyLeaveSchema), leaveController.apply);
router.get('/me', leaveController.getOwnHistory);

router.get('/', authorize('ADMIN', 'HR'), leaveController.getAll);
router.patch('/:id/decision', authorize('ADMIN', 'HR'), validate(decideLeaveSchema), leaveController.decide);

module.exports = router;
