import TradeOffer from '../models/TradeOffer.js';
import Listing from '../models/Listing.js';
// POST /api/trades — Submit a new hybrid barter offer
export const createTradeOffer = async (req, res) => {
    try {
        const { targetListingId, offeredListingId, note, paymentId } = req.body;
        if (!targetListingId || !offeredListingId) {
            res.status(400).json({ message: 'Both target item and offered item are required' });
            return;
        }
        const targetListing = await Listing.findById(targetListingId);
        if (!targetListing) {
            res.status(404).json({ message: 'Target listing not found' });
            return;
        }
        const offeredListing = await Listing.findById(offeredListingId);
        if (!offeredListing) {
            res.status(404).json({ message: 'Offered listing not found' });
            return;
        }
        // Verify ownership of offered listing
        if (offeredListing.seller.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: 'You can only offer items you have listed' });
            return;
        }
        // Cannot trade with yourself
        if (targetListing.seller.toString() === req.user._id.toString()) {
            res.status(400).json({ message: 'You cannot trade with your own listing' });
            return;
        }
        // Calculate points (1 Point = 1 INR)
        const targetPoints = targetListing.price || 0;
        const offeredPoints = offeredListing.price || 0;
        const cashDifference = Math.max(0, targetPoints - offeredPoints);
        const cashStatus = cashDifference > 0 ? (paymentId ? 'paid' : 'pending') : 'not_required';
        const trade = await TradeOffer.create({
            sender: req.user._id,
            receiver: targetListing.seller,
            targetListing: targetListing._id,
            offeredListing: offeredListing._id,
            targetPoints,
            offeredPoints,
            cashDifference,
            cashStatus,
            paymentId: paymentId || '',
            note: note || '',
            status: 'pending',
        });
        const populated = await TradeOffer.findById(trade._id)
            .populate('sender', 'name email avatarUrl')
            .populate('receiver', 'name email avatarUrl')
            .populate('targetListing')
            .populate('offeredListing');
        res.status(201).json(populated);
    }
    catch (error) {
        console.error('Error creating trade offer:', error);
        res.status(500).json({ message: error.message || 'Failed to create trade offer' });
    }
};
// GET /api/trades/incoming — Trade offers received by current user
export const getIncomingTradeOffers = async (req, res) => {
    try {
        const trades = await TradeOffer.find({ receiver: req.user._id })
            .populate('sender', 'name email avatarUrl')
            .populate('targetListing')
            .populate('offeredListing')
            .sort({ createdAt: -1 });
        res.status(200).json(trades);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// GET /api/trades/outgoing — Trade offers sent by current user
export const getOutgoingTradeOffers = async (req, res) => {
    try {
        const trades = await TradeOffer.find({ sender: req.user._id })
            .populate('receiver', 'name email avatarUrl')
            .populate('targetListing')
            .populate('offeredListing')
            .sort({ createdAt: -1 });
        res.status(200).json(trades);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// PATCH /api/trades/:id/respond — Accept or decline an offer
export const respondToTradeOffer = async (req, res) => {
    try {
        const { action } = req.body; // 'accept' | 'decline'
        if (!['accept', 'decline'].includes(action)) {
            res.status(400).json({ message: 'Invalid action. Must be accept or decline.' });
            return;
        }
        const trade = await TradeOffer.findById(req.params.id);
        if (!trade) {
            res.status(404).json({ message: 'Trade offer not found' });
            return;
        }
        // Only receiver can accept/decline
        if (trade.receiver.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: 'Not authorized to respond to this offer' });
            return;
        }
        if (trade.status !== 'pending') {
            res.status(400).json({ message: `Trade offer has already been ${trade.status}` });
            return;
        }
        trade.status = action === 'accept' ? 'accepted' : 'declined';
        await trade.save();
        const updated = await TradeOffer.findById(trade._id)
            .populate('sender', 'name email avatarUrl')
            .populate('receiver', 'name email avatarUrl')
            .populate('targetListing')
            .populate('offeredListing');
        res.status(200).json(updated);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
