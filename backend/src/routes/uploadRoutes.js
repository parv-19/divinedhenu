import express from 'express';
import {
  deleteUploadedImage,
  uploadMultipleImages,
  uploadSingleImage,
} from '../controllers/uploadController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { uploadMultiple, uploadSingle } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/single', protectAdmin, uploadSingle('image'), uploadSingleImage);
router.post('/multiple', protectAdmin, uploadMultiple('images', 8), uploadMultipleImages);
router.delete('/:publicId(*)', protectAdmin, deleteUploadedImage);

export default router;
