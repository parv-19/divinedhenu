import express from 'express';
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  getCategoryById,
  updateCategory,
} from '../controllers/categoryController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(protectAdmin, uploadSingle('image'), createCategory)
  .get(protectAdmin, getAdminCategories);

router
  .route('/:id')
  .get(protectAdmin, getCategoryById)
  .put(protectAdmin, uploadSingle('image'), updateCategory)
  .delete(protectAdmin, deleteCategory);

export default router;
