import express from 'express';
import { listOrders, retryShiprocket } from '../controllers/orderController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protectAdmin, listOrders);
router.post('/:orderId/retry-shiprocket', protectAdmin, retryShiprocket);

export default router;
