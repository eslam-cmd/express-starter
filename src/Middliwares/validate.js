const { ZodError } = require("zod");

const validate = (schema) => async (req, res, next) => {
  try {
    // نقوم بفحص وتحديث المدخلات بالبيانات المعالجة والمطهّرة
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // استبدال المدخلات بالقيم المنقحة (Sanitized & Typed)
    if (parsed.body) req.body = parsed.body;
    if (parsed.query) req.query = parsed.query;
    if (parsed.params) req.params = parsed.params;

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map((err) => ({
        field: err.path.slice(1).join("."),
        message: err.message,
      }));

      return res.status(400).json({
        status: "fail",
        message: "بيانات المدخلات غير صحيحة.",
        errors: formattedErrors,
      });
    }

    // إذا كان خطأ غير متوقع، نمرره لمعالج الأخطاء العام
    next(error);
  }
};

module.exports = validate;
