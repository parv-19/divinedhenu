import mongoose from 'mongoose';
import slugify from 'slugify';

const productImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Product image URL is required'],
      trim: true,
    },
    publicId: {
      type: String,
      trim: true,
      default: '',
    },
    alt: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [160, 'Product name cannot exceed 160 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
      default: 0,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    images: {
      type: [productImageSchema],
      default: [],
      validate: {
        validator(images) {
          return images.length >= 1 && images.length <= 4;
        },
        message: 'Add at least 1 product image and up to 4 images',
      },
    },
    moodTags: {
      type: [String],
      default: [],
    },
    ritualMoods: {
      type: [String],
      enum: ['Calm', 'Focus', 'Prayer', 'Freshness', 'Sleep', 'Gifting'],
      default: [],
    },
    ritualUse: {
      type: String,
      trim: true,
      default: '',
    },
    fragranceNotes: {
      type: [String],
      default: [],
    },
    ingredients: {
      type: String,
      trim: true,
      default: '',
    },
    howToUse: {
      type: String,
      trim: true,
      default: '',
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [70, 'Meta title cannot exceed 70 characters'],
      default: '',
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [170, 'Meta description cannot exceed 170 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual('stockStatus').get(function stockStatus() {
  if (this.stock <= 0) return 'Out of stock';
  if (this.stock <= 5) return 'Low stock';
  return 'In stock';
});

productSchema.pre('validate', function buildSlug(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
