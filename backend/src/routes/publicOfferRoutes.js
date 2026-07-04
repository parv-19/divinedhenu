import express from 'express';
import { getActiveOffers } from '../controllers/offerController.js';

const router = express.Router();

router.get('/active', getActiveOffers);

export default router;
