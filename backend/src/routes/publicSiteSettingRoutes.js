import express from 'express';
import { getSiteSettings } from '../controllers/siteSettingController.js';

const router = express.Router();

router.get('/', getSiteSettings);

export default router;
