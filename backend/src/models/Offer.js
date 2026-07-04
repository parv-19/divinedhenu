import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Offer text is required'],
      trim: true,
      maxlength: [220, 'Offer text cannot exceed 220 characters'],
    },
    type: {
      type: String,
      enum: ['marquee', 'coupon', 'banner'],
      default: 'marquee',
      index: true,
    },
    discountPercent: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100 percent'],
      default: 0,
    },
    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

offerSchema.pre('validate', function validateDates(next) {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    next(new Error('Offer end date must be after start date'));
    return;
  }

  next();
});

const Offer = mongoose.model('Offer', offerSchema);

export default Offer;
