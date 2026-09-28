import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SwipeCard } from './SwipeCard';
import { WEST_BENGAL_DISTRICTS } from '../../data/districts';
import {
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  MapPin,
  Lock,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';

interface DiscoverViewProps {
  onOpenMembership: () => void;
  onOpenVerification: () => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  onOpenMembership,
  onOpenVerification
}) => {
  const {
    currentUser,
    allProfiles,
    dailySwipesRemaining,
    maxDailySwipes,
    serverResetTime,
    swipeUser
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Filters State
  const [filterGender, setFilterGender] = useState<string>(currentUser?.interestedIn || 'all');
  const [filterDistrict, setFilterDistrict] = useState<string>('All');
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState<boolean>(false);
  const [filterMaxAge, setFilterMaxAge] = useState<number>(35);
  const [filterMinAge, setFilterMinAge] = useState<number>(18);
  const [filterGoal, setFilterGoal] = useState<string>('all');

  // Filter available profiles
  const filteredProfiles = allProfiles.filter(profile => {
    // Exclude current logged in user
    if (currentUser && profile.id === currentUser.id) return false;
    
    // Gender filter
    if (filterGender !== 'all') {
      if (filterGender === 'female' && profile.gender !== 'female') return false;
      if (filterGender === 'male' && profile.gender !== 'male') return false;
    }

    // District filter
    if (filterDistrict !== 'All' && !profile.district.toLowerCase().includes(filterDistrict.toLowerCase())) {
      return false;
    }

    // Verified filter
    if (filterVerifiedOnly && profile.verificationStatus !== 'approved') {
      return false;
    }

    // Age filter (18+ constraint)
    if (profile.age < filterMinAge || profile.age > filterMaxAge) {
      return false;
    }

    // Relationship goal
    if (filterGoal !== 'all' && profile.relationshipGoal !== filterGoal) {
      return false;
    }

    return true;
  });

  const currentProfile = filteredProfiles[currentIndex];

  const handleSwipeAction = (action: 'like' | 'pass' | 'superlike') => {
    if (!currentProfile) return;
    swipeUser(currentProfile.id, action);
    setCurrentIndex(prev => prev + 1);
  };

  const handleResetFilters = () => {
    setFilterGender('all');
    setFilterDistrict('All');
    setFilterVerifiedOnly(false);
    setFilterMinAge(18);
    setFilterMaxAge(40);
    setFilterGoal('all');
    setCurrentIndex(0);
    setFilterModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      
      {/* Top Controls & Daily Swipes Meter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8">
        
        {/* Swipe Allowance Display */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 flex items-center justify-center">
            <Flame className="w-5 h-5 fill-orange-500 animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-white">
                {dailySwipesRemaining} / {maxDailySwipes}
              </span>
              <span className="text-xs text-slate-400 font-medium">Daily Swipes Left</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Server reset in: <span className="text-slate-300 font-mono font-medium">{serverResetTime}</span>
            </p>
          </div>
        </div>

        {/* Filter Trigger Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-all shadow-md"
          >
            <SlidersHorizontal className="w-4 h-4 text-rose-400" />
            <span>Filters</span>
            {filterDistrict !== 'All' && (
              <span className="px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px]">
                {filterDistrict}
              </span>
            )}
          </button>

          {currentUser?.verificationStatus !== 'approved' && (
            <button
              onClick={onOpenVerification}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Verify Me</span>
            </button>
          )}
        </div>

      </div>

      {/* Out of Swipes Prompt */}
      {dailySwipesRemaining <= 0 && (
        <div className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-purple-950/60 to-rose-950/60 border border-rose-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Daily 50 Free Swipes Exhausted</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Your free swipes reset at midnight IST, or upgrade to a Membership plan starting at ₹99 for unlimited swipes!
              </p>
            </div>
          </div>
          <button
            onClick={onOpenMembership}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg whitespace-nowrap"
          >
            Upgrade Plan (From ₹99)
          </button>
        </div>
      )}

      {/* Main Swipe Stage */}
      <div className="relative min-h-[560px] flex items-center justify-center pb-20">
        {currentProfile ? (
          <SwipeCard
            key={currentProfile.id}
            profile={currentProfile}
            onSwipe={handleSwipeAction}
            dailySwipesRemaining={dailySwipesRemaining}
            maxDailySwipes={maxDailySwipes}
          />
        ) : (
          <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mx-auto flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-rose-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">You've explored all current profiles!</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                Try widening your West Bengal district filters or checking back as new singles complete live video verification daily.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => { setCurrentIndex(0); }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Review Profiles Again</span>
              </button>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FILTER MODAL */}
      {filterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 space-y-4 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-rose-400" />
                <span>Discovery Preferences</span>
              </h3>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Looking to meet</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'female', label: 'Women' },
                  { id: 'male', label: 'Men' },
                  { id: 'all', label: 'Everyone' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFilterGender(opt.id)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      filterGender === opt.id
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* District Filter */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                West Bengal District
              </label>
              <select
                value={filterDistrict}
                onChange={e => setFilterDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="All">All West Bengal Districts</option>
                {WEST_BENGAL_DISTRICTS.map(d => (
                  <option key={d.district} value={d.district}>{d.district}</option>
                ))}
              </select>
            </div>

            {/* Age Range Filter */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Age Range (18+ strictly enforced)</span>
                <span className="font-semibold text-rose-400">{filterMinAge} – {filterMaxAge} yrs</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="18"
                  max="50"
                  value={filterMaxAge}
                  onChange={e => setFilterMaxAge(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-500"
                />
              </div>
            </div>

            {/* Verified Profiles Only Toggle */}
            <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs font-semibold text-white">Verified Profiles Only</p>
                  <p className="text-[11px] text-slate-400">Show only members with live camera verification</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={filterVerifiedOnly}
                onChange={e => setFilterVerifiedOnly(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => { setCurrentIndex(0); setFilterModalOpen(false); }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
