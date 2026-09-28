import React from 'react';
import { useApp } from '../../context/AppContext';
import { Match } from '../../types';
import {
  Heart,
  MessageCircle,
  Phone,
  Video,
  ShieldCheck,
  Sparkles,
  MapPin,
  Compass
} from 'lucide-react';

interface MatchesViewProps {
  onOpenChat: (match: Match) => void;
  onStartAudioCall: (user: Match['targetUser']) => void;
  onStartVideoCall: (user: Match['targetUser']) => void;
  onExplore: () => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  onOpenChat,
  onStartAudioCall,
  onStartVideoCall,
  onExplore
}) => {
  const { matches, allProfiles } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white">Mutual Matches & Conversations</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
              {matches.length} Connected
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Free unlimited chat & masked audio/video calling with members who liked you back.
          </p>
        </div>

        <button
          onClick={onExplore}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-rose-300 border border-slate-800 flex items-center gap-1.5 transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Discover More Singles (50 Daily Swipes)</span>
        </button>
      </div>

      {/* New Matches Row (Avatars) */}
      {matches.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Recent Mutual Matches
          </h3>
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
            {matches.map(m => (
              <div
                key={m.id}
                onClick={() => onOpenChat(m)}
                className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
              >
                <div className="relative">
                  <img
                    src={m.targetUser.profilePhoto}
                    alt={m.targetUser.fullName}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-rose-500 group-hover:scale-105 transition-transform"
                  />
                  {m.targetUser.verificationStatus === 'approved' && (
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-slate-950">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                  )}
                  {m.targetUser.isOnline && (
                    <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                  )}
                </div>
                <span className="text-xs font-medium text-slate-200 group-hover:text-rose-300 truncate max-w-[70px]">
                  {m.targetUser.fullName.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matches / Conversations List */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Messages & Chats
        </h3>

        {matches.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {matches.map(m => {
              const partner = m.targetUser;
              return (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-4 group"
                >
                  <div
                    onClick={() => onOpenChat(m)}
                    className="flex items-center gap-3.5 flex-1 cursor-pointer overflow-hidden"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={partner.profilePhoto}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700"
                      />
                      {partner.verificationStatus === 'approved' && (
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-1 ring-slate-950">
                          <ShieldCheck className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors truncate">
                          {partner.fullName}
                        </h4>
                        <span className="text-xs text-rose-400/80 font-light">{partner.age}</span>
                        <span className="text-[10px] text-slate-400">· {partner.city.split(' ')[0]}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {m.lastMessage || 'Connected! Start a Bengali adda...'}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Call Trigger Shortcuts */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onStartAudioCall(partner)}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Audio Call"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onStartVideoCall(partner)}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Video Call"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onOpenChat(m)}
                      className="px-3 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mx-auto flex items-center justify-center">
              <Heart className="w-8 h-8 fill-rose-500/20" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No matches yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Start right-swiping on genuine singles across Kolkata and West Bengal districts. When interest is mutual, your match appears right here!
              </p>
            </div>
            <button
              onClick={onExplore}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs font-bold shadow-lg"
            >
              Start Swiping (50 Free Swipes Today)
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
