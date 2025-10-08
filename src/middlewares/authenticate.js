import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authenticate = async (req, res, next) => {
 
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header missing'));
  }
  
  
  const [bearer, token] = authHeader.split(' ');
  
  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Invalid authorization header format'));
  }
  
  try {
    
    const payload = jwt.verify(token, JWT_SECRET);
    
    
    const session = await Session.findOne({
      accessToken: token,
      accessTokenValidUntil: { $gt: new Date() },
    });
    
    if (!session) {
      return next(createHttpError(401, 'Access token expired'));
    }
    
   
    const user = await User.findById(payload.userId);
    
    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }
    
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(createHttpError(401, 'Access token expired'));
    }
    return next(createHttpError(401, 'Invalid token'));
  }
};

export default authenticate;