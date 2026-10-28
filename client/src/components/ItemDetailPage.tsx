'use client';
import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, MapPin, Star, Heart, Eye,
  Shield, MessageCircle, Clock, Tag, Package, ChevronLeft, ChevronRight,
  CreditCard, Send, X, CheckCircle, RefreshCw, Coins, ArrowRightLeft, Plus
} from 'lucide-react';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { initiatePayment } from '../utils/razorpay';
import { toast } from 'react-toastify';

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  rentPerDay: number;
  type: string;
  category: string;
  condition: string;
  images: string[];
  location: string;
  seller: { _id: string; name: string; avatarUrl?: string; email?: string };
  savedBy: string[];
  views: number;
  createdAt: string;
}

const TYPE_COLORS: Record<string, string> = {
  Sell: 'bg-blue-50 text-blue-600 border border-blue-100',
  Rent: 'bg-purple-50 text-purple-600 border border-purple-100',
  Barter: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
};

const CONDITION_COLORS: Record<string, string> = {
  New: 'text-emerald-600 bg-emerald-50',
  'Like New': 'text-teal-600 bg-teal-50',
  Good: 'text-blue-600 bg-blue-50',
  Fair: 'text-amber-600 bg-amber-50',
  Used: 'text-gray-600 bg-gray-100',
};

interface Props {
  listingId: string;
  onBack: () => void;
  onLoginRequired?: () => void;
}

