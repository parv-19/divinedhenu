import express from 'express';
import {
  createReview,
  deleteReview,
  getAdminReviews,
  patchReviewStatus,
  updateReview,
} from '../controllers/reviewController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(protectAdmin, createReview)
  .get(protectAdmin, getAdminReviews);

router.patch('/:id/status', protectAdmin, patchReviewStatus);

router
  .route('/:id')
  .put(protectAdmin, updateReview)
  .delete(protectAdmin, deleteReview);

export default router;
