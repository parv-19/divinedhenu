import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      trim: true,
      default: '',
    },
    publicId: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: [160, 'Banner title cannot exceed 160 characters'],
      default: '',
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [260, 'Banner subtitle cannot exceed 260 characters'],
      default: '',
    },
    buttonText: {
      type: String,
      trim: true,
      maxlength: [40, 'Button text cannot exceed 40 characters'],
      default: '',
    },
    buttonLink: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: imageSchema,
      default: () => ({}),
    },
    position: {
      type: String,
      enum: ['home_hero', 'shop_top'],
      required: [true, 'Banner position is required'],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
      min: [0, 'Sort order cannot be negative'],
    },
  },
  { timestamps: true }
);

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
