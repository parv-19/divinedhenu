import * as bannerService from '../services/bannerService.js';

export const createBanner = async (req, res, next) => {
  try {
    const banner = await bannerService.createBanner({ body: req.body, file: req.file });
    res.status(201).json({ success: true, banner });
  } catch (error) {
    next(error);
  }
};

export const getAdminBanners = async (req, res, next) => {
  try {
    const banners = await bannerService.getAdminBanners(req.query);
    res.status(200).json({ success: true, banners });
  } catch (error) {
    next(error);
  }
};

export const getBannerById = async (req, res, next) => {
  try {
    const banner = await bannerService.getBannerById(req.params.id);
    res.status(200).json({ success: true, banner });
  } catch (error) {
    next(error);
  }
};

export const getPublicBanners = async (req, res, next) => {
  try {
    const banners = await bannerService.getPublicBanners(req.query);
    res.status(200).json({ success: true, banners });
  } catch (error) {
    next(error);
  }
};

export const updateBanner = async (req, res, next) => {
  try {
    const banner = await bannerService.updateBanner({
      id: req.params.id,
      body: req.body,
      file: req.file,
    });
    res.status(200).json({ success: true, banner });
  } catch (error) {
    next(error);
  }
};

export const deleteBanner = async (req, res, next) => {
  try {
    await bannerService.deleteBanner(req.params.id);
    res.status(200).json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const patchBannerStatus = async (req, res, next) => {
  try {
    const banner = await bannerService.patchBannerStatus(req.params.id, req.body.isActive);
    res.status(200).json({ success: true, banner });
  } catch (error) {
    next(error);
  }
};
