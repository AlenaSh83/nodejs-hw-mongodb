import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ACCESS_TOKEN_EXPIRES = 15 * 60; 
const REFRESH_TOKEN_EXPIRES = 30 * 24 * 60 * 60; 


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