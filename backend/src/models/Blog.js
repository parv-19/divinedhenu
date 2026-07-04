import mongoose from 'mongoose';
import slugify from 'slugify';

const blogImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Image URL is required'],
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

const contentBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['paragraph', 'heading', 'subheading', 'list', 'image', 'products'],
      required: true,
    },
    text: {
      type: String,
      trim: true,
      default: '',
    },
    items: {
      type: [String],
      default: [],
    },
    image: {
      type: blogImageSchema,
      default: undefined,
    },
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [180, 'Blog title cannot exceed 180 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Blog excerpt is required'],
      trim: true,
      maxlength: [280, 'Excerpt cannot exceed 280 characters'],
    },
    section: {
      type: String,
      enum: ['blog', 'cowpedia'],
      default: 'blog',
      index: true,
    },
    topic: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
      index: true,
    },
    heroImage: {
      type: blogImageSchema,
      required: [true, 'Blog hero image is required'],
    },
    contentBlocks: {
      type: [contentBlockSchema],
      default: [],
      validate: {
        validator(blocks) {
          return blocks.length > 0;
        },
        message: 'Add at least one content block',
      },
    },
    featuredProducts: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
      default: [],
      validate: {
        validator(products) {
          return products.length <= 2;
        },
        message: 'A blog can feature up to 2 products',
      },
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
      index: true,
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
  }
);

blogSchema.pre('validate', function buildSlug(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  next();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
