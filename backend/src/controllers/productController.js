import * as productService from '../services/productService.js';

export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct({ body: req.body, files: req.files });
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const getAdminProducts = async (req, res, next) => {
  try {
    const result = await productService.getAdminProducts(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getPublicProducts = async (req, res, next) => {
  try {
    const result = await productService.getPublicProducts(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await productService.getProductBySlug(req.params.slug);
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const getBestsellerProducts = async (req, res, next) => {
  try {
    const products = await productService.getBestsellerProducts();
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await productService.getFeaturedProducts();
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategorySlug = async (req, res, next) => {
  try {
    const result = await productService.getProductsByCategorySlug(req.params.categorySlug, req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getProductsByMood = async (req, res, next) => {
  try {
    const products = await productService.getProductsByMood(req.params.mood);
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct({
      id: req.params.id,
      body: req.body,
      files: req.files,
    });
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const patchProductStatus = async (req, res, next) => {
  try {
    const product = await productService.patchProductBoolean(req.params.id, 'isActive', req.body.isActive);
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const patchProductFeatured = async (req, res, next) => {
  try {
    const product = await productService.patchProductBoolean(req.params.id, 'isFeatured', req.body.isFeatured);
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const patchProductBestseller = async (req, res, next) => {
  try {
    const product = await productService.patchProductBoolean(req.params.id, 'isBestseller', req.body.isBestseller);
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};
