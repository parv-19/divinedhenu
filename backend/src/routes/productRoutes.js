import express from 'express';
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  getProductById,
  patchProductBestseller,
  patchProductFeatured,
  patchProductStatus,
  updateProduct,
} from '../controllers/productController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { uploadMultiple } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(protectAdmin, uploadMultiple('images', 4), createProduct)
  .get(protectAdmin, getAdminProducts);

router.patch('/:id/status', protectAdmin, patchProductStatus);
router.patch('/:id/featured', protectAdmin, patchProductFeatured);
router.patch('/:id/bestseller', protectAdmin, patchProductBestseller);

router
  .route('/:id')
  .get(protectAdmin, getProductById)
  .put(protectAdmin, uploadMultiple('images', 4), updateProduct)
  .delete(protectAdmin, deleteProduct);

export default router;
