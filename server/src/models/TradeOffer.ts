import mongoose from 'mongoose';

const tradeOfferSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    offeredListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    targetPoints: {
      type: Number,
      required: true,
      default: 0,
    },
    offeredPoints: {
      type: Number,
      required: true,
      default: 0,
    },
    cashDifference: {
      type: Number,
      required: true,
      default: 0,
    },
    cashStatus: {
      type: String,
      enum: ['pending', 'paid', 'not_required'],
      default: 'not_required',
    },
    paymentId: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'completed'],
      default: 'pending',
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const TradeOffer = mongoose.model('TradeOffer', tradeOfferSchema);
export default TradeOffer;
