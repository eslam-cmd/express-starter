const AppError = require("../utils/AppError");

const notFoundHandler = (req, res, next) => {
  next(new AppError(`المسار ${req.originalUrl} غير موجود.`, 404));
};

const globalErrorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const status = err.status || (statusCode >= 500 ? "error" : "fail");

  const response = {
    status,
    message:
      statusCode === 500 && process.env.NODE_ENV !== "development"
        ? "حدث خطأ داخلي في الخادم."
        : err.message,
  };

  // إظهار مكان وقوع الخطأ بالتفصيل في بيئة التطوير فقط
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = { notFoundHandler, globalErrorHandler };
