const AppError = require('../utils/AppError');

const validate = (schema) => (req, res, next) => {
  try {
    // نقوم بفحص وتطهير المدخلات
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    // استخراج أخطاء Zod بتنسيق نظيف ومقروء
    const formattedErrors = error.issues.map((err) => ({
      field: err.path.slice(1).join('.'),
      message: err.message,
    }));

    return res.status(400).json({
      status: 'fail',
      message: 'بيانات المدخلات غير صحيحة.',
      errors: formattedErrors,
    });
  }
};

module.exports = validate;
