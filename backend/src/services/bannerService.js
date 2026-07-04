import Banner from '../models/Banner.js';
import { deleteFromCloudinary, uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';
import { parseBoolean, parseNumber, parseObject } from '../utils/request.js';

const removeUndefined = (payload) => Object.fromEntries(
  Object.entries(payload).filter(([, value]) => value !== undefined)
);

const normalizeBannerPayload = (body) => removeUndefined({
  title: body.title,
  subtitle: body.subtitle,
  buttonText: body.buttonText,
  buttonLink: body.buttonLink,
  image: parseObject(body.image),
  position: body.position,
  isActive: parseBoolean(body.isActive),
  sortOrder: parseNumber(body.sortOrder),
});

export const createBanner = async ({ body, file }) => {
  const payload = normalizeBannerPayload(body);

  if (file) {
    payload.image = await uploadBufferToCloudinary(file.buffer, 'divinedhenu/banners');
  }

  return Banner.create(payload);
};

export const getAdminBanners = (query = {}) => {
  const filter = {};
  if (query.position) filter.position = query.position;
  if (parseBoolean(query.isActive) !== undefined) filter.isActive = parseBoolean(query.isActive);

  return Banner.find(filter).sort({ sortOrder: 1, createdAt: -1 });
};

export const getPublicBanners = (query = {}) => {
  const filter = { isActive: true };
  if (query.position) filter.position = query.position;

  return Banner.find(filter).sort({ sortOrder: 1, createdAt: -1 });
};

export const getBannerById = async (id) => {
  const banner = await Banner.findById(id);
  if (!banner) {
    const error = new Error('Banner not found');
    error.statusCode = 404;
    throw error;
  }

  return banner;
};

export const updateBanner = async ({ id, body, file }) => {
  const banner = await getBannerById(id);
  const payload = normalizeBannerPayload(body);

  if (file) {
    if (banner.image?.publicId) {
      await deleteFromCloudinary(banner.image.publicId);
    }
    payload.image = await uploadBufferToCloudinary(file.buffer, 'divinedhenu/banners');
  }

  Object.assign(banner, payload);
  return banner.save();
};

export const deleteBanner = async (id) => {
  const banner = await getBannerById(id);

  if (banner.image?.publicId) {
    await deleteFromCloudinary(banner.image.publicId);
  }

  await banner.deleteOne();
  return banner;
};

export const patchBannerStatus = async (id, value) => {
  const banner = await getBannerById(id);
  banner.isActive = parseBoolean(value) ?? !banner.isActive;
  return banner.save();
};
