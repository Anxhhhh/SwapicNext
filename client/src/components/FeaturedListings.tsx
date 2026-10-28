'use client';
import React, { useState, useEffect } from "react";
import { Heart, MapPin, Star, ArrowRight, Loader2 } from "lucide-react";
import api from "../utils/api";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";

type Tag = "Buy" | "Rent" | "Barter" | "Sell";

interface DisplayItem {
  id: string;
  title: string;
  price: string;
  image: string;
  tags: Tag[];
  location: string;
  rating: number;
  saved?: boolean;
}

const TAG_STYLES: Record<Tag, string> = {
  Buy:    "bg-[#E6F4ED] text-[#1A8744]",
  Sell:   "bg-[#E6F4ED] text-[#1A8744]",
  Rent:   "bg-[#E8F0FE] text-[#1D60C9]",
  Barter: "bg-[#FDE8D4] text-[#C05610]",
};

const TagBadge = ({ tag }: { tag: Tag }) => (
  <span className={`text-[0.72rem] font-semibold px-3 py-1 rounded-full transition-colors duration-300 ${TAG_STYLES[tag] || 'bg-gray-100 text-gray-700'} group-hover:bg-white/20 group-hover:text-white`}>
    {tag}
  </span>
);

const ListingCard = ({
  listing,
  onClick,
  onToggleSave,
}: {
  listing: DisplayItem;
  onClick: () => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-[20px] overflow-hidden border border-[#ede8e1] hover:border-[#E96B16] hover:shadow-[0_12px_40px_rgba(233,107,22,0.35)] hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
    >
      <div className="relative overflow-hidden aspect-[4/3] bg-[#FAF7F2]">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&fit=crop";
          }}
        />
        {/* Orange overlay on hover */}
        <div className="absolute inset-0 bg-[#E96B16]/0 group-hover:bg-[#E96B16]/15 transition-all duration-300 pointer-events-none" />
        <button
          type="button"
          onClick={(e) => onToggleSave(listing.id, e)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform z-10"
        >
          <Heart
            size={15}
            strokeWidth={2}
            className={
              listing.saved
                ? "text-[#E96B16] fill-[#E96B16]"
                : "text-gray-400 group-hover:text-[#E96B16] transition-colors"
            }
          />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1 bg-white group-hover:bg-[#E96B16] transition-colors duration-300">
        <div>
          <p className="font-bold text-[0.98rem] text-[#35190F] group-hover:text-white transition-colors duration-300 leading-snug line-clamp-1">
            {listing.title}
          </p>
          <p className="text-[1.05rem] font-extrabold text-[#35190F] group-hover:text-white transition-colors duration-300 mt-0.5">
            {listing.price}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {listing.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>

        <div className="flex items-center justify-between pt-1 mt-auto">
          <div className="flex items-center gap-1 text-[#654332] group-hover:text-white/80 transition-colors duration-300">
            <MapPin size={13} strokeWidth={2} className="shrink-0 text-[#E96B16] group-hover:text-white transition-colors" />
            <span className="text-[0.78rem] font-medium truncate max-w-[120px]">{listing.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={13} strokeWidth={2} className="text-amber-400 fill-amber-400 group-hover:fill-white group-hover:text-white transition-colors duration-300" />
            <span className="text-[0.78rem] font-semibold text-[#35190F] group-hover:text-white transition-colors duration-300">{listing.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedListings = ({
  onItemClick,
  onExploreClick,
}: {
  onItemClick?: (id: string) => void;
  onExploreClick?: () => void;
}) => {
  const [items, setItems] = useState<DisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    let isMounted = true;
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/listings', { params: { limit: '8' } });
        if (isMounted && res.data?.listings?.length) {
          const mapped: DisplayItem[] = res.data.listings.map((l: any) => ({
            id: l._id,
            title: l.title,
            price:
              l.type === 'Barter'
                ? 'Open to Barter'
                : l.type === 'Rent'
                ? `₹${(l.rentPerDay || 0).toLocaleString('en-IN')}/day`
                : `₹${(l.price || 0).toLocaleString('en-IN')}`,
            image: l.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&fit=crop',
            tags: [l.type as Tag],
            location: l.location || 'Bengaluru',
            rating: 4.8,
            saved: user ? l.savedBy?.includes(user._id) : false,
          }));
          setItems(mapped);
        }
      } catch (err) {
        console.warn('Featured listings fallback to curated items');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeatured();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleToggleSave = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('Please log in to save items to your wishlist');
      return;
    }
    try {
      await api.post(`/listings/${id}/save`);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, saved: !item.saved } : item
        )
      );
      toast.success('Wishlist updated');
    } catch {
      toast.error('Could not save item');
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-16 py-12">
      <div className="flex items-end justify-between mb-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-[1.85rem] md:text-[2.25rem] font-extrabold text-[#35190F] leading-tight">
            Featured listings
          </h2>
          <p className="text-[#654332] text-[0.95rem]">
            Live listings from the Swapic community database.
          </p>
        </div>

        <button
          onClick={onExploreClick}
          className="flex items-center gap-1.5 text-[#E96B16] font-bold text-[0.9rem] hover:gap-3 transition-all duration-200 shrink-0"
        >
          View all
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={36} className="animate-spin text-[#E96B16]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onClick={() => onItemClick?.(listing.id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedListings;
