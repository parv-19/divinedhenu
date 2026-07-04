import express from 'express';
import { createFirstAdmin, getAdminProfile, loginAdmin } from '../controllers/authController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/setup', createFirstAdmin);
router.get('/me', protectAdmin, getAdminProfile);

export default router;
