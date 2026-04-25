const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', authenticate, ctrl.getMe);
router.get('/', authenticate, authorizeAdmin, ctrl.getAll);
router.put('/:id', authenticate, ctrl.update);
router.patch('/:id/password', authenticate, ctrl.updatePassword);
router.delete('/:id', authenticate, authorizeAdmin, ctrl.remove);

module.exports = router;
