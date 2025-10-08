import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
} from '../services/auth.js';


export const registerController = async (req, res) => {
  const user = await registerUser(req.body);
  
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};


export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const { user, session } = await loginUser(email, password);
  
  
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  });
  
  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};


export const refreshController = async (req, res) => {
  const { refreshToken } = req.cookies;
  
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token not provided');
  }
  
  const { user, session } = await refreshSession(refreshToken);
  
 
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  });
  
  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};


export const logoutController = async (req, res) => {
  const { refreshToken } = req.cookies;
  
  if (refreshToken) {
    await logoutUser(refreshToken);
  }
  

  res.clearCookie('refreshToken');
  
  res.status(204).send();
};