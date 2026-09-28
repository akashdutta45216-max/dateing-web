import React, { useEffect } from 'react';
import { Match } from '../../types';
import { useApp } from '../../context/AppContext';
import { Heart, MessageCircle, PhoneCall, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MatchCelebrationModalProps {
  match: Match | null;
  onClose: () => void;
  onOpenChat: (match: Match) => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  match,
  onClose,
  onOpenChat
}) => {
  const { currentUser } = useApp();

  useEffect(() => {
    if (match) {
      // Fire festive confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24']
      });
    }
  }, [match]);

  if (!match || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-lg text-slate-100 animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-purple-950/40 to-slate-950 border border-rose-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 text-center space-y-6 overflow-hidden">
        
        {/* Glow ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-rose-500/20 blur-3xl rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Headline */}
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>মন মিলল! MUTUAL CONNECTION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            ✨ It's a Match!
          </h2>
          <p className="text-xs text-slate-300">
            You and <span className="text-rose-300 font-semibold">{match.targetUser.fullName}</span> have liked each other.
          </p>
        </div>

        {/* Dual Avatars with Pulsing Heart */}
        <div className="flex items-center justify-center gap-3 relative my-6">
          <div className="relative">
            <img
              src={currentUser.profilePhoto}
              alt={currentUser.fullName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-rose-500 shadow-2xl"
            />
            <span className="absolute bottom-0 right-0 bg-slate-950 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700">
              You
            </span>
          </div>

          {/* Center Pulsing Heart */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-rose-900/50 animate-bounce z-10 -mx-3">
            <Heart className="w-6 h-6 fill-white" />
          </div>

          <div className="relative">
            <img
              src={match.targetUser.profilePhoto}
              alt={match.targetUser.fullName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-pink-500 shadow-2xl"
            />
            <span className="absolute bottom-0 left-0 bg-slate-950 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700">
              {match.targetUser.city.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Free Chat & Call Highlights */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-around">
          <span className="text-emerald-400 font-semibold">✓ Free Unlimited Chat</span>
          <span>·</span>
          <span className="text-rose-400 font-semibold">✓ Secure In-App Calling</span>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => {
              onClose();
              onOpenChat(match);
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold text-sm shadow-xl shadow-rose-950/60 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Send a Free Message Now</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
          >
            Keep Swiping (50 Daily Free Swipes)
          </button>
        </div>

      </div>
    </div>
  );
};
