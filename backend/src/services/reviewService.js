import Review from '../models/Review.js';
import { parseBoolean, parseNumber } from '../utils/request.js';

const removeUndefined = (payload) => Object.fromEntries(
  Object.entries(payload).filter(([, value]) => value !== undefined)
);

const normalizeReviewPayload = (body) => removeUndefined({
  customerName: body.customerName,
  city: body.city,
  rating: parseNumber(body.rating),
  message: body.message,
  product: body.product || null,
  isActive: parseBoolean(body.isActive),
  isFeatured: parseBoolean(body.isFeatured),
});

const populateReview = (query) => query.populate('product', 'name slug images price');

export const createReview = async (body) => {
  const review = await Review.create(normalizeReviewPayload(body));
  return populateReview(Review.findById(review._id));
};

export const getAdminReviews = (query = {}) => {
  const filter = {};
  if (parseBoolean(query.isActive) !== undefined) filter.isActive = parseBoolean(query.isActive);
  if (parseBoolean(query.isFeatured) !== undefined) filter.isFeatured = parseBoolean(query.isFeatured);
  if (query.product) filter.product = query.product;

  return populateReview(Review.find(filter).sort({ createdAt: -1 }));
};

export const getFeaturedReviews = () => {
  return populateReview(
    Review.find({ isActive: true, isFeatured: true }).sort({ createdAt: -1 })
  );
};

export const getReviewById = async (id) => {
  const review = await populateReview(Review.findById(id));
  if (!review) {
    const error = new Error('Review not found');
    error.statusCode = 404;
    throw error;
  }

  return review;
};

export const updateReview = async (id, body) => {
  const review = await getReviewById(id);
  Object.assign(review, normalizeReviewPayload(body));
  await review.save();
  return getReviewById(review._id);
};

export const deleteReview = async (id) => {
  const review = await getReviewById(id);
  await review.deleteOne();
  return review;
};

export const patchReviewStatus = async (id, value) => {
  const review = await getReviewById(id);
  review.isActive = parseBoolean(value) ?? !review.isActive;
  await review.save();
  return getReviewById(review._id);
};
