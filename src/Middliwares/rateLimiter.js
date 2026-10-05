const rateLimit = require('express-rate-limit');

// 1. محدد عام لكامل واجهة التطبيق (100 طلب لكل 15 دقيقة من نفس الـ IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'تم تجاوز الحد المسموح من الطلبات، يرجى المحاولة بعد 15 دقيقة.',
  },
});

// 2. محدد صارم لمسارات الـ Auth (5 محاولات لكل 15 دقيقة) لمنع هجمات التخمين
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'محاولات دخول كثيرة خاطئة، يرجى الانتظار 15 دقيقة قبل المحاولة مجدداً.',
  },
});

module.exports = {
  globalLimiter,
  authLimiter,
};
