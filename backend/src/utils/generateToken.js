import jwt from 'jsonwebtoken';

const generateToken = (adminId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required to sign tokens');
  }

  return jwt.sign({ adminId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export default generateToken;
