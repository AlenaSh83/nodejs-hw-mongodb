import { Router } from 'express';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  sendResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import {
  registerSchema,
  loginSchema,
  sendResetEmailSchema,
  resetPasswordSchema,
} from '../validation/authValidation.js';

const authRouter = Router();

// Реєстрація
authRouter.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerController)
);

// Логін
authRouter.post(
  '/login',
  validateBody(loginSchema),
  ctrlWrapper(loginController)
);

// Оновлення токенів
authRouter.post(
  '/refresh',
  ctrlWrapper(refreshController)
);

// Вихід
authRouter.post(
  '/logout',
  ctrlWrapper(logoutController)
);

// Надсилання email для скидання пароля
authRouter.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  ctrlWrapper(sendResetEmailController)
);

// Скидання пароля
authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController)
);

export default authRouter;