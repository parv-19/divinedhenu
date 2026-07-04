import Blog from '../models/Blog.js';
import { deleteFromCloudinary, uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';
import {
  buildPaginationMeta,
  getPagination,
  parseBoolean,
} from '../utils/request.js';
import { createUniqueSlug } from '../utils/slug.js';

const removeUndefined = (payload) => Object.fromEntries(
  Object.entries(payload).filter(([, value]) => value !== undefined)
);

const parseJson = (value, fallback) => {
  if (Array.isArray(value)) {
    return parseJson(value[value.length - 1], fallback);
  }
  if (value === undefined) return undefined;
  if (typeof value !== 'string') return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const parseDate = (value) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const normalizeProductIds = (value) => {
  const parsed = parseJson(value, value);
  const products = Array.isArray(parsed) ? parsed : [parsed].filter(Boolean);
  return products.filter(Boolean).slice(0, 2);
};

const normalizeBlocks = (value) => {
  const blocks = parseJson(value, []);
  if (!Array.isArray(blocks)) return [];

  return blocks.map((block) => ({
    type: block.type,
    text: block.text || '',
    items: Array.isArray(block.items) ? block.items.filter(Boolean) : [],
    image: block.image?.url ? block.image : undefined,
    uploadSlot: Boolean(block.uploadSlot),
  })).filter((block) => {
    if (block.type === 'image') return Boolean(block.image?.url || block.uploadSlot);
    if (block.type === 'list') return block.items.length > 0;
    if (block.type === 'products') return true;
    return Boolean(block.text?.trim());
  });
};

const normalizeBlogPayload = (body) => removeUndefined({
  title: body.title,
  excerpt: body.excerpt,
  section: body.section,
  topic: body.section === 'cowpedia' ? body.topic : '',
  heroImage: parseJson(body.heroImage, undefined),
  contentBlocks: body.contentBlocks === undefined ? undefined : normalizeBlocks(body.contentBlocks),
  featuredProducts: body.featuredProducts === undefined ? undefined : normalizeProductIds(body.featuredProducts),
  isPublished: parseBoolean(body.isPublished),
  publishedAt: parseDate(body.publishedAt),
  metaTitle: body.metaTitle,
  metaDescription: body.metaDescription,
});

const uploadBlogImage = async (file) => {
  if (!file) return null;
  return uploadBufferToCloudinary(file.buffer, 'divinedhenu/blogs');
};

const uploadContentImages = async (files = []) => Promise.all(
  files.map((file) => uploadBlogImage(file))
);

const populateBlog = (query) => query.populate({
  path: 'featuredProducts',
  select: 'name slug price originalPrice images stock isBestseller isActive',
  match: { isActive: true },
});

const collectPublicIds = (blog) => {
  const ids = [];
  if (blog?.heroImage?.publicId) ids.push(blog.heroImage.publicId);
  (blog?.contentBlocks || []).forEach((block) => {
    if (block.image?.publicId) ids.push(block.image.publicId);
  });
  return ids;
};

const syncRemovedImages = async (existingBlog, nextPayload) => {
  const previousIds = collectPublicIds(existingBlog);
  const nextIds = collectPublicIds({
    heroImage: nextPayload.heroImage || existingBlog.heroImage,
    contentBlocks: nextPayload.contentBlocks || existingBlog.contentBlocks,
  });
  const nextSet = new Set(nextIds);
  const removed = previousIds.filter((id) => id && !nextSet.has(id));
  await Promise.all(removed.map((id) => deleteFromCloudinary(id)));
};

const assignUploadedContentImages = (blocks = [], images = []) => {
  let imageIndex = 0;
  return blocks.map((block) => {
    if (block.type !== 'image' || block.image?.url) return block;
    const uploaded = images[imageIndex];
    imageIndex += 1;
    return uploaded ? { ...block, image: uploaded } : block;
  }).filter((block) => block.type !== 'image' || block.image?.url);
};

export const createBlog = async ({ body, files = {} }) => {
  const payload = normalizeBlogPayload(body);
  const heroImage = await uploadBlogImage(files.heroImage?.[0]);
  const contentImages = await uploadContentImages(files.contentImages || []);

  if (payload.title) {
    payload.slug = await createUniqueSlug(Blog, payload.title);
  }

  if (heroImage) payload.heroImage = heroImage;
  payload.contentBlocks = assignUploadedContentImages(payload.contentBlocks || [], contentImages);

  const blog = await Blog.create(payload);
  return populateBlog(Blog.findById(blog._id));
};

export const getAdminBlogs = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { excerpt: { $regex: query.search, $options: 'i' } },
    ];
  }

  if (parseBoolean(query.isPublished) !== undefined) {
    filter.isPublished = parseBoolean(query.isPublished);
  }
  if (query.section) filter.section = query.section;
  if (query.topic) filter.topic = query.topic;

  const [blogs, total] = await Promise.all([
    Blog.find(filter).sort({ publishedAt: -1, createdAt: -1 }).skip(skip).limit(limit),
    Blog.countDocuments(filter),
  ]);

  return {
    blogs,
    pagination: buildPaginationMeta(total, page, limit),
  };
};

export const getPublicBlogs = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { isPublished: true, publishedAt: { $lte: new Date() } };

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { excerpt: { $regex: query.search, $options: 'i' } },
    ];
  }
  if (query.section) filter.section = query.section;
  if (query.topic) filter.topic = query.topic;

  const [blogs, total] = await Promise.all([
    Blog.find(filter).sort({ publishedAt: -1, createdAt: -1 }).skip(skip).limit(limit),
    Blog.countDocuments(filter),
  ]);

  return {
    blogs,
    pagination: buildPaginationMeta(total, page, limit),
  };
};

export const getBlogById = async (id) => {
  const blog = await populateBlog(Blog.findById(id));
  if (!blog) {
    const error = new Error('Blog not found');
    error.statusCode = 404;
    throw error;
  }
  return blog;
};

export const getBlogBySlug = async (slug) => {
  const blog = await populateBlog(Blog.findOne({
    slug,
    isPublished: true,
    publishedAt: { $lte: new Date() },
  }));
  if (!blog) {
    const error = new Error('Blog not found');
    error.statusCode = 404;
    throw error;
  }
  return blog;
};

export const updateBlog = async ({ id, body, files = {} }) => {
  const blog = await getBlogById(id);
  const payload = normalizeBlogPayload(body);
  const heroImage = await uploadBlogImage(files.heroImage?.[0]);
  const contentImages = await uploadContentImages(files.contentImages || []);

  if (payload.title && payload.title !== blog.title) {
    payload.slug = await createUniqueSlug(Blog, payload.title, id);
  }

  if (heroImage) payload.heroImage = heroImage;
  if (payload.contentBlocks) {
    payload.contentBlocks = assignUploadedContentImages(payload.contentBlocks, contentImages);
  }

  await syncRemovedImages(blog, payload);
  Object.assign(blog, payload);
  await blog.save();
  return getBlogById(blog._id);
};

export const deleteBlog = async (id) => {
  const blog = await getBlogById(id);
  await Promise.all(collectPublicIds(blog).map((imageId) => deleteFromCloudinary(imageId)));
  await blog.deleteOne();
  return blog;
};
