import Offer from '../models/Offer.js';
import { parseBoolean, parseNumber } from '../utils/request.js';

const removeUndefined = (payload) => Object.fromEntries(
  Object.entries(payload).filter(([, value]) => value !== undefined)
);

const parseDate = (value) => {
  if (!value) return value === '' ? null : undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const normalizeOfferPayload = (body) => removeUndefined({
  text: body.text,
  type: body.type,
  discountPercent: parseNumber(body.discountPercent),
  couponCode: body.couponCode,
  isActive: parseBoolean(body.isActive),
  startDate: parseDate(body.startDate),
  endDate: parseDate(body.endDate),
});

export const createOffer = (body) => {
  return Offer.create(normalizeOfferPayload(body));
};

export const getAdminOffers = (query = {}) => {
  const filter = {};
  if (query.type) filter.type = query.type;
  if (parseBoolean(query.isActive) !== undefined) filter.isActive = parseBoolean(query.isActive);

  return Offer.find(filter).sort({ createdAt: -1 });
};

export const getActiveOffers = () => {
  const now = new Date();

  return Offer.find({
    isActive: true,
    $and: [
      { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
      { $or: [{ endDate: null }, { endDate: { $gte: now } }] },
    ],
  }).sort({ createdAt: -1 });
};

export const getOfferById = async (id) => {
  const offer = await Offer.findById(id);
  if (!offer) {
    const error = new Error('Offer not found');
    error.statusCode = 404;
    throw error;
  }

  return offer;
};

export const updateOffer = async (id, body) => {
  const offer = await getOfferById(id);
  Object.assign(offer, normalizeOfferPayload(body));
  return offer.save();
};

export const deleteOffer = async (id) => {
  const offer = await getOfferById(id);
  await offer.deleteOne();
  return offer;
};

export const patchOfferStatus = async (id, value) => {
  const offer = await getOfferById(id);
  offer.isActive = parseBoolean(value) ?? !offer.isActive;
  return offer.save();
};
