const prisma = require('../database/prisma');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const publicUserFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({ select: publicUserFields });
  res.status(200).json({ status: 'success', results: users.length, data: { users } });
});

const getUserById = asyncHandler(async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return next(new AppError('معرّف المستخدم غير صالح.', 400));
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: publicUserFields,
  });

  if (!user) {
    return next(new AppError('المستخدم غير موجود.', 404));
  }

  res.status(200).json({ status: 'success', data: { user } });
});

module.exports = { getAllUsers, getUserById };
