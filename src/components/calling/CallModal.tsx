import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  ShieldAlert,
  ShieldCheck,
  UserX,
  Sparkles,
  Lock,
  Volume2
} from 'lucide-react';

interface CallModalProps {
  onOpenMembership: () => void;
  onReportUser: (userId: string) => void;
}

export const CallModal: React.FC<CallModalProps> = ({ onOpenMembership, onReportUser }) => {
  const { activeCall, endCall, activeSubscription, freeCallUsedForUser } = useApp();

  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Setup camera for video call
  useEffect(() => {
    if (!activeCall) return;

    // Check if free allowance already used and no active subscription
    const alreadyUsed = freeCallUsedForUser(activeCall.targetUser.id);
    if (alreadyUsed && !activeSubscription) {
      setShowSubscriptionPrompt(true);
      return;
    }

    let isSubscribed = true;
    if (activeCall.type === 'video') {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (!isSubscribed) return;
          streamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.warn('Camera preview not available in this frame, proceeding with simulated audio/video connection:', err);
        });
    }

    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      isSubscribed = false;
      clearInterval(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [activeCall]);

  if (!activeCall) return null;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const partner = activeCall.targetUser;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md text-slate-100">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
        
        {/* Call Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-semibold text-slate-300">
              {activeCall.type === 'video' ? 'Secure Video Call' : 'Encrypted Audio Call'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400">
            <span>{formatSeconds(callDuration)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Number Masked</span>
          </div>
        </div>

        {/* Main Call Viewport */}
        {showSubscriptionPrompt ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Continue Calling with a Membership Plan</h3>
              <p className="text-xs text-slate-300 mt-1.5 max-w-sm leading-relaxed">
                Your free introductory call allowance for this match has been used. Subscribe to any PremKotha plan starting at just ₹99 to enjoy extended calls and unlimited swipes!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full max-w-xs">
              <button
                onClick={() => {
                  endCall();
                  onOpenMembership();
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 text-white font-bold text-xs shadow-lg"
              >
                View Plans (From ₹99)
              </button>
              <button
                onClick={endCall}
                className="w-full py-3 rounded-2xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                End Call
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 relative bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden">
            
            {/* If video call, render partner background photo + local webcam pip */}
            {activeCall.type === 'video' ? (
              <div className="absolute inset-0">
                <img
                  src={partner.profilePhoto}
                  alt=""
                  className="w-full h-full object-cover filter blur-[2px] opacity-60"
                />
                <div className="absolute inset-0 bg-slate-950/40" />

                {/* Local user small PiP box */}
                <div className="absolute top-4 right-4 w-28 h-36 bg-slate-900 border-2 border-rose-500/60 rounded-2xl overflow-hidden shadow-2xl z-20">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover transform -scale-x-100 ${isVideoDisabled ? 'hidden' : 'block'}`}
                  />
                  {isVideoDisabled && (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                      Camera Off
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 bg-slate-950/80 px-1.5 py-0.5 rounded text-[9px] text-white">
                    You
                  </div>
                </div>
              </div>
            ) : null}

            {/* Partner Center Avatar & Info */}
            <div className="relative z-10 text-center space-y-3">
              <div className="relative inline-block">
                <img
                  src={partner.profilePhoto}
                  alt={partner.fullName}
                  className="w-28 h-28 rounded-full object-cover ring-4 ring-rose-500 shadow-2xl animate-pulse-subtle mx-auto"
                />
                {partner.verificationStatus === 'approved' && (
                  <div className="absolute bottom-0 right-0 bg-emerald-500 p-1.5 rounded-full text-white shadow-md">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xl font-bold text-white">{partner.fullName}</h4>
                <p className="text-xs text-rose-300 font-medium">{partner.city}, {partner.district}</p>
                <p className="text-[11px] text-slate-400 mt-1">Connecting via PremKotha P2P Audio/Video</p>
              </div>
            </div>

          </div>
        )}

        {/* Call Controls Footer */}
        {!showSubscriptionPrompt && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-around z-20">
            
            {/* Mute Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3.5 rounded-2xl transition-all ${
                isMuted
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
              title={isMuted ? 'Unmute' : 'Mute microphone'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Video Toggle (if video call) */}
            {activeCall.type === 'video' && (
              <button
                onClick={() => setIsVideoDisabled(!isVideoDisabled)}
                className={`p-3.5 rounded-2xl transition-all ${
                  isVideoDisabled
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
                title={isVideoDisabled ? 'Turn Camera On' : 'Turn Camera Off'}
              >
                {isVideoDisabled ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>
            )}

            {/* Hangup / End Call */}
            <button
              onClick={endCall}
              className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <PhoneOff className="w-5 h-5" />
              <span>End Call</span>
            </button>

            {/* Safety Report in Call */}
            <button
              onClick={() => onReportUser(partner.id)}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
              title="Report abuse or inappropriate behavior"
            >
              <ShieldAlert className="w-5 h-5" />
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
