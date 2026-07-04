import SiteSetting from '../models/SiteSetting.js';
import { deleteFromCloudinary, uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';
import { parseObject } from '../utils/request.js';

const defaultSettings = {
  brandName: 'DivineDhenu',
  footerText: 'Scents that turn spaces into rituals.',
  newsletterTitle: 'Ritual notes for your inbox',
  newsletterDescription: 'Stories, offers, and new fragrance launches.',
  aboutEyebrow: 'DivineDhenu',
  aboutHeroTitle: 'Fragrance for the Spaces That Hold You',
  aboutHeroDescription: 'We create refined ritual fragrances for modern Indian homes, where prayer corners, work desks, and quiet evenings all deserve a moment of intention.',
  aboutButtonText: 'Begin Your Ritual',
  aboutButtonLink: '/shop',
  aboutStoryTitle: 'A Softer Way to Come Home',
  aboutStoryDescription: 'DivineDhenu was created to bring mindful ritual moments into modern homes. Each blend is imagined around the feeling it should leave behind: calmer rooms, focused mornings, devotional corners, and gifts that carry real meaning.',
  aboutValue1: 'Calm over chaos',
  aboutValue2: 'Ritual over routine',
  aboutValue3: 'Craft over mass production',
  aboutValue4: 'Gifting with meaning',
  aboutProcessTitle: 'Our Process',
  aboutProcessDescription: 'From aroma direction to gift-ready packing, each step is designed to feel thoughtful and quietly premium.',
  aboutProcessStep1: 'Select aroma direction',
  aboutProcessStep2: 'Blend ritual notes',
  aboutProcessStep3: 'Hand-pack with care',
  aboutProcessStep4: 'Deliver gift-ready',
};

const removeUndefined = (payload) => Object.fromEntries(
  Object.entries(payload).filter(([, value]) => value !== undefined)
);

const parseImage = (value) => {
  if (Array.isArray(value)) {
    return value.map(parseImage).find((image) => image?.url);
  }

  return parseObject(value);
};

const normalizeSettingsPayload = (body) => removeUndefined({
  brandName: body.brandName,
  logo: parseImage(body.logo),
  aboutImage: parseImage(body.aboutImage),
  aboutEyebrow: body.aboutEyebrow,
  aboutHeroTitle: body.aboutHeroTitle,
  aboutHeroDescription: body.aboutHeroDescription,
  aboutButtonText: body.aboutButtonText,
  aboutButtonLink: body.aboutButtonLink,
  aboutStoryTitle: body.aboutStoryTitle,
  aboutStoryDescription: body.aboutStoryDescription,
  aboutValue1: body.aboutValue1,
  aboutValue2: body.aboutValue2,
  aboutValue3: body.aboutValue3,
  aboutValue4: body.aboutValue4,
  aboutProcessTitle: body.aboutProcessTitle,
  aboutProcessDescription: body.aboutProcessDescription,
  aboutProcessStep1: body.aboutProcessStep1,
  aboutProcessStep2: body.aboutProcessStep2,
  aboutProcessStep3: body.aboutProcessStep3,
  aboutProcessStep4: body.aboutProcessStep4,
  navbarLogo: parseImage(body.navbarLogo),
  brandWordmark: parseImage(body.brandWordmark),
  email: body.email,
  phone: body.phone,
  whatsapp: body.whatsapp,
  instagram: body.instagram,
  facebook: body.facebook,
  youtube: body.youtube,
  address: body.address,
  footerText: body.footerText,
  newsletterTitle: body.newsletterTitle,
  newsletterDescription: body.newsletterDescription,
  seoDefaultTitle: body.seoDefaultTitle,
  seoDefaultDescription: body.seoDefaultDescription,
});

export const getSiteSettings = async () => {
  let settings = await SiteSetting.findOne();

  if (!settings) {
    settings = await SiteSetting.create(defaultSettings);
  }

  return settings;
};

export const updateSiteSettings = async ({ body, files = {} }) => {
  const settings = await getSiteSettings();
  const payload = normalizeSettingsPayload(body);

  if (payload.aboutImage && !payload.aboutImage.url && settings.aboutImage?.publicId) {
    await deleteFromCloudinary(settings.aboutImage.publicId);
  }

  const logoFile = files.logo?.[0];
  if (logoFile) {
    if (settings.logo?.publicId) {
      await deleteFromCloudinary(settings.logo.publicId);
    }
    payload.logo = await uploadBufferToCloudinary(logoFile.buffer, 'divinedhenu/settings');
  }

  const aboutImageFile = files.aboutImage?.[0];
  if (aboutImageFile) {
    if (settings.aboutImage?.publicId) {
      await deleteFromCloudinary(settings.aboutImage.publicId);
    }
    payload.aboutImage = await uploadBufferToCloudinary(aboutImageFile.buffer, 'divinedhenu/settings');
  }

  const navbarLogoFile = files.navbarLogo?.[0];
  if (navbarLogoFile) {
    if (settings.navbarLogo?.publicId) {
      await deleteFromCloudinary(settings.navbarLogo.publicId);
    }
    payload.navbarLogo = await uploadBufferToCloudinary(navbarLogoFile.buffer, 'divinedhenu/settings');
  }

  const brandWordmarkFile = files.brandWordmark?.[0];
  if (brandWordmarkFile) {
    if (settings.brandWordmark?.publicId) {
      await deleteFromCloudinary(settings.brandWordmark.publicId);
    }
    payload.brandWordmark = await uploadBufferToCloudinary(brandWordmarkFile.buffer, 'divinedhenu/settings');
  }

  Object.assign(settings, payload);
  return settings.save();
};
