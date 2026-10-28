import Listing from '../models/Listing.js';
// GET /api/listings — search + filter
export const getListings = async (req, res) => {
    try {
        const { q, // text search
        type, // Sell | Rent | Barter
        category, condition, minPrice, maxPrice, location, page = '1', limit = '20', } = req.query;
        const query = { isActive: true };
        if (q) {
            query.$text = { $search: q };
        }
        if (type && type !== 'All')
            query.type = type;
        if (category && category !== 'All categories')
            query.category = category;
        if (condition)
            query.condition = condition;
        if (location)
            query.location = { $regex: location, $options: 'i' };
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = Number(minPrice);
            if (maxPrice)
                query.price.$lte = Number(maxPrice);
        }
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const [listings, total] = await Promise.all([
            Listing.find(query)
                .populate('seller', 'name avatarUrl')
                .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            Listing.countDocuments(query),
        ]);
        res.json({ listings, total, page: pageNum, pages: Math.ceil(total / limitNum) });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// GET /api/listings/:id
export const getListing = async (req, res) => {
    try {
        const listing = await Listing.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true }).populate('seller', 'name avatarUrl email');
        if (!listing) {
            res.status(404).json({ message: 'Listing not found' });
            return;
        }
        res.json(listing);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// POST /api/listings
export const createListing = async (req, res) => {
    try {
        const { title, description, price, rentPerDay, type, category, condition, images, location } = req.body;
        const listing = await Listing.create({
            title, description, price, rentPerDay, type, category, condition,
            images: images || [],
            location: location || 'Bengaluru',
            seller: req.user._id,
        });
        res.status(201).json(listing);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// PATCH /api/listings/:id
export const updateListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            res.status(404).json({ message: 'Listing not found' });
            return;
        }
        if (listing.seller.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }
        const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// DELETE /api/listings/:id
export const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            res.status(404).json({ message: 'Listing not found' });
            return;
        }
        if (listing.seller.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }
        await listing.deleteOne();
        res.json({ message: 'Listing removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// POST /api/listings/:id/save  (toggle saved)
export const toggleSaveListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            res.status(404).json({ message: 'Listing not found' });
            return;
        }
        const userId = req.user._id;
        const idx = listing.savedBy.indexOf(userId);
        if (idx === -1)
            listing.savedBy.push(userId);
        else
            listing.savedBy.splice(idx, 1);
        await listing.save();
        res.json({ saved: idx === -1, savedCount: listing.savedBy.length });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// GET /api/listings/my  — current user's listings
export const getMyListings = async (req, res) => {
    try {
        const listings = await Listing.find({ seller: req.user._id }).sort({ createdAt: -1 });
        res.json(listings);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// GET /api/listings/saved — listings saved by current user
export const getSavedListings = async (req, res) => {
    try {
        const listings = await Listing.find({ savedBy: req.user._id })
            .populate('seller', 'name avatarUrl')
            .sort({ createdAt: -1 });
        res.json(listings);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
