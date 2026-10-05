const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'الاسم مطلوب' })
      .min(3, 'يجب أن لا يقل الاسم عن 3 أحرف')
      .max(50, 'يجب ألا يتجاوز الاسم 50 حرفاً'),
    email: z.string({ required_error: 'البريد الإلكتروني مطلوب' })
      .email('صيغة البريد الإلكتروني غير صحيحة'),
    password: z.string({ required_error: 'كلمة المرور مطلوبة' })
      .min(6, 'كلمة المرور يجب أن لا تقل عن 6 خانات'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'البريد الإلكتروني مطلوب' })
      .email('صيغة البريد الإلكتروني غير صحيحة'),
    password: z.string({ required_error: 'كلمة المرور مطلوبة' })
      .min(1, 'يرجى إدخال كلمة المرور'),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
