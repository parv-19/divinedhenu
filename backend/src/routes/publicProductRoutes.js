import express from 'express';
import {
  getBestsellerProducts,
  getFeaturedProducts,
  getProductBySlug,
  getProductsByMood,
  getProductsByCategorySlug,
  getPublicProducts,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getPublicProducts);
router.get('/bestsellers', getBestsellerProducts);
router.get('/featured', getFeaturedProducts);
router.get('/by-category/:categorySlug', getProductsByCategorySlug);
router.get('/by-mood/:mood', getProductsByMood);
router.get('/:slug', getProductBySlug);

export default router;
