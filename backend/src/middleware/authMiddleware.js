import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';

export const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      res.status(401);
      throw new Error('Admin authorization token is required');
    }

    if (!process.env.JWT_SECRET) {
      res.status(500);
      throw new Error('JWT_SECRET is not configured');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await AdminUser.findById(decoded.adminId).select('-password');

    if (!admin || !admin.isActive) {
      res.status(401);
      throw new Error('Admin account is not authorized');
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (!res.statusCode || res.statusCode === 200) {
      res.status(401);
    }

    next(error);
  }
};
