import React, { useState } from 'react';
import { UserProfile } from '../../types';
import {
  ShieldCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Heart,
  X,
  Star,
  Info,
  ChevronLeft,
  ChevronRight,
  Flame
} from 'lucide-react';

interface SwipeCardProps {
  profile: UserProfile;
  onSwipe: (action: 'like' | 'pass' | 'superlike') => void;
  dailySwipesRemaining: number;
  maxDailySwipes: number;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  onSwipe,
  dailySwipesRemaining,
  maxDailySwipes
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showFullBio, setShowFullBio] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null);

  const allPhotos = [profile.profilePhoto, ...(profile.additionalPhotos || [])];

  const handleAction = (action: 'like' | 'pass' | 'superlike') => {
    setSwipeDirection(action === 'pass' ? 'left' : action === 'like' ? 'right' : 'up');
    setTimeout(() => {
      onSwipe(action);
      setSwipeDirection(null);
      setActivePhotoIndex(0);
      setShowFullBio(false);
    }, 280);
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIndex(prev => (prev + 1) % allPhotos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIndex(prev => (prev - 1 + allPhotos.length) % allPhotos.length);
  };

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-[3/4.4] sm:aspect-[3/4.2] select-none perspective-1000">
      
      {/* Swipeable Card Container */}
      <div
        className={`w-full h-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl relative transition-transform duration-300 ${
          swipeDirection === 'left'
            ? '-translate-x-full rotate-[-12deg] opacity-0'
            : swipeDirection === 'right'
            ? 'translate-x-full rotate-[12deg] opacity-0'
            : swipeDirection === 'up'
            ? '-translate-y-full scale-110 opacity-0'
            : 'translate-x-0 rotate-0 opacity-100'
        }`}
      >
        
        {/* Main Photo Gallery */}
        <div className="relative w-full h-full bg-slate-950">
          <img
            src={allPhotos[activePhotoIndex]}
            alt={profile.fullName}
            className="w-full h-full object-cover"
          />

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/20" />
          
          {/* Top Story-style Photo Bars */}
          {allPhotos.length > 1 && (
            <div className="absolute top-3 left-4 right-4 flex gap-1 z-20">
              {allPhotos.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    i === activePhotoIndex ? 'bg-white shadow' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Left / Right Photo Tap Zones */}
          {allPhotos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-0 top-12 bottom-32 w-1/3 z-10 cursor-pointer focus:outline-none"
                aria-label="Previous photo"
              />
              <button
                onClick={nextPhoto}
                className="absolute right-0 top-12 bottom-32 w-1/3 z-10 cursor-pointer focus:outline-none"
                aria-label="Next photo"
              />
            </>
          )}

          {/* Top Badges */}
          <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
            
            {/* Real-time Verified Badge */}
            {profile.verificationStatus === 'approved' ? (
              <div className="bg-emerald-500/90 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg border border-emerald-400/40">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span>Verified Profile</span>
              </div>
            ) : (
              <div />
            )}

            {/* West Bengal District Tag */}
            <div className="bg-slate-950/80 backdrop-blur-md text-slate-200 text-xs font-medium px-2.5 py-1 rounded-xl flex items-center gap-1.5 border border-slate-700/80 shadow-md">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{profile.city || profile.district}</span>
              {profile.distanceKm && (
                <span className="text-slate-400 text-[10px]">· {profile.distanceKm} km</span>
              )}
            </div>

          </div>

          {/* Swipe Indicator Badges when swiping */}
          {swipeDirection === 'right' && (
            <div className="absolute top-24 left-8 -rotate-12 border-4 border-rose-500 text-rose-500 font-black text-3xl px-4 py-1.5 rounded-2xl bg-rose-950/60 backdrop-blur-sm z-30 tracking-wider">
              LIKE ❤️
            </div>
          )}
          {swipeDirection === 'left' && (
            <div className="absolute top-24 right-8 rotate-12 border-4 border-slate-400 text-slate-300 font-black text-3xl px-4 py-1.5 rounded-2xl bg-slate-950/60 backdrop-blur-sm z-30 tracking-wider">
              PASS ❌
            </div>
          )}
          {swipeDirection === 'up' && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 border-4 border-amber-400 text-amber-400 font-black text-2xl px-4 py-1.5 rounded-2xl bg-amber-950/60 backdrop-blur-sm z-30 tracking-wider">
              SUPER LIKE ⭐
            </div>
          )}

          {/* Bottom Profile Details Overlay */}
          <div className="absolute bottom-20 left-0 right-0 p-5 text-white z-20 pointer-events-auto">
            
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>{profile.fullName}</span>
                  <span className="text-rose-300 font-light text-xl sm:text-2xl">{profile.age}</span>
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-rose-400" />
                    <span>{profile.profession}</span>
                  </span>
                  <span>·</span>
                  <span className="text-slate-400">{profile.height}</span>
                </div>
              </div>

              {/* Toggle full details */}
              <button
                onClick={() => setShowFullBio(!showFullBio)}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title="View full bio & details"
              >
                <Info className="w-5 h-5 text-rose-400" />
              </button>
            </div>

            {/* Bio summary */}
            <p className="mt-2 text-xs sm:text-sm text-slate-200/90 line-clamp-2 leading-relaxed font-normal">
              "{profile.bio}"
            </p>

            {/* Interest badges */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {profile.interests.slice(0, 3).map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-sm text-slate-300 text-[11px] font-medium border border-slate-700/60"
                >
                  {item}
                </span>
              ))}
              {profile.interests.length > 3 && (
                <span className="text-[11px] text-slate-400 self-center">
                  +{profile.interests.length - 3} more
                </span>
              )}
            </div>

          </div>

          {/* Expanded Drawer for Details */}
          {showFullBio && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl p-6 z-30 overflow-y-auto text-slate-200 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-lg font-bold text-white">{profile.fullName}, {profile.age}</h4>
                <button
                  onClick={() => setShowFullBio(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <p className="text-xs uppercase font-semibold text-rose-400 mb-1">About</p>
                <p className="text-xs text-slate-300 leading-relaxed">{profile.bio}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-slate-400 text-[11px]">Location</p>
                  <p className="font-semibold text-white mt-0.5">{profile.city}, {profile.district}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-slate-400 text-[11px]">Education</p>
                  <p className="font-semibold text-white mt-0.5">{profile.education}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-slate-400 text-[11px]">Looking For</p>
                  <p className="font-semibold text-rose-300 mt-0.5 capitalize">{profile.relationshipGoal.replace('_', ' ')}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-slate-400 text-[11px]">Languages</p>
                  <p className="font-semibold text-white mt-0.5">{profile.languages.join(', ')}</p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase font-semibold text-rose-400 mb-2">Interests & Hobbies</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.interests.map((it, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-200 text-xs border border-slate-800">
                      {it}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowFullBio(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Close Profile Details
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Action Buttons Bar at bottom */}
      <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center gap-4 z-20">
        
        {/* Pass Button */}
        <button
          onClick={() => handleAction('pass')}
          disabled={dailySwipesRemaining <= 0}
          className="w-14 h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed group"
          title="Pass / Left Swipe"
        >
          <X className="w-7 h-7 text-slate-400 group-hover:text-rose-400 transition-colors" />
        </button>

        {/* Super Like Button */}
        <button
          onClick={() => handleAction('superlike')}
          disabled={dailySwipesRemaining <= 0}
          className="w-12 h-12 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Super Like / Special Interest"
        >
          <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
        </button>

        {/* Like Button */}
        <button
          onClick={() => handleAction('like')}
          disabled={dailySwipesRemaining <= 0}
          className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white shadow-xl shadow-rose-950/60 flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Like / Right Swipe"
        >
          <Heart className="w-7 h-7 fill-white" />
        </button>

      </div>

    </div>
  );
};
