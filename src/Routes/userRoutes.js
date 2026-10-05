const express = require('express');
const userController = require('../Controllers/userController');
const { protect } = require('../Middliwares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/me', (req, res) => {
  res.status(200).json({ status: 'success', data: { user: req.user } });
});

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

module.exports = router;
