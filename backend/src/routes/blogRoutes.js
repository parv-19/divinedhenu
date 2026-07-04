import express from 'express';
import {
  createBlog,
  deleteBlog,
  getAdminBlogs,
  getBlogById,
  updateBlog,
} from '../controllers/blogController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

const uploadBlogImages = upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'contentImages', maxCount: 8 },
]);

router
  .route('/')
  .post(protectAdmin, uploadBlogImages, createBlog)
  .get(protectAdmin, getAdminBlogs);

router
  .route('/:id')
  .get(protectAdmin, getBlogById)
  .put(protectAdmin, uploadBlogImages, updateBlog)
  .delete(protectAdmin, deleteBlog);

export default router;
