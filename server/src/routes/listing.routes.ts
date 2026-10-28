import express from 'express';
import {
  getListings, getListing, createListing,
  updateListing, deleteListing, toggleSaveListing,
  getMyListings, getSavedListings,
} from '../controllers/listing.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/',         getListings);
router.get('/my',       protect, getMyListings);
router.get('/saved',    protect, getSavedListings);
router.get('/:id',      getListing);
router.post('/',        protect, createListing);
router.patch('/:id',    protect, updateListing);
router.delete('/:id',   protect, deleteListing);
router.post('/:id/save', protect, toggleSaveListing);

export default router;
