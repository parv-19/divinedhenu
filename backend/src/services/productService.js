import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { deleteFromCloudinary, uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';
import {
  buildPaginationMeta,
  getPagination,
  parseArray,
  parseBoolean,
  parseNumber,
} from '../utils/request.js';
import { createUniqueSlug } from '../utils/slug.js';

const sortMap = {
  newest: { createdAt: -1 },
  priceLow: { price: 1 },
  priceHigh: { price: -1 },
};

const removeUndefined = (payload) => Object.fromEntries(
  Object.entries(payload).filter(([, value]) => value !== undefined)
);

const parseImages = (value) => {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return undefined;
  }
};

const normalizeProductPayload = (body) => removeUndefined({
  name: body.name,
  category: body.category,
  price: parseNumber(body.price),
  originalPrice: parseNumber(body.originalPrice),
  shortDescription: body.shortDescription,
  description: body.description,
  images: parseImages(body.images),
  moodTags: body.moodTags === undefined ? undefined : parseArray(body.moodTags),
  ritualMoods: body.ritualMoods === undefined ? undefined : parseArray(body.ritualMoods),
  ritualUse: body.ritualUse,
  fragranceNotes: body.fragranceNotes === undefined ? undefined : parseArray(body.fragranceNotes),
  ingredients: body.ingredients,
  howToUse: body.howToUse,
  stock: parseNumber(body.stock),
  sku: body.sku,
  isBestseller: parseBoolean(body.isBestseller),
  isFeatured: parseBoolean(body.isFeatured),
  isActive: parseBoolean(body.isActive),
  metaTitle: body.metaTitle,
  metaDescription: body.metaDescription,
});

const uploadProductImages = async (files = []) => {
  if (!files.length) return [];

  return Promise.all(
    files.map((file) => uploadBufferToCloudinary(file.buffer, 'divinedhenu/products'))
  );
};

const populateProduct = (query) => query.populate('category', 'name slug image isActive');

const syncRemovedImages = async (existingImages = [], nextImages = []) => {
  const nextPublicIds = new Set(nextImages.map((image) => image.publicId).filter(Boolean));
  const removedImages = existingImages.filter((image) => (
    image.publicId && !nextPublicIds.has(image.publicId)
  ));

  await Promise.all(removedImages.map((image) => deleteFromCloudinary(image.publicId)));
};

export const createProduct = async ({ body, files }) => {
  const payload = normalizeProductPayload(body);
  const uploadedImages = await uploadProductImages(files);

  if (payload.name) {
    payload.slug = await createUniqueSlug(Product, payload.name);
  }

  payload.images = [...(payload.images || []), ...uploadedImages];

  const product = await Product.create(payload);
  return populateProduct(Product.findById(product._id));
};

export const getAdminProducts = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { shortDescription: { $regex: query.search, $options: 'i' } },
      { sku: { $regex: query.search, $options: 'i' } },
    ];
  }

  if (query.category) filter.category = query.category;
  if (parseBoolean(query.isActive) !== undefined) filter.isActive = parseBoolean(query.isActive);
  if (parseBoolean(query.isBestseller) !== undefined) filter.isBestseller = parseBoolean(query.isBestseller);
  if (parseBoolean(query.isFeatured) !== undefined) filter.isFeatured = parseBoolean(query.isFeatured);

  if (query.stockStatus === 'out') filter.stock = { $lte: 0 };
  if (query.stockStatus === 'low') filter.stock = { $gt: 0, $lte: 5 };
  if (query.stockStatus === 'in') filter.stock = { $gt: 5 };

  const sort = sortMap[query.sort] || sortMap.newest;

  const [products, total] = await Promise.all([
    populateProduct(Product.find(filter).sort(sort).skip(skip).limit(limit)),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: buildPaginationMeta(total, page, limit),
  };
};

export const getPublicProducts = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { isActive: true };

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { shortDescription: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
    ];
  }

  if (query.category) {
    const category = await Category.findOne({
      isActive: true,
      $or: [{ slug: query.category }, { name: query.category }],
    });
    filter.category = category?._id || null;
  }

  if (query.mood) filter.moodTags = { $in: parseArray(query.mood) };

  const minPrice = parseNumber(query.minPrice);
  const maxPrice = parseNumber(query.maxPrice);
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  const sort = sortMap[query.sort] || sortMap.newest;

  const [products, total] = await Promise.all([
    populateProduct(Product.find(filter).sort(sort).skip(skip).limit(limit)),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: buildPaginationMeta(total, page, limit),
  };
};

export const getProductById = async (id) => {
  const product = await populateProduct(Product.findById(id));
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  return product;
};

export const getProductBySlug = async (slug) => {
  const product = await populateProduct(Product.findOne({ slug, isActive: true }));
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  return product;
};

export const getBestsellerProducts = () => {
  return populateProduct(Product.find({ isActive: true, isBestseller: true }).sort({ createdAt: -1 }));
};

export const getFeaturedProducts = () => {
  return populateProduct(Product.find({ isActive: true, isFeatured: true }).sort({ createdAt: -1 }));
};

export const getProductsByCategorySlug = async (categorySlug, query = {}) => {
  const category = await Category.findOne({ slug: categorySlug, isActive: true });
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  return getPublicProducts({ ...query, category: category.slug });
};

export const getProductsByMood = (mood) => {
  return populateProduct(
    Product.find({
      isActive: true,
      ritualMoods: { $in: [mood] },
    }).sort({ isFeatured: -1, isBestseller: -1, createdAt: -1 }).limit(6)
  );
};

export const updateProduct = async ({ id, body, files }) => {
  const product = await getProductById(id);
  const payload = normalizeProductPayload(body);
  const uploadedImages = await uploadProductImages(files);

  if (payload.name && payload.name !== product.name) {
    payload.slug = await createUniqueSlug(Product, payload.name, id);
  }

  if (payload.images || uploadedImages.length) {
    const nextImages = payload.images
      ? [...payload.images, ...uploadedImages]
      : [...product.images, ...uploadedImages];
    await syncRemovedImages(product.images, nextImages);
    payload.images = nextImages;
  }

  Object.assign(product, payload);
  await product.save();
  return getProductById(product._id);
};

export const deleteProduct = async (id) => {
  const product = await getProductById(id);
  await Promise.all((product.images || []).map((image) => deleteFromCloudinary(image.publicId)));
  await product.deleteOne();
  return product;
};

export const patchProductBoolean = async (id, field, value) => {
  const product = await getProductById(id);
  product[field] = parseBoolean(value) ?? !product[field];
  await product.save();
  return getProductById(product._id);
};
