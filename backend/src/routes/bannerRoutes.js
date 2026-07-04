import express from 'express';
import {
  createBanner,
  deleteBanner,
  getAdminBanners,
  getBannerById,
  patchBannerStatus,
  updateBanner,
} from '../controllers/bannerController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(protectAdmin, uploadSingle('image'), createBanner)
  .get(protectAdmin, getAdminBanners);

router.patch('/:id/status', protectAdmin, patchBannerStatus);

router
  .route('/:id')
  .get(protectAdmin, getBannerById)
  .put(protectAdmin, uploadSingle('image'), updateBanner)
  .delete(protectAdmin, deleteBanner);

export default router;
