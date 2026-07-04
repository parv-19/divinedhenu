import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import connectDB from '../config/db.js';
import AdminUser from '../models/AdminUser.js';
import Banner from '../models/Banner.js';
import Category from '../models/Category.js';
import Offer from '../models/Offer.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import SiteSetting from '../models/SiteSetting.js';

dotenv.config();

const placeholder = (name) => ({
  url: `https://placehold.co/900x700/f7f1e8/3b2a1a?text=${encodeURIComponent(name)}`,
  publicId: '',
  alt: name,
});

const categoryNames = [
  'Incense Cones',
  'Bambooless Dhoop',
  'Bambooless Incense',
  'Havan Cups',
  'Ritual Gift Sets',
  'Festival Specials',
];

const productBlueprints = [
  ['Mystic Mandarin Incense Cones', 'Incense Cones', 349, 449, ['Fresh'], ['Freshness', 'Focus'], true, true, 18],
  ['Temple Rose Incense Cones', 'Incense Cones', 329, 399, ['Prayer', 'Calm'], ['Prayer', 'Calm'], false, true, 14],
  ['Moonlit Vetiver Incense Cones', 'Incense Cones', 379, 459, ['Sleep', 'Calm'], ['Sleep', 'Calm'], true, false, 4],
  ['Golden Ember Bambooless Dhoop', 'Bambooless Dhoop', 399, 499, ['Prayer', 'Focus'], ['Prayer', 'Focus'], true, true, 22],
  ['Rainleaf Bambooless Dhoop', 'Bambooless Dhoop', 389, 459, ['Fresh', 'Calm'], ['Freshness', 'Calm'], false, false, 9],
  ['Sacred Myrrh Bambooless Dhoop', 'Bambooless Dhoop', 429, 529, ['Prayer'], ['Prayer'], false, false, 12],
  ['Secret Petals Bambooless Incense', 'Bambooless Incense', 299, 379, ['Fresh', 'Calm'], ['Freshness'], true, true, 28],
  ['Saffron Silence Bambooless Incense', 'Bambooless Incense', 349, 429, ['Focus', 'Prayer'], ['Focus'], false, true, 16],
  ['Coastal Camphor Bambooless Incense', 'Bambooless Incense', 319, 399, ['Fresh', 'Prayer'], ['Freshness', 'Prayer'], false, false, 10],
  ['Sacred Santalum Havan Cups', 'Havan Cups', 549, 699, ['Prayer', 'Calm'], ['Prayer'], true, true, 20],
  ['Agnika Floral Havan Cups', 'Havan Cups', 529, 649, ['Prayer', 'Gifting'], ['Prayer', 'Gifting'], false, false, 8],
  ['Dawn Blessing Havan Cups', 'Havan Cups', 579, 729, ['Prayer', 'Fresh'], ['Prayer', 'Freshness'], true, false, 5],
  ['Breathe Box Ritual Gift Set', 'Ritual Gift Sets', 1199, 1499, ['Calm', 'Gifting'], ['Calm', 'Gifting'], true, true, 13],
  ['Puja Room Ritual Gift Set', 'Ritual Gift Sets', 1399, 1699, ['Prayer', 'Gifting'], ['Prayer', 'Gifting'], false, true, 7],
  ['Workday Focus Ritual Set', 'Ritual Gift Sets', 999, 1299, ['Focus', 'Fresh'], ['Focus'], false, false, 6],
  ['Festival Grace Ritual Hamper', 'Festival Specials', 1799, 2199, ['Gifting', 'Prayer'], ['Gifting', 'Prayer'], true, true, 11],
];

const clearCollections = async () => {
  await Promise.all([
    AdminUser.deleteMany(),
    Banner.deleteMany(),
    Category.deleteMany(),
    Offer.deleteMany(),
    Product.deleteMany(),
    Review.deleteMany(),
    SiteSetting.deleteMany(),
  ]);
};

