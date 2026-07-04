import AdminUser from '../models/AdminUser.js';
import generateToken from '../utils/generateToken.js';

const adminResponse = (admin) => ({
  _id: admin._id,
  name: admin.name,
  email: admin.email,
  role: admin.role,
  isActive: admin.isActive,
  lastLogin: admin.lastLogin,
});

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required');
    }

    const admin = await AdminUser.findOne({ email }).select('+password');
    const isMatch = admin ? await admin.matchPassword(password) : false;

    if (!admin || !isMatch || !admin.isActive) {
      res.status(401);
      throw new Error('Invalid admin credentials');
    }

    admin.lastLogin = new Date();
    await admin.save();

    res.status(200).json({
      success: true,
      admin: adminResponse(admin),
      token: generateToken(admin._id),
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminProfile = async (req, res) => {
  res.status(200).json({ success: true, admin: adminResponse(req.admin) });
};

export const createFirstAdmin = async (req, res, next) => {
  try {
    const adminCount = await AdminUser.countDocuments();
    if (adminCount > 0) {
      res.status(403);
      throw new Error('Initial admin already exists');
    }

    const admin = await AdminUser.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: 'super_admin',
    });

    res.status(201).json({
      success: true,
      admin: adminResponse(admin),
      token: generateToken(admin._id),
    });
  } catch (error) {
    next(error);
  }
};
