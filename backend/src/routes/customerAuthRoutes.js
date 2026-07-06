import express from 'express';
import { getCustomerProfile, loginCustomer, loginWithGoogle, registerCustomer } from '../controllers/customerAuthController.js';
import { protectCustomer } from '../middleware/customerAuthMiddleware.js';

const router = express.Router();

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/google', loginWithGoogle);
router.get('/me', protectCustomer, getCustomerProfile);

export default router;
