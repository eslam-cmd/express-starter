const jwt = require('jsonwebtoken');
const prisma = require('../database/prisma');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('أنت غير مسجل الدخول، يرجى تسجيل الدخول للوصول.', 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError('رمز الدخول غير صالح أو منتهي الصلاحية.', 401));
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: decoded.id }
  });

  if (!currentUser) {
    return next(new AppError('المستخدم صاحب هذا الرمز لم يعد موجوداً.', 401));
  }

  currentUser.password = undefined;
  req.user = currentUser;
  next();
});

module.exports = { protect };
