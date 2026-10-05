const express = require('express');
const authController = require('../Controllers/authController');
const validate = require('../Middliwares/validate');
const { registerSchema, loginSchema } = require('../validations/authValidation');
const { authLimiter } = require('../Middliwares/rateLimiter');

const router = express.Router();

// تطبيق الحظر الصارم على عمليات الدخول والتسجيل
router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', authController.logout);

module.exports = router;
