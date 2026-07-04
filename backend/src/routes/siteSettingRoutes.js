import express from 'express';
import { getSiteSettings, updateSiteSettings } from '../controllers/siteSettingController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protectAdmin, getSiteSettings)
  .put(protectAdmin, upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'aboutImage', maxCount: 1 },
    { name: 'navbarLogo', maxCount: 1 },
    { name: 'brandWordmark', maxCount: 1 },
  ]), updateSiteSettings);

export default router;
