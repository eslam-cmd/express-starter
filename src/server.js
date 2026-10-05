require('dotenv').config();
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');

const routes = require('./Routes');
const { globalLimiter } = require('./Middliwares/rateLimiter');
const { notFoundHandler, globalErrorHandler } = require('./Middliwares/errorHandler');

const app = express();
// const compression = require('compression');
//app.use(compression());

// 1. Security HTTP Headers
app.use(helmet());

// 2. Rate Limiting لكامل التطبيق
app.use('/api', globalLimiter);

// 3. CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// 4. Body parser مع تحديد حجم البيانات بحد أقصى (10kb) لمنع إرهاق الذاكرة
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 5. قراءة الكوكيز
app.use(cookieParser());

// 6. الحماية من تلوث معلمات الرابط (Prevent HTTP Parameter Pollution)
app.use(hpp());

// 7. سجلات التطوير
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 8. مسار فحص الحالة الأساسي
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', uptime: process.uptime() });
});

// 1. المسارات الأساسية
app.use('/api', routes);

// 2. مسار 404 لأي مسار غير معرف (قبل معالج الأخطاء العام مباشرة)
app.use(notFoundHandler);

// 3. المعالج العام للأخطاء (دائماً آخر سطر ويحتوي على 4 باراميترات)
app.use(globalErrorHandler);

// 9. توجيه الـ API
app.use('/api/v1', routes);

// 10. معالجة المسارات المفقودة والأخطاء المركزية
app.use(notFoundHandler);
app.use(globalErrorHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running in https://localhost:${PORT} in ${process.env.NODE_ENV || 'production'} mode`);
  });
}

module.exports = app;
