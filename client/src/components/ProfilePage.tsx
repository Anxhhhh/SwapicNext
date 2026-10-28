'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Repeat, User, MapPin, Star, Settings, Package, 
  Heart, Clock, LogOut, Shield, Bell, CreditCard, ChevronRight, Plus, Loader2,
  ArrowRightLeft, Check, X, Coins
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import { toast } from 'react-toastify';

interface Props {
  onHomeClick?: () => void;
  onCreateListing?: () => void;
  onItemClick?: (id: string) => void;
}

const ProfilePage = ({ onHomeClick, onCreateListing, onItemClick }: Props) => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('trades');
  const [tradeSubTab, setTradeSubTab] = useState<'incoming' | 'outgoing'>('incoming');

  const [myListings, setMyListings] = useState<any[]>([]);
  const [savedListings, setSavedListings] = useState<any[]>([]);
  const [incomingTrades, setIncomingTrades] = useState<any[]>([]);
  const [outgoingTrades, setOutgoingTrades] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  const fetchTabData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'listings') {
        const r = await api.get('/listings/my');
        setMyListings(r.data || []);
      } else if (activeTab === 'saved') {
        const r = await api.get('/listings/saved');
        setSavedListings(r.data || []);
      } else if (activeTab === 'trades') {
        const [inc, out] = await Promise.all([
          api.get('/trades/incoming').catch(() => ({ data: [] })),
          api.get('/trades/outgoing').catch(() => ({ data: [] })),
        ]);
        setIncomingTrades(inc.data || []);
        setOutgoingTrades(out.data || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    let ignore = false;
    void Promise.resolve().then(() => {
      if (!ignore) {
        fetchTabData();
      }
    });
    return () => {
      ignore = true;
    };
  }, [fetchTabData]);

  const handleRespondTrade = async (tradeId: string, action: 'accept' | 'decline') => {
    setRespondingId(tradeId);
    try {
      await api.patch(`/trades/${tradeId}/respond`, { action });
      toast.success(action === 'accept' ? '🎉 Trade proposal accepted!' : 'Trade proposal declined.');
      fetchTabData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update trade proposal');
    } finally {
      setRespondingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    if (onHomeClick) onHomeClick();
  };

  const tabs = [
    { id: 'trades', label: 'Trade & Swap Offers', icon: <ArrowRightLeft size={16} />, badge: incomingTrades.filter(t => t.status === 'pending').length },
    { id: 'listings', label: 'My Listings', icon: <Package size={16} /> },
    { id: 'saved', label: 'Saved Items', icon: <Heart size={16} /> },
    { id: 'settings', label: 'Account Settings', icon: <Settings size={16} /> },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex-1 max-w-[1240px] mx-auto w-full px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Sidebar: User Info & Navigation */}
          <div className="w-full md:w-[320px] shrink-0">
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl border border-[#ede8e1] p-6 mb-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#E96B16]/20 to-[#f9d7c0] z-0" />
              
              <div className="relative z-10 flex flex-col items-center mt-6">
                <div className="w-24 h-24 bg-white rounded-full p-1.5 shadow-md mb-4 relative group cursor-pointer">
                  <div className="w-full h-full bg-[#f4f0ec] rounded-full flex items-center justify-center overflow-hidden border-2 border-[#E96B16]/20">
                    <User size={40} className="text-[#E96B16]" />
                  </div>
                </div>
                
                <h2 className="text-[1.3rem] font-extrabold text-[#35190F] mb-1">{user?.name || 'Swapic Member'}</h2>
                <p className="text-[14px] text-gray-500 mb-4">{user?.email || 'member@swapic.app'}</p>
                
                <div className="flex items-center gap-4 text-[13px] font-medium text-[#654332] bg-[#f9f7f4] px-4 py-2 rounded-full w-full justify-center border border-[#ede8e1]">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span>4.9 (16 trades)</span>
                  </div>
                  <div className="w-[1px] h-3 bg-gray-300" />
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-[#E96B16]" />
                    <span>Bengaluru</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white rounded-2xl border border-[#ede8e1] overflow-hidden shadow-sm">
              <div className="flex flex-col">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-between px-5 py-4 text-[14.5px] font-semibold transition-colors duration-200 border-b border-[#ede8e1] last:border-b-0 cursor-pointer ${
                      activeTab === tab.id 
                        ? 'bg-[#E96B16]/5 text-[#E96B16] border-l-4 border-l-[#E96B16]' 
                        : 'text-[#654332] hover:bg-[#FAF7F2] hover:text-[#35190F] border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={activeTab === tab.id ? 'text-[#E96B16]' : 'text-gray-400'}>
                        {tab.icon}
                      </div>
                      {tab.label}
                    </div>
                    <div className="flex items-center gap-2">
                      {Boolean(tab.badge && tab.badge > 0) && (
                        <span className="bg-[#E96B16] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {tab.badge}
                        </span>
                      )}
                      <ChevronRight size={16} className={activeTab === tab.id ? 'text-[#E96B16]' : 'text-gray-300'} />
                    </div>
                  </button>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-5 py-4 text-[14.5px] font-semibold text-red-500 hover:bg-red-50 transition-colors duration-200 border-l-4 border-l-transparent mt-2 cursor-pointer"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1">
            
            {/* ── Tab: Trade & Swap Offers ── */}
            {activeTab === 'trades' && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div>
                    <h3 className="text-[1.5rem] font-extrabold text-[#35190F]">Item Swaps & Top-Up Offers</h3>
                    <p className="text-[14px] text-gray-500">Review barter proposals and point difference settlements.</p>
                  </div>

                  <div className="flex bg-[#FAF7F2] border border-[#ede8e1] p-1 rounded-xl">
                    <button
                      onClick={() => setTradeSubTab('incoming')}
                      className={`px-4 py-2 text-[13px] font-bold rounded-lg transition-all ${
                        tradeSubTab === 'incoming'
                          ? 'bg-white text-[#35190F] shadow-sm'
                          : 'text-gray-500 hover:text-[#35190F]'
                      }`}
                    >
                      Received ({incomingTrades.length})
                    </button>
                    <button
                      onClick={() => setTradeSubTab('outgoing')}
                      className={`px-4 py-2 text-[13px] font-bold rounded-lg transition-all ${
                        tradeSubTab === 'outgoing'
                          ? 'bg-white text-[#35190F] shadow-sm'
                          : 'text-gray-500 hover:text-[#35190F]'
                      }`}
                    >
                      Sent ({outgoingTrades.length})
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin text-[#E96B16]" /></div>
                ) : tradeSubTab === 'incoming' ? (
                  incomingTrades.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-[#ede8e1] p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[300px]">
                      <ArrowRightLeft size={40} className="text-[#d4c6bc] mb-3" />
                      <h4 className="text-[1.1rem] font-bold text-[#35190F] mb-1">No Trade Offers Received</h4>
                      <p className="text-[14px] text-gray-500 max-w-[320px]">
                        When someone proposes to swap one of their items for your listings, the proposal will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {incomingTrades.map((t: any) => (
                        <div key={t._id} className="bg-white rounded-2xl border border-[#ede8e1] p-5 shadow-sm flex flex-col gap-4">
                          <div className="flex items-center justify-between border-b border-[#ede8e1] pb-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#E96B16]/10 text-[#E96B16] font-bold flex items-center justify-center text-[12px]">
                                {t.sender?.name?.[0]?.toUpperCase() || 'U'}
                              </div>
                              <div>
                                <span className="font-bold text-[14px] text-[#35190F]">{t.sender?.name || 'Community Member'}</span>
                                <span className="text-[12px] text-gray-400 ml-2">proposed a trade</span>
                              </div>
                            </div>
                            <span className={`text-[12px] font-bold px-3 py-1 rounded-full ${
                              t.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                              t.status === 'declined' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {t.status.toUpperCase()}
                            </span>
                          </div>

                          {/* Visual Trade Comparison */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF7F2] p-4 rounded-xl">
                            {/* Offered item */}
                            <div className="bg-white p-3 rounded-xl border border-[#ede8e1] flex gap-3 items-center">
                              <img
                                src={t.offeredListing?.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&fit=crop'}
                                alt=""
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div>
                                <span className="text-[11px] font-bold text-gray-400 uppercase">THEY OFFER</span>
                                <p className="font-bold text-[13.5px] text-[#35190F] line-clamp-1">{t.offeredListing?.title || 'Offered Item'}</p>
                                <span className="text-emerald-600 font-extrabold text-[13px]">🪙 {t.offeredPoints} pts</span>
                              </div>
                            </div>

                            {/* Target item */}
                            <div className="bg-white p-3 rounded-xl border border-[#ede8e1] flex gap-3 items-center">
                              <img
                                src={t.targetListing?.images?.[0] || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&fit=crop'}
                                alt=""
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div>
                                <span className="text-[11px] font-bold text-gray-400 uppercase">FOR YOUR ITEM</span>
                                <p className="font-bold text-[13.5px] text-[#35190F] line-clamp-1">{t.targetListing?.title || 'Your Item'}</p>
                                <span className="text-[#E96B16] font-extrabold text-[13px]">🪙 {t.targetPoints} pts</span>
                              </div>
                            </div>
                          </div>

                          {/* Cash difference badge & note */}
                          <div className="flex items-center justify-between text-[13.5px] flex-wrap gap-2">
                            <div>
                              {t.cashDifference > 0 ? (
                                <span className="font-bold text-[#E96B16] bg-[#E96B16]/10 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                                  💵 Cash Difference Top-Up: ₹{t.cashDifference.toLocaleString('en-IN')} ({t.cashStatus})
                                </span>
                              ) : (
                                <span className="font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
                                  ⚖️ Even Value Barter Swap (0 cash difference)
                                </span>
                              )}
                              {t.note && <p className="text-[13px] text-gray-500 mt-1 italic">"{t.note}"</p>}
                            </div>

                            {/* Accept / Decline actions */}
                            {t.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  disabled={respondingId === t._id}
                                  onClick={() => handleRespondTrade(t._id, 'accept')}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13px] px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                  <Check size={16} /> Accept Swap
                                </button>
                                <button
                                  disabled={respondingId === t._id}
                                  onClick={() => handleRespondTrade(t._id, 'decline')}
                                  className="bg-white border border-[#ddd5c8] hover:bg-red-50 hover:text-red-600 text-gray-600 font-bold text-[13px] px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                  <X size={16} /> Decline
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  outgoingTrades.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-[#ede8e1] p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[300px]">
                      <ArrowRightLeft size={40} className="text-[#d4c6bc] mb-3" />
                      <h4 className="text-[1.1rem] font-bold text-[#35190F] mb-1">No Outgoing Trade Proposals</h4>
                      <p className="text-[14px] text-gray-500 max-w-[320px]">
                        You haven't proposed any trades yet. Browse marketplace items and use "Swap + Pay Difference"!
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {outgoingTrades.map((t: any) => (
                        <div key={t._id} className="bg-white rounded-2xl border border-[#ede8e1] p-5 shadow-sm flex flex-col gap-3">
                          <div className="flex items-center justify-between border-b border-[#ede8e1] pb-3">
                            <span className="text-[13px] text-gray-500">
                              Proposed to <span className="font-bold text-[#35190F]">{t.receiver?.name || 'Seller'}</span>
                            </span>
                            <span className={`text-[12px] font-bold px-3 py-1 rounded-full ${
                              t.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                              t.status === 'declined' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {t.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[14px]">
                            <div>
                              <p className="font-bold text-[#35190F]">Your {t.offeredListing?.title} (🪙 {t.offeredPoints} pts)</p>
                              <p className="text-[13px] text-gray-500">For their {t.targetListing?.title} (🪙 {t.targetPoints} pts)</p>
                            </div>
                            {t.cashDifference > 0 && (
                              <span className="font-extrabold text-[#E96B16]">
                                Top-up: ₹{t.cashDifference.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            )}

            {/* ── Tab: My Listings ── */}
            {activeTab === 'listings' && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[1.5rem] font-extrabold text-[#35190F]">My Listings</h3>
                  <button
                    onClick={onCreateListing}
                    className="flex items-center gap-1.5 bg-[#E96B16] text-white px-4 py-2 rounded-full text-[13.5px] font-semibold hover:bg-[#d45d0f] transition-all shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <Plus size={15} /> Create Listing
                  </button>
                </div>
                
                {loading ? (
                  <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin text-[#E96B16]" /></div>
                ) : myListings.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#ede8e1] p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[300px]">
                    <Package size={40} className="text-[#d4c6bc] mb-4" />
                    <h4 className="text-[1.1rem] font-bold text-[#35190F] mb-2">No active listings yet</h4>
                    <button onClick={onCreateListing} className="bg-[#E96B16] text-white px-5 py-2 rounded-full text-[13.5px] font-semibold hover:bg-[#d45d0f] transition-all cursor-pointer">
                      + Create Your First Listing
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myListings.map((l: any) => (
                      <div key={l._id} onClick={() => onItemClick?.(l._id)}
                        className="bg-white rounded-2xl border border-[#ede8e1] overflow-hidden group hover:shadow-[0_8px_30px_rgba(233,107,22,0.3)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                      >
                        <div className="h-[160px] overflow-hidden bg-[#f4f0ec]">
                          <img src={l.images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&fit=crop'} alt={l.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&fit=crop'; }} />
                        </div>
                        <div className="p-3.5">
                          <p className="font-bold text-[14px] text-[#35190F] line-clamp-1 mb-1">{l.title}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-[13px] text-gray-500">{l.type}</span>
                            <span className="font-bold text-[#E96B16] text-[13.5px]">🪙 {l.price} pts</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Tab: Saved Items ── */}
            {activeTab === 'saved' && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
                <h3 className="text-[1.5rem] font-extrabold text-[#35190F] mb-6">Saved Wishlist</h3>
                {loading ? (
                  <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin text-[#E96B16]" /></div>
                ) : savedListings.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#ede8e1] p-12 text-center shadow-sm">
                    <Heart size={40} className="text-[#d4c6bc] mx-auto mb-3" />
                    <h4 className="text-[1.1rem] font-bold text-[#35190F] mb-1">Your wishlist is empty</h4>
                    <p className="text-[14px] text-gray-500">Explore listings and click the heart icon to save items.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedListings.map((l: any) => (
                      <div key={l._id} onClick={() => onItemClick?.(l._id)}
                        className="bg-white rounded-2xl border border-[#ede8e1] overflow-hidden group hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div className="h-[160px] overflow-hidden bg-[#f4f0ec]">
                          <img src={l.images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&fit=crop'} alt={l.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="p-3.5">
                          <p className="font-bold text-[14px] text-[#35190F] line-clamp-1 mb-1">{l.title}</p>
                          <span className="font-bold text-[#E96B16] text-[13.5px]">🪙 {l.price} pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Tab: Settings ── */}
            {activeTab === 'settings' && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
                <h3 className="text-[1.5rem] font-extrabold text-[#35190F] mb-6">Account Settings</h3>
                <div className="bg-white rounded-2xl border border-[#ede8e1] p-6 shadow-sm space-y-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-500 mb-1.5">Full Name</label>
                    <input type="text" defaultValue={user?.name || ''} className="w-full border border-[#ddd5c8] rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-[#E96B16]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-500 mb-1.5">Email Address</label>
                    <input type="email" defaultValue={user?.email || ''} className="w-full border border-[#ddd5c8] rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-[#E96B16]" />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
