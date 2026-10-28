'use client';
import React, { useState } from 'react';
import {
  X, Upload, Package, Tag, DollarSign, MapPin,
  FileText, ChevronDown, ArrowLeft, CheckCircle
} from 'lucide-react';
import { useListingStore } from '../store/listingStore';
import { toast } from 'react-toastify';

const CATEGORIES = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Sports', 'Toys', 'Home & Living', 'Other'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Used'];

interface Props {
  onBack: () => void;
  onSuccess?: () => void;
}

const SelectField = ({ label, value, onChange, options }: any) => (
  <div>
    <label className="block text-[13px] font-semibold text-[#35190F] mb-1.5">{label} <span className="text-red-400">*</span></label>
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none border border-[#ddd5c8] rounded-xl px-4 py-3 text-[14px] text-[#35190F] bg-white outline-none focus:border-[#E96B16] focus:ring-1 focus:ring-[#E96B16]/30 cursor-pointer"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

const InputField = ({ label, value, onChange, type = 'text', placeholder, required = true }: any) => (
  <div>
    <label className="block text-[13px] font-semibold text-[#35190F] mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-[#ddd5c8] rounded-xl px-4 py-3 text-[14px] text-[#35190F] outline-none focus:border-[#E96B16] focus:ring-1 focus:ring-[#E96B16]/30 placeholder:text-gray-400"
    />
  </div>
);

const CreateListingPage = ({ onBack, onSuccess }: Props) => {
  const { createListing } = useListingStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<{
    title: string;
    description: string;
    type: 'Sell' | 'Rent' | 'Barter';
    category: string;
    condition: string;
    price: string;
    rentPerDay: string;
    location: string;
    images: string[];
  }>({
    title: '',
    description: '',
    type: 'Sell',
    category: '',
    condition: '',
    price: '',
    rentPerDay: '',
    location: 'Bengaluru',
    images: [],
  });

  const [imageUrls, setImageUrls] = useState(['']);

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleImageUrlChange = (i: number, val: string) => {
    const updated = [...imageUrls];
    updated[i] = val;
    setImageUrls(updated);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.category || !form.condition) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const validImages = imageUrls.filter(u => u.trim() !== '');
      await createListing({
        ...form,
        price: Number(form.price) || 0,
        rentPerDay: Number(form.rentPerDay) || 0,
        images: validImages,
      } as any);
      setSuccess(true);
      toast.success('Listing created successfully!');
      setTimeout(() => { onSuccess?.(); }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="bg-emerald-50 p-6 rounded-full">
          <CheckCircle size={56} className="text-emerald-500" />
        </div>
        <h2 className="text-[1.6rem] font-extrabold text-[#35190F]">Listing Created!</h2>
        <p className="text-gray-500">Your item is now live on the marketplace.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[780px] mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-[#f4f0ec] transition-colors">
          <ArrowLeft size={20} className="text-[#35190F]" />
        </button>
        <div>
          <h1 className="text-[1.8rem] font-extrabold text-[#35190F]">Create Listing</h1>
          <p className="text-[14px] text-gray-500 mt-0.5">Share your item with the community</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-[#ede8e1] p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-[15px] font-bold text-[#35190F] mb-5">
            <FileText size={17} className="text-[#E96B16]" /> Basic Information
          </h3>
          <div className="space-y-4">
            <InputField label="Title" value={form.title} onChange={(v: string) => set('title', v)} placeholder="e.g., Sony WH-1000XM5 Headphones" />
            <div>
              <label className="block text-[13px] font-semibold text-[#35190F] mb-1.5">Description <span className="text-red-400">*</span></label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Describe your item — condition details, why you're selling, what's included..."
                rows={4}
                className="w-full border border-[#ddd5c8] rounded-xl px-4 py-3 text-[14px] text-[#35190F] outline-none focus:border-[#E96B16] focus:ring-1 focus:ring-[#E96B16]/30 placeholder:text-gray-400 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Transaction Type */}
        <div className="bg-white rounded-2xl border border-[#ede8e1] p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-[15px] font-bold text-[#35190F] mb-5">
            <Tag size={17} className="text-[#E96B16]" /> Transaction Type
          </h3>
          <div className="flex gap-3 flex-wrap">
            {(['Sell', 'Rent', 'Barter'] as const).map(t => (
              <button
                key={t}
                onClick={() => set('type', t)}
                className={`px-6 py-2.5 rounded-full text-[14px] font-semibold border-2 transition-all ${
                  form.type === t
                    ? 'bg-[#E96B16] text-white border-[#E96B16] shadow-md'
                    : 'bg-white text-[#654332] border-[#ddd5c8] hover:border-[#E96B16]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl border border-[#ede8e1] p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-[15px] font-bold text-[#35190F] mb-5">
            <Package size={17} className="text-[#E96B16]" /> Item Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Category" value={form.category} onChange={(v: string) => set('category', v)} options={CATEGORIES} />
            <SelectField label="Condition" value={form.condition} onChange={(v: string) => set('condition', v)} options={CONDITIONS} />
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-[#ede8e1] p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-[15px] font-bold text-[#35190F] mb-5">
            <DollarSign size={17} className="text-[#E96B16]" /> Pricing
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {form.type !== 'Barter' && (
              <InputField
                label={form.type === 'Rent' ? 'Rent per day (₹)' : 'Selling Price (₹)'}
                type="number"
                value={form.type === 'Rent' ? form.rentPerDay : form.price}
                onChange={(v: string) => set(form.type === 'Rent' ? 'rentPerDay' : 'price', v)}
                placeholder="0"
                required={true}
              />
            )}
            {form.type === 'Barter' && (
              <div className="col-span-2 text-[14px] text-emerald-600 font-medium bg-emerald-50 rounded-xl p-4">
                ✓ Barter listings are free — you'll negotiate the exchange directly with interested users.
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl border border-[#ede8e1] p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-[15px] font-bold text-[#35190F] mb-5">
            <MapPin size={17} className="text-[#E96B16]" /> Location
          </h3>
          <InputField label="Location / Area" value={form.location} onChange={(v: string) => set('location', v)} placeholder="e.g., Koramangala, Bengaluru" required={false} />
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl border border-[#ede8e1] p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-[15px] font-bold text-[#35190F] mb-2">
            <Upload size={17} className="text-[#E96B16]" /> Images
          </h3>
          <p className="text-[13px] text-gray-500 mb-4">Add image URLs (from Unsplash, Imgur, etc.)</p>
          <div className="space-y-3">
            {imageUrls.map((url, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={e => handleImageUrlChange(i, e.target.value)}
                  placeholder={`Image URL ${i + 1}`}
                  className="flex-1 border border-[#ddd5c8] rounded-xl px-4 py-2.5 text-[14px] text-[#35190F] outline-none focus:border-[#E96B16] focus:ring-1 focus:ring-[#E96B16]/30 placeholder:text-gray-400"
                />
                {url && (
                  <button onClick={() => { const n = [...imageUrls]; n[i] = ''; setImageUrls(n); }} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            {imageUrls.length < 5 && (
              <button onClick={() => setImageUrls([...imageUrls, ''])} className="text-[13px] text-[#E96B16] font-semibold hover:underline">
                + Add another image
              </button>
            )}
          </div>

          {/* Preview */}
          {imageUrls.some(u => u.trim()) && (
            <div className="flex gap-3 flex-wrap mt-4">
              {imageUrls.filter(u => u.trim()).map((url, i) => (
                <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border border-[#ede8e1]">
                  <img src={url} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#E96B16] text-white font-bold text-[15px] py-4 rounded-2xl hover:bg-[#d45d0f] hover:shadow-[0_8px_30px_rgba(233,107,22,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Listing...' : 'Publish Listing →'}
        </button>
      </div>
    </div>
  );
};

export default CreateListingPage;

