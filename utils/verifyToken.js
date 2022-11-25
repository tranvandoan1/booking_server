import jwt from 'jsonwebtoken';
import { createError } from './error.js';

// try {
//   const decoded = jwt.verify(token, process.env.JWT);
//   req.user = decoded.user;
//   next();
// } catch (err) {
//   return next(createError(403, 'Token is not valid!'));
// }

export const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, 'Token is not valid!'));
    return (req.user = user);
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next);

  if (req.user.id === req.params.id || req.user.isAdmin) {
    next();
  } else {
    return next(createError(403, 'You are not authorized!'));
  }
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next);
  if (req.user.isAdmin) {
    next();
  } else {
    return next(createError(403, 'You are not authorized!'));
  }
};
