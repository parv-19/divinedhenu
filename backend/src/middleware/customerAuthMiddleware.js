import jwt from 'jsonwebtoken';
import Customer from '../models/Customer.js';

export const protectCustomer = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      res.status(401);
      throw new Error('Please login to continue');
    }

    if (!process.env.JWT_SECRET) {
      res.status(500);
      throw new Error('JWT_SECRET is not configured');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customer = await Customer.findById(decoded.customerId);

    if (!customer || !customer.isActive) {
      res.status(401);
      throw new Error('Customer account is not authorized');
    }

    req.customer = customer;
    next();
  } catch (error) {
    if (!res.statusCode || res.statusCode === 200) res.status(401);
    next(error);
  }
};
