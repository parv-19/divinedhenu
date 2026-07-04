import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import { parseObject, parseNumber, parseBoolean } from '../utils/request.js';
import { createUniqueSlug } from '../utils/slug.js';

const normalizeCategoryPayload = (body) => ({
  name: body.name,
  description: body.description,
  image: parseObject(body.image),
  isActive: parseBoolean(body.isActive),
  sortOrder: parseNumber(body.sortOrder),
  seoTitle: body.seoTitle,
  seoDescription: body.seoDescription,
});

const removeUndefined = (payload) => Object.fromEntries(
  Object.entries(payload).filter(([, value]) => value !== undefined)
);

export const createCategory = async ({ body, file }) => {
  const payload = removeUndefined(normalizeCategoryPayload(body));

  if (payload.name) {
    payload.slug = await createUniqueSlug(Category, payload.name);
  }

  if (file) {
    payload.image = await uploadBufferToCloudinary(file.buffer, 'divinedhenu/categories');
  }

  return Category.create(payload);
};

export const getAdminCategories = () => {
  return Category.find({}).sort({ sortOrder: 1, createdAt: -1 });
};

export const getPublicCategories = () => {
  return Category.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
};

export const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  return category;
};

export const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({ slug, isActive: true });
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  return category;
};

export const updateCategory = async ({ id, body, file }) => {
  const category = await getCategoryById(id);
  const payload = removeUndefined(normalizeCategoryPayload(body));

  if (payload.name && payload.name !== category.name) {
    payload.slug = await createUniqueSlug(Category, payload.name, id);
  }

  if (file) {
    if (category.image?.publicId) {
      await deleteFromCloudinary(category.image.publicId);
    }
    payload.image = await uploadBufferToCloudinary(file.buffer, 'divinedhenu/categories');
  }

  Object.assign(category, payload);
  return category.save();
};

export const deleteCategory = async (id) => {
  const category = await getCategoryById(id);
  const productExists = await Product.exists({ category: id });

  if (productExists) {
    const error = new Error('Cannot delete category while products exist in it');
    error.statusCode = 400;
    throw error;
  }

  if (category.image?.publicId) {
    await deleteFromCloudinary(category.image.publicId);
  }

  await category.deleteOne();
  return category;
};
