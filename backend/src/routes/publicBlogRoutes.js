import express from 'express';
import {
  getBlogBySlug,
  getPublicBlogs,
} from '../controllers/blogController.js';

const router = express.Router();

router.get('/', getPublicBlogs);
router.get('/:slug', getBlogBySlug);

export default router;
