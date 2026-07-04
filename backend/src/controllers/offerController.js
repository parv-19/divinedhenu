import * as offerService from '../services/offerService.js';

export const createOffer = async (req, res, next) => {
  try {
    const offer = await offerService.createOffer(req.body);
    res.status(201).json({ success: true, offer });
  } catch (error) {
    next(error);
  }
};

export const getAdminOffers = async (req, res, next) => {
  try {
    const offers = await offerService.getAdminOffers(req.query);
    res.status(200).json({ success: true, offers });
  } catch (error) {
    next(error);
  }
};

export const getOfferById = async (req, res, next) => {
  try {
    const offer = await offerService.getOfferById(req.params.id);
    res.status(200).json({ success: true, offer });
  } catch (error) {
    next(error);
  }
};

export const getActiveOffers = async (req, res, next) => {
  try {
    const offers = await offerService.getActiveOffers();
    res.status(200).json({ success: true, offers });
  } catch (error) {
    next(error);
  }
};

export const updateOffer = async (req, res, next) => {
  try {
    const offer = await offerService.updateOffer(req.params.id, req.body);
    res.status(200).json({ success: true, offer });
  } catch (error) {
    next(error);
  }
};

export const deleteOffer = async (req, res, next) => {
  try {
    await offerService.deleteOffer(req.params.id);
    res.status(200).json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const patchOfferStatus = async (req, res, next) => {
  try {
    const offer = await offerService.patchOfferStatus(req.params.id, req.body.isActive);
    res.status(200).json({ success: true, offer });
  } catch (error) {
    next(error);
  }
};
