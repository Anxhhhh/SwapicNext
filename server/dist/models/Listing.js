import mongoose from 'mongoose';
const listingSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, default: 0 },
    rentPerDay: { type: Number, default: 0 },
    type: {
        type: String,
        enum: ['Sell', 'Rent', 'Barter', 'Buy'],
        required: true,
    },
    category: {
        type: String,
        enum: ['Electronics', 'Furniture', 'Clothing', 'Books', 'Sports', 'Toys', 'Home & Living', 'Other'],
        required: true,
    },
    condition: {
        type: String,
        enum: ['New', 'Like New', 'Good', 'Fair', 'Used'],
        required: true,
    },
    images: [{ type: String }],
    location: { type: String, default: 'Bengaluru' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });
// Text search index
listingSchema.index({ title: 'text', description: 'text', category: 'text', location: 'text' });
const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
