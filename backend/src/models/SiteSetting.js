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

const siteSettingSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
      default: 'Divine Dhenu',
    },
    logo: {
      type: imageSchema,
      default: () => ({}),
    },
    aboutImage: {
      type: imageSchema,
      default: () => ({}),
    },
    aboutEyebrow: {
      type: String,
      trim: true,
      default: 'DivineDhenu',
    },
    aboutHeroTitle: {
      type: String,
      trim: true,
      default: 'Fragrance for the Spaces That Hold You',
    },
    aboutHeroDescription: {
      type: String,
      trim: true,
      default: 'We create refined ritual fragrances for modern Indian homes, where prayer corners, work desks, and quiet evenings all deserve a moment of intention.',
    },
    aboutButtonText: {
      type: String,
      trim: true,
      default: 'Begin Your Ritual',
    },
    aboutButtonLink: {
      type: String,
      trim: true,
      default: '/shop',
    },
    aboutStoryTitle: {
      type: String,
      trim: true,
      default: 'A Softer Way to Come Home',
    },
    aboutStoryDescription: {
      type: String,
      trim: true,
      default: 'DivineDhenu was created to bring mindful ritual moments into modern homes. Each blend is imagined around the feeling it should leave behind: calmer rooms, focused mornings, devotional corners, and gifts that carry real meaning.',
    },
    aboutValue1: {
      type: String,
      trim: true,
      default: 'Calm over chaos',
    },
    aboutValue2: {
      type: String,
      trim: true,
      default: 'Ritual over routine',
    },
    aboutValue3: {
      type: String,
      trim: true,
      default: 'Craft over mass production',
    },
    aboutValue4: {
      type: String,
      trim: true,
      default: 'Gifting with meaning',
    },
    aboutProcessTitle: {
      type: String,
      trim: true,
      default: 'Our Process',
    },
    aboutProcessDescription: {
      type: String,
      trim: true,
      default: 'From aroma direction to gift-ready packing, each step is designed to feel thoughtful and quietly premium.',
    },
    aboutProcessStep1: {
      type: String,
      trim: true,
      default: 'Select aroma direction',
    },
    aboutProcessStep2: {
      type: String,
      trim: true,
      default: 'Blend ritual notes',
    },
    aboutProcessStep3: {
      type: String,
      trim: true,
      default: 'Hand-pack with care',
    },
    aboutProcessStep4: {
      type: String,
      trim: true,
      default: 'Deliver gift-ready',
    },
    navbarLogo: {
      type: imageSchema,
      default: () => ({}),
    },
    brandWordmark: {
      type: imageSchema,
      default: () => ({}),
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^$|^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    whatsapp: {
      type: String,
      trim: true,
      default: '',
    },
    instagram: {
      type: String,
      trim: true,
      default: '',
    },
    facebook: {
      type: String,
      trim: true,
      default: '',
    },
    youtube: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    footerText: {
      type: String,
      trim: true,
      default: '',
    },
    newsletterTitle: {
      type: String,
      trim: true,
      default: '',
    },
    newsletterDescription: {
      type: String,
      trim: true,
      default: '',
    },
    seoDefaultTitle: {
      type: String,
      trim: true,
      maxlength: [70, 'SEO default title cannot exceed 70 characters'],
      default: 'DivineDhenu | Premium Incense and Ritual Fragrances',
    },
    seoDefaultDescription: {
      type: String,
      trim: true,
      maxlength: [170, 'SEO default description cannot exceed 170 characters'],
      default: 'Shop premium incense, dhoop, havan cups, and ritual fragrance gifts.',
    },
  },
  { timestamps: true }
);

const SiteSetting = mongoose.model('SiteSetting', siteSettingSchema);

export default SiteSetting;
