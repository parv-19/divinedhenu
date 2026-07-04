import express from 'express';
import {
  createOffer,
  deleteOffer,
  getAdminOffers,
  getOfferById,
  patchOfferStatus,
  updateOffer,
} from '../controllers/offerController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(protectAdmin, createOffer)
  .get(protectAdmin, getAdminOffers);

router.patch('/:id/status', protectAdmin, patchOfferStatus);

router
  .route('/:id')
  .get(protectAdmin, getOfferById)
  .put(protectAdmin, updateOffer)
  .delete(protectAdmin, deleteOffer);

export default router;