const seed = async () => {
  await clearCollections();

  const admin = await AdminUser.create({
    name: 'DivineDhenu Admin',
    email: 'admin@divinedhenu.test',
    password: 'Admin@12345',
    role: 'super_admin',
  });

  const categories = await Category.insertMany(categoryNames.map((name, index) => ({
    name,
    description: `${name} for everyday sacred spaces and fragrant rituals.`,
    image: placeholder(name),
    isActive: true,
    sortOrder: index + 1,
    seoTitle: `${name} | DivineDhenu`,
    seoDescription: `Shop ${name.toLowerCase()} crafted for calm, prayer, and gifting.`,
  })));

  const categoryMap = Object.fromEntries(categories.map((category) => [category.name, category._id]));

  const products = await Product.insertMany(productBlueprints.map(([name, category, price, originalPrice, moodTags, ritualMoods, isBestseller, isFeatured, stock], index) => ({
    name,
    category: categoryMap[category],
    price,
    originalPrice,
    shortDescription: `A refined ${category.toLowerCase()} blend for meaningful daily rituals.`,
    description: `A balanced fragrance profile crafted for homes that value calm, devotion, and intentional pauses. ${name} opens softly, settles warmly, and works beautifully for everyday spaces.`,
    images: [placeholder(name)],
    moodTags,
    ritualMoods,
    ritualUse: ritualMoods[0] === 'Gifting' ? 'Mindful gifting' : `${ritualMoods[0]} ritual`,
    fragranceNotes: ['Sandalwood', 'soft florals', 'warm resin'],
    ingredients: 'Natural-inspired aroma oils, herbs, resins, and clean-burning binders.',
    howToUse: 'Place on a heat-safe holder, light the tip, blow out the flame, and enjoy the fragrance.',
    stock,
    sku: `AR-${String(index + 1).padStart(3, '0')}`,
    isBestseller,
    isFeatured,
    isActive: true,
    metaTitle: `${name} | DivineDhenu`,
    metaDescription: `Buy ${name} for calm homes, prayer rituals, and thoughtful gifting.`,
  })));

  await Banner.insertMany([
    {
      title: 'Scents That Turn Spaces Into Rituals',
      subtitle: 'Handcrafted incense, dhoop, and havan cups for calm, prayer, focus, and gifting.',
      buttonText: 'Shop Bestsellers',
      buttonLink: '/shop?category=Bestsellers',
      image: placeholder('DivineDhenu Hero'),
      position: 'home_hero',
      isActive: true,
      sortOrder: 1,
    },
    {
      title: 'Festival Ritual Hampers',
      subtitle: 'Gift-ready fragrance sets for sacred celebrations.',
      buttonText: 'Explore Sets',
      buttonLink: '/shop?category=Ritual%20Gift%20Sets',
      image: placeholder('Ritual Hampers'),
      position: 'shop_top',
      isActive: true,
      sortOrder: 2,
    },
  ]);

  await Offer.insertMany([
    { text: 'Get 25% off on your first order', type: 'marquee', discountPercent: 25, couponCode: 'FIRST25', isActive: true },
    { text: 'Buy 3 ritual fragrances and save 30%', type: 'coupon', discountPercent: 30, couponCode: 'RITUAL30', isActive: true },
    { text: 'Free shipping on prepaid orders above Rs. 999', type: 'banner', isActive: true },
  ]);

  await Review.insertMany([
    ['Ananya Rao', 'Bengaluru', 5, products[1]._id],
    ['Meera Shah', 'Ahmedabad', 5, products[12]._id],
    ['Ritika Menon', 'Kochi', 5, products[9]._id],
    ['Naina Kapoor', 'Delhi', 5, products[3]._id],
    ['Kavya Iyer', 'Pune', 4, products[6]._id],
    ['Priya Sinha', 'Jaipur', 5, products[15]._id],
  ].map(([customerName, city, rating, product]) => ({
    customerName,
    city,
    rating,
    product,
    message: 'Beautiful fragrance, thoughtful presentation, and a ritual-ready feel without being overpowering.',
    isActive: true,
    isFeatured: true,
  })));

  await SiteSetting.create({
    brandName: 'DivineDhenu',
    logo: placeholder('DivineDhenu Logo'),
    email: 'care@divinedhenu.test',
    phone: '+91 90000 00000',
    whatsapp: '+91 90000 00000',
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    youtube: 'https://youtube.com/',
    address: 'Ahmedabad, Gujarat, India',
    footerText: 'Handcrafted fragrance for calm homes and sacred moments.',
    newsletterTitle: 'Ritual notes for your inbox',
    newsletterDescription: 'Receive scent launches, offers, and gifting edits.',
    seoDefaultTitle: 'DivineDhenu | Premium Ritual Fragrance',
    seoDefaultDescription: 'Shop incense, dhoop, havan cups, and ritual gift sets.',
  });

  console.log(`Seed complete. Admin: ${admin.email} / Admin@12345`);
};

const run = async () => {
  await connectDB();
  if (process.argv.includes('--clear')) {
    await clearCollections();
    console.log('Seed data cleared');
  } else {
    await seed();
  }
  process.exit(0);
};

const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectRun) {
  run().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
