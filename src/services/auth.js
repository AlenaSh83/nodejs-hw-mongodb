import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';
import { sendResetPasswordEmail } from './email.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ACCESS_TOKEN_EXPIRES = 15 * 60; 
const REFRESH_TOKEN_EXPIRES = 30 * 24 * 60 * 60; 
const RESET_TOKEN_EXPIRES = 5 * 60; 


const createTokens = (userId) => {
  const payload = { userId };
  
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });
  
  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES,
  });
  
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_EXPIRES * 1000),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_EXPIRES * 1000),
  };
};


export const registerUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }
  
  const newUser = await User.create(userData);
  return newUser;
};


export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password is wrong');
  }
  
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Email or password is wrong');
  }
  
  await Session.deleteMany({ userId: user._id });
  
  const tokens = createTokens(user._id);
  
  const session = await Session.create({
    userId: user._id,
    ...tokens,
  });
  
  return {
    user,
    session,
  };
};


export const refreshSession = async (refreshToken) => {
  let payload;
  try {
    payload = jwt.verify(refreshToken, JWT_SECRET);
  } catch (error) {
    throw createHttpError(401, 'Invalid refresh token');
  }
  
  const session = await Session.findOne({
    refreshToken,
    refreshTokenValidUntil: { $gt: new Date() },
  });
  
  if (!session) {
    throw createHttpError(401, 'Session not found or expired');
  }
  
  const user = await User.findById(session.userId);
  if (!user) {
    throw createHttpError(401, 'User not found');
  }
  
  await Session.deleteOne({ _id: session._id });
  
  const tokens = createTokens(user._id);
  
  const newSession = await Session.create({
    userId: user._id,
    ...tokens,
  });
  
  return {
    user,
    session: newSession,
  };
};


export const logoutUser = async (refreshToken) => {
  await Session.deleteOne({ refreshToken });
};

// Надсилання email для скидання пароля
export const sendResetEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  
  // Створюємо токен для скидання пароля
  const resetToken = jwt.sign(
    { email },
    JWT_SECRET,
    { expiresIn: RESET_TOKEN_EXPIRES }
  );
  
  // Формуємо посилання для скидання
  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`;
  
  // Надсилаємо email
  try {
    await sendResetPasswordEmail(email, resetLink);
  } catch (error) {
    console.error('Email sending error:', error.message);
    console.error('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from: process.env.SMTP_FROM,
      passExists: !!process.env.SMTP_PASSWORD
    });
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};


export const resetPassword = async (token, newPassword) => {
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }
  
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  
 
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  
  user.password = hashedPassword;
  await user.save();
  

  await Session.deleteMany({ userId: user._id });
};