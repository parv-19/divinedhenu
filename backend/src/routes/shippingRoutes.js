import express from 'express';
import { quoteShipping } from '../controllers/orderController.js';

const router = express.Router();

router.post('/quote', quoteShipping);

export default router;
