import express from 'express';
import { createOrder } from '../controllers/orderController.js';
import { protectCustomer } from '../middleware/customerAuthMiddleware.js';

const router = express.Router();

router.post('/', protectCustomer, createOrder);
router.post('/create', protectCustomer, createOrder);

export default router;
