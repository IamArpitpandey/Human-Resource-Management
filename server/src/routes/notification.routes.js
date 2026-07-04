const router = require('express').Router();
const notificationController = require('../controllers/notification.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/', notificationController.getOwn);
router.patch('/:id/read', notificationController.markRead);

module.exports = router;
