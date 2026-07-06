import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    postalCode: { type: String, trim: true, default: '' },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    googleId: {
      type: String,
      trim: true,
      index: true,
      default: '',
    },
    avatar: {
      type: String,
      trim: true,
      default: '',
    },
    authProvider: {
      type: String,
      enum: ['email', 'google'],
      default: 'email',
    },
    savedAddresses: {
      type: [addressSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

customerSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

customerSchema.methods.matchPassword = function matchPassword(enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

customerSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.password;
    return ret;
  },
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
