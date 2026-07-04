import * as reviewService from '../services/reviewService.js';

export const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.body);
    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

export const getAdminReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getAdminReviews(req.query);
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getFeaturedReviews();
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await reviewService.updateReview(req.params.id, req.body);
    res.status(200).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(req.params.id);
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const patchReviewStatus = async (req, res, next) => {
  try {
    const review = await reviewService.patchReviewStatus(req.params.id, req.body.isActive);
    res.status(200).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};
