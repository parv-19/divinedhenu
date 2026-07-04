import * as siteSettingService from '../services/siteSettingService.js';

export const getSiteSettings = async (req, res, next) => {
  try {
    const settings = await siteSettingService.getSiteSettings();
    res.status(200).json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

export const updateSiteSettings = async (req, res, next) => {
  try {
    const settings = await siteSettingService.updateSiteSettings({
      body: req.body,
      files: req.files,
    });
    res.status(200).json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};
