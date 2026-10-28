import express from 'express';
import {
  createTradeOffer,
  getIncomingTradeOffers,
  getOutgoingTradeOffers,
  respondToTradeOffer,
} from '../controllers/trade.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createTradeOffer);
router.get('/incoming', protect, getIncomingTradeOffers);
router.get('/outgoing', protect, getOutgoingTradeOffers);
router.patch('/:id/respond', protect, respondToTradeOffer);

export default router;