const ItemDetailPage = ({ listingId, onBack, onLoginRequired }: Props) => {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [isPaying, setIsPaying] = useState(false);

  // Contact Seller Modal state
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  // Hybrid Swap & Top-Up Modal state
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [selectedMyListingId, setSelectedMyListingId] = useState<string>('');
  const [swapNote, setSwapNote] = useState('');
  const [loadingMyListings, setLoadingMyListings] = useState(false);
  const [isSubmittingSwap, setIsSubmittingSwap] = useState(false);

  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    let isMounted = true;
    const fetch = async () => {
      try {
        const res = await api.get(`/listings/${listingId}`);
        if (isMounted) {
          setListing(res.data);
          setSaved(res.data.savedBy?.includes(user?._id));
        }
      } catch {
        toast.error('Failed to load listing');
        onBack();
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetch();
    return () => { isMounted = false; };
  }, [listingId, user?._id]);

  const handleSave = async () => {
    if (!isAuthenticated) { onLoginRequired?.(); return; }
    try {
      const res = await api.post(`/listings/${listingId}/save`);
      setSaved(res.data.saved);
      toast.success(res.data.saved ? 'Saved to your wishlist' : 'Removed from wishlist');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const handlePayment = async () => {
    if (!isAuthenticated) {
      onLoginRequired?.();
      return;
    }
    if (!listing) return;

    const amount = listing.type === 'Rent' ? (listing.rentPerDay || 100) : (listing.price || 500);

    setIsPaying(true);
    try {
      await initiatePayment(
        amount,
        (result) => {
          setIsPaying(false);
          toast.success(
            `🎉 Payment of ₹${amount.toLocaleString('en-IN')} successful! Your ${
              listing.type === 'Rent' ? 'rental' : 'order'
            } has been confirmed.`
          );
        },
        (err) => {
          setIsPaying(false);
          toast.error(typeof err === 'string' ? err : 'Payment failed. Please try again.');
        }
      );
    } catch (err: any) {
      setIsPaying(false);
      toast.error(err.message || 'Payment initiation error');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    toast.success(`Message sent to ${listing?.seller?.name || 'Seller'}! They will respond shortly.`);
    setContactMessage('');
    setShowContactModal(false);
  };

  // Open Swap Modal & fetch user's active listings
  const handleOpenSwapModal = async () => {
    if (!isAuthenticated) {
      onLoginRequired?.();
      return;
    }
    setShowSwapModal(true);
    setLoadingMyListings(true);
    try {
      const res = await api.get('/listings/my');
      setMyListings(res.data || []);
      if (res.data?.length > 0) {
        setSelectedMyListingId(res.data[0]._id);
      }
    } catch (err) {
      toast.error('Failed to load your listings for trade');
    } finally {
      setLoadingMyListings(false);
    }
  };

  // Selected item calculations
  const selectedOfferedListing = myListings.find(l => l._id === selectedMyListingId);
  const targetPoints = listing?.price || 0;
  const offeredPoints = selectedOfferedListing?.price || 0;
  const cashDifference = Math.max(0, targetPoints - offeredPoints);

  const handleSubmitSwapOffer = async () => {
    if (!selectedMyListingId || !listing) return;
    setIsSubmittingSwap(true);

    try {
      // If there is a cash difference to pay, initiate Razorpay
      if (cashDifference > 0) {
        await initiatePayment(
          cashDifference,
          async (paymentResult) => {
            await api.post('/trades', {
              targetListingId: listing._id,
              offeredListingId: selectedMyListingId,
              note: swapNote,
              paymentId: paymentResult?.paymentId || `pay_diff_${Date.now()}`,
            });
            setIsSubmittingSwap(false);
            setShowSwapModal(false);
            toast.success(
              `🎉 Trade proposal sent with ₹${cashDifference.toLocaleString('en-IN')} cash top-up! The seller has been notified.`
            );
          },
          (err) => {
            setIsSubmittingSwap(false);
            toast.error(typeof err === 'string' ? err : 'Failed to process top-up difference payment');
          }
        );
      } else {
        // Direct equal/favorable swap
        await api.post('/trades', {
          targetListingId: listing._id,
          offeredListingId: selectedMyListingId,
          note: swapNote,
        });
        setIsSubmittingSwap(false);
        setShowSwapModal(false);
        toast.success(`🎉 Swap proposal submitted! The seller will review your trade offer.`);
      }
    } catch (err: any) {
      setIsSubmittingSwap(false);
      toast.error(err.response?.data?.message || err.message || 'Failed to submit swap proposal');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#E96B16] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) return null;

  const images = listing.images?.length
    ? listing.images
    : ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&fit=crop'];

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[14px] font-medium text-[#654332] hover:text-[#E96B16] transition-colors mb-6 group cursor-pointer"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-[#ede8e1] shadow-sm">
            <img
              src={images[imgIndex]}
              alt={listing.title}
              className="w-full h-full object-cover transition-all duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&fit=crop';
              }}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIndex((i) => (i > 0 ? i - 1 : images.length - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setImgIndex((i) => (i < images.length - 1 ? i + 1 : 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    i === imgIndex ? 'border-[#E96B16] shadow-sm scale-105' : 'border-[#ede8e1] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details & Actions */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-[12px] font-bold px-3 py-1 rounded-full ${TYPE_COLORS[listing.type] || 'bg-gray-100 text-gray-700'}`}>
                {listing.type}
              </span>
              <span className="text-[12px] font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {listing.category}
              </span>
              <span className={`text-[12px] font-semibold px-3 py-1 rounded-full ${CONDITION_COLORS[listing.condition] || 'bg-gray-100 text-gray-700'}`}>
                {listing.condition}
              </span>
            </div>
            <h1 className="text-[1.8rem] font-extrabold text-[#35190F] leading-snug">{listing.title}</h1>
          </div>

          {/* Pricing, Points & Stats Box */}
          <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#ede8e1] relative overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">MARKETPLACE VALUATION</span>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#E96B16] bg-[#E96B16]/10 px-3 py-1 rounded-full">
                <Coins size={14} /> 1 Pt = ₹1
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-[2.2rem] font-black text-[#35190F]">
                🪙 {(listing.price || 0).toLocaleString('en-IN')} <span className="text-[1.4rem] font-semibold text-gray-500">Pts</span>
              </span>
              <span className="text-[1.3rem] font-bold text-[#E96B16]">
                (₹{(listing.price || 0).toLocaleString('en-IN')})
              </span>
            </div>

            {listing.type === 'Rent' && (
              <p className="text-[13px] font-semibold text-purple-700 mt-1">
                Also available for Rent: ₹{(listing.rentPerDay || 0).toLocaleString('en-IN')}/day
              </p>
            )}

            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#ede8e1] text-[13px] text-gray-500 flex-wrap">
              <div className="flex items-center gap-1"><Eye size={13} /> {listing.views} views</div>
              <div className="flex items-center gap-1"><Clock size={13} /> Listed {formatDate(listing.createdAt)}</div>
              <div className="flex items-center gap-1"><MapPin size={13} className="text-[#E96B16]" /> {listing.location}</div>
            </div>
          </div>

          {/* Core Action CTAs */}
          <div className="flex flex-col gap-3">
            {/* Primary Hybrid Swap Button */}
            <button
              onClick={handleOpenSwapModal}
              className="w-full bg-[#35190F] hover:bg-[#E96B16] text-white font-bold text-[15.5px] py-4 rounded-xl hover:shadow-[0_6px_24px_rgba(233,107,22,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowRightLeft size={19} className="stroke-[2.5]" />
              Swap with My Item + Pay Difference
            </button>

            {/* Direct Cash Buy / Rent */}
            {listing.type === 'Sell' && (
              <button
                disabled={isPaying}
                onClick={handlePayment}
                className="w-full bg-[#E96B16] text-white font-bold text-[15px] py-3.5 rounded-xl hover:bg-[#d45d0f] hover:shadow-[0_6px_24px_rgba(233,107,22,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                <CreditCard size={18} />
                {isPaying ? 'Processing...' : `Buy Directly for ₹${(listing.price || 0).toLocaleString('en-IN')}`}
              </button>
            )}

            {listing.type === 'Rent' && (
              <button
                disabled={isPaying}
                onClick={handlePayment}
                className="w-full bg-[#1D60C9] text-white font-bold text-[15px] py-3.5 rounded-xl hover:bg-[#1650ab] hover:shadow-[0_6px_24px_rgba(29,96,201,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                <CreditCard size={18} />
                {isPaying ? 'Processing...' : `Rent Now (₹${(listing.rentPerDay || 0).toLocaleString('en-IN')}/day)`}
              </button>
            )}

            {/* Secondary Buttons: Contact & Save */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (!isAuthenticated) { onLoginRequired?.(); return; }
                  setShowContactModal(true);
                }}
                className="flex-1 bg-white border-2 border-[#ddd5c8] text-[#35190F] font-bold text-[14.5px] py-3 rounded-xl hover:border-[#35190F] hover:bg-[#FAF7F2] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle size={18} /> Contact Seller
              </button>

              <button
                onClick={handleSave}
                className={`px-6 font-bold text-[14.5px] py-3 rounded-xl transition-all border-2 flex items-center justify-center gap-2 cursor-pointer ${
                  saved
                    ? 'bg-[#E96B16]/10 border-[#E96B16] text-[#E96B16]'
                    : 'bg-white border-[#ddd5c8] text-[#654332] hover:border-[#E96B16]'
                }`}
              >
                <Heart size={18} className={saved ? 'fill-[#E96B16]' : ''} />
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

          {/* Seller profile card */}
          <div className="bg-white rounded-2xl border border-[#ede8e1] p-5 shadow-sm">
            <h3 className="text-[12px] font-bold text-gray-400 tracking-wider uppercase mb-3">LISTED BY</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E96B16]/10 flex items-center justify-center text-[#E96B16] font-extrabold text-[1.1rem]">
                {listing.seller?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <div className="font-bold text-[#35190F]">{listing.seller?.name || 'Swapic Member'}</div>
                <div className="flex items-center gap-1 text-[12px] text-gray-500 mt-0.5">
                  <Star size={11} className="fill-amber-400 text-amber-400" /> 4.9 · Verified Community Member
                </div>
              </div>
              <div className="ml-auto">
                <div className="flex items-center gap-1 text-[12px] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-semibold">
                  <Shield size={12} /> Trusted
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-[#ede8e1] p-5 shadow-sm">
            <h3 className="text-[12px] font-bold text-gray-400 tracking-wider uppercase mb-3 flex items-center gap-2">
              <Package size={14} /> Description
            </h3>
            <p className="text-[14.5px] text-[#35190F] leading-relaxed whitespace-pre-wrap">{listing.description}</p>
          </div>
        </div>
      </div>

      {/* ─────────────────── Hybrid Swap & Top-Up Modal ─────────────────── */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSwapModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-[#35190F]"
            >
              <X size={22} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#E96B16]/10 flex items-center justify-center text-[#E96B16]">
                <ArrowRightLeft size={16} />
              </div>
              <h3 className="text-[1.3rem] font-black text-[#35190F]">Item Swap + Cash Top-Up</h3>
            </div>
            <p className="text-[13.5px] text-gray-500 mb-5 leading-relaxed">
              Exchange your item for this product. If your item has fewer points, pay the remaining cash difference!
            </p>

            {loadingMyListings ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-3 border-[#E96B16] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : myListings.length === 0 ? (
              <div className="bg-[#FAF7F2] border border-[#ede8e1] rounded-2xl p-6 text-center">
                <Package size={36} className="mx-auto text-[#d4c6bc] mb-2" />
                <h4 className="font-bold text-[#35190F] mb-1">You have no items listed yet</h4>
                <p className="text-[13px] text-gray-500 mb-4">
                  To propose a swap, you must first have at least one active listing in your account.
                </p>
                <button
                  onClick={() => {
                    setShowSwapModal(false);
                    onBack();
                  }}
                  className="bg-[#E96B16] text-white font-bold text-[13.5px] px-5 py-2.5 rounded-full hover:bg-[#d45d0f]"
                >
                  Go Back to Marketplace
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {/* Visual Exchange Diagram */}
                <div className="grid grid-cols-2 gap-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#ede8e1]">
                  {/* Desired Item */}
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">You Get</span>
                    <div className="bg-white p-3 rounded-xl border border-[#ede8e1] flex-1 flex flex-col justify-between">
                      <p className="font-bold text-[13px] text-[#35190F] line-clamp-2">{listing.title}</p>
                      <div className="mt-2 text-[#E96B16] font-extrabold text-[14px]">
                        🪙 {targetPoints.toLocaleString('en-IN')} pts
                      </div>
                    </div>
                  </div>

                  {/* Offered Item Selector */}
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">You Give</span>
                    <div className="bg-white p-3 rounded-xl border border-[#ede8e1] flex-1 flex flex-col justify-between">
                      <select
                        value={selectedMyListingId}
                        onChange={(e) => setSelectedMyListingId(e.target.value)}
                        className="w-full text-[13px] font-bold text-[#35190F] bg-transparent outline-none border-b pb-1 cursor-pointer"
                      >
                        {myListings.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.title} ({item.price} pts)
                          </option>
                        ))}
                      </select>
                      <div className="mt-2 text-emerald-600 font-extrabold text-[14px]">
                        🪙 {offeredPoints.toLocaleString('en-IN')} pts
                      </div>
                    </div>
                  </div>
                </div>

                {/* Point Math Breakdown Card */}
                <div className="bg-white border-2 border-[#ede8e1] rounded-2xl p-4 flex flex-col gap-2">
                  <div className="flex justify-between text-[13.5px] text-[#654332]">
                    <span>Target Item Value:</span>
                    <span className="font-bold text-[#35190F]">🪙 {targetPoints.toLocaleString('en-IN')} Points</span>
                  </div>
                  <div className="flex justify-between text-[13.5px] text-[#654332]">
                    <span>Your Offered Item:</span>
                    <span className="font-bold text-emerald-600">- 🪙 {offeredPoints.toLocaleString('en-IN')} Points</span>
                  </div>

                  <div className="h-px bg-[#ede8e1] my-1" />

                  {cashDifference > 0 ? (
                    <div className="flex justify-between items-center text-[15px]">
                      <span className="font-bold text-[#35190F]">Remaining Cash Top-Up:</span>
                      <span className="font-black text-[18px] text-[#E96B16]">
                        ₹{cashDifference.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ) : cashDifference === 0 ? (
                    <div className="flex justify-between items-center text-[14px] text-emerald-600 font-bold">
                      <span>Exact Point Match:</span>
                      <span>₹0 (Even Barter)</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center text-[14px] text-emerald-600 font-bold">
                      <span>Your item value is higher:</span>
                      <span>+🪙 {Math.abs(targetPoints - offeredPoints)} Pts Surplus</span>
                    </div>
                  )}
                </div>

                {/* Note to Seller */}
                <div>
                  <label className="block text-[13px] font-bold text-[#35190F] mb-1.5">Note to Seller (Optional)</label>
                  <input
                    type="text"
                    value={swapNote}
                    onChange={(e) => setSwapNote(e.target.value)}
                    placeholder="e.g. My item is in like-new condition with original box..."
                    className="w-full border border-[#ddd5c8] rounded-xl px-3.5 py-2.5 text-[14px] outline-none focus:border-[#E96B16]"
                  />
                </div>

                {/* Action Button */}
                <button
                  disabled={isSubmittingSwap}
                  onClick={handleSubmitSwapOffer}
                  className="w-full bg-[#E96B16] hover:bg-[#d45d0f] text-white font-extrabold text-[15px] py-3.5 rounded-xl shadow-[0_4px_20px_rgba(233,107,22,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  <ArrowRightLeft size={18} />
                  {isSubmittingSwap
                    ? 'Processing Trade...'
                    : cashDifference > 0
                    ? `Pay ₹${cashDifference.toLocaleString('en-IN')} Difference & Submit Proposal`
                    : 'Submit Trade Proposal'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────── Contact Seller Modal ─────────────────── */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#35190F]"
            >
              <X size={20} />
            </button>
            <h3 className="text-[1.25rem] font-bold text-[#35190F] mb-1">
              Contact {listing.seller?.name || 'Seller'}
            </h3>
            <p className="text-[13.5px] text-gray-500 mb-4">
              Inquiring about: <span className="font-semibold text-[#35190F]">{listing.title}</span>
            </p>

            <form onSubmit={handleSendMessage} className="flex flex-col gap-4">
              <textarea
                rows={4}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Hi, is this still available? Can we coordinate a meetup or shipment?"
                className="w-full border border-[#ddd5c8] rounded-xl p-3 text-[14px] text-[#35190F] outline-none focus:border-[#E96B16] focus:ring-1 focus:ring-[#E96B16]"
                required
              />
              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2 text-[14px] font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#E96B16] text-white px-5 py-2 rounded-lg font-bold text-[14px] flex items-center gap-2 hover:bg-[#d45d0f]"
                >
                  <Send size={15} /> Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetailPage;
