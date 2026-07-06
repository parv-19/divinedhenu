import jwt from 'jsonwebtoken';
import Customer from '../models/Customer.js';

const customerResponse = (customer) => ({
  _id: customer._id,
  name: customer.name,
  email: customer.email,
  phone: customer.phone,
  avatar: customer.avatar,
  authProvider: customer.authProvider,
});

const signCustomerToken = (customerId) => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required to sign tokens');
  return jwt.sign({ customerId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const sendAuthResponse = async (res, customer) => {
  customer.lastLogin = new Date();
  await customer.save();
  res.status(200).json({
    success: true,
    customer: customerResponse(customer),
    token: signCustomerToken(customer._id),
  });
};

export const registerCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Name, email and password are required');
    }

    const existing = await Customer.findOne({ email });
    if (existing) {
      res.status(409);
      throw new Error('An account already exists with this email');
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      password,
      authProvider: 'email',
    });

    await sendAuthResponse(res, customer);
  } catch (error) {
    next(error);
  }
};

export const loginCustomer = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required');
    }

    const customer = await Customer.findOne({ email }).select('+password');
    const isMatch = customer ? await customer.matchPassword(password) : false;
    if (!customer || !isMatch || !customer.isActive) {
      res.status(401);
      throw new Error('Invalid login details');
    }

    await sendAuthResponse(res, customer);
  } catch (error) {
    next(error);
  }
};

export const loginWithGoogle = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      res.status(400);
      throw new Error('Google credential is required');
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      res.status(500);
      throw new Error('GOOGLE_CLIENT_ID is not configured');
    }

    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    const profile = await response.json();

    if (!response.ok) {
      res.status(401);
      throw new Error(profile.error_description || 'Google login failed');
    }

    if (profile.aud !== process.env.GOOGLE_CLIENT_ID || !['accounts.google.com', 'https://accounts.google.com'].includes(profile.iss)) {
      res.status(401);
      throw new Error('Google credential is not valid for this site');
    }

    if (profile.email_verified !== 'true' && profile.email_verified !== true) {
      res.status(401);
      throw new Error('Google email is not verified');
    }

    let customer = await Customer.findOne({ email: profile.email });
    if (customer) {
      customer.googleId = customer.googleId || profile.sub;
      customer.avatar = profile.picture || customer.avatar;
      customer.authProvider = customer.authProvider || 'google';
      if (!customer.name) customer.name = profile.name || profile.email;
    } else {
      customer = await Customer.create({
        name: profile.name || profile.email,
        email: profile.email,
        googleId: profile.sub,
        avatar: profile.picture || '',
        authProvider: 'google',
      });
    }

    await sendAuthResponse(res, customer);
  } catch (error) {
    next(error);
  }
};

export const getCustomerProfile = async (req, res) => {
  res.status(200).json({ success: true, customer: customerResponse(req.customer) });
};
