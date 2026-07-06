import express from 'express';
import bannerRoutes from './bannerRoutes.js';
import authRoutes from './authRoutes.js';
import blogRoutes from './blogRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import customerAuthRoutes from './customerAuthRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import adminOrderRoutes from './adminOrderRoutes.js';
import offerRoutes from './offerRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import productRoutes from './productRoutes.js';
import publicBannerRoutes from './publicBannerRoutes.js';
import publicBlogRoutes from './publicBlogRoutes.js';
import publicCategoryRoutes from './publicCategoryRoutes.js';
import publicOfferRoutes from './publicOfferRoutes.js';
import publicOrderRoutes from './publicOrderRoutes.js';
import publicProductRoutes from './publicProductRoutes.js';
import publicReviewRoutes from './publicReviewRoutes.js';
import publicSiteSettingRoutes from './publicSiteSettingRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import shippingRoutes from './shippingRoutes.js';
import siteSettingRoutes from './siteSettingRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Divine Dhenu CMS API is running',
  });
});

router.use('/admin/upload', uploadRoutes);
router.use('/admin/auth', authRoutes);
router.use('/admin/dashboard', dashboardRoutes);
router.use('/admin/categories', categoryRoutes);
router.use('/admin/products', productRoutes);
router.use('/admin/blogs', blogRoutes);
router.use('/admin/banners', bannerRoutes);
router.use('/admin/offers', offerRoutes);
router.use('/admin/reviews', reviewRoutes);
router.use('/admin/orders', adminOrderRoutes);
router.use('/admin/site-settings', siteSettingRoutes);
router.use('/customer-auth', customerAuthRoutes);
router.use('/categories', publicCategoryRoutes);
router.use('/products', publicProductRoutes);
router.use('/blogs', publicBlogRoutes);
router.use('/banners', publicBannerRoutes);
router.use('/offers', publicOfferRoutes);
router.use('/orders', publicOrderRoutes);
router.use('/payments', paymentRoutes);
router.use('/shipping', shippingRoutes);
router.use('/reviews', publicReviewRoutes);
router.use('/site-settings', publicSiteSettingRoutes);

export default router;
