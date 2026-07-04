import express from 'express';
import {
  getCategoryBySlug,
  getPublicCategories,
} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getPublicCategories);
router.get('/:slug', getCategoryBySlug);

export default router;
