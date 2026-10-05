const AppError = require('../utils/AppError');

const notFoundHandler = (req, res, next) => {
  next(new AppError(`المسار ${req.originalUrl} غير موجود.`, 404));
};

const globalErrorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: err.status || 'error',
    message: statusCode === 500 && process.env.NODE_ENV !== 'development'
      ? 'حدث خطأ داخلي في الخادم.'
      : err.message,
  });
};

module.exports = { notFoundHandler, globalErrorHandler };
