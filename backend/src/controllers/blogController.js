import * as blogService from '../services/blogService.js';

export const createBlog = async (req, res, next) => {
  try {
    const blog = await blogService.createBlog({ body: req.body, files: req.files });
    res.status(201).json({ success: true, blog });
  } catch (error) {
    next(error);
  }
};

export const getAdminBlogs = async (req, res, next) => {
  try {
    const result = await blogService.getAdminBlogs(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getPublicBlogs = async (req, res, next) => {
  try {
    const result = await blogService.getPublicBlogs(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getBlogById = async (req, res, next) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    res.status(200).json({ success: true, blog });
  } catch (error) {
    next(error);
  }
};

export const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await blogService.getBlogBySlug(req.params.slug);
    res.status(200).json({ success: true, blog });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const blog = await blogService.updateBlog({
      id: req.params.id,
      body: req.body,
      files: req.files,
    });
    res.status(200).json({ success: true, blog });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    await blogService.deleteBlog(req.params.id);
    res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    next(error);
  }
};
