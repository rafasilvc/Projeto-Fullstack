const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/projectController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/', ctrl.create);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
