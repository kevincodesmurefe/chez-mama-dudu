const express = require('express');
const router = express.Router();

const { register, updateUserStatus, loggin, getUsers, getUserById } = require('../controllers/authControllers');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');


router.post('/register', register);
router.get('/', verifyToken, requireRole("admin"), getUsers);
router.get('/:id', verifyToken, requireRole("admin"), getUserById);
router.put('/:id/update', verifyToken, requireRole("admin"), updateUserStatus);
router.post('/', loggin);

module.exports = router;