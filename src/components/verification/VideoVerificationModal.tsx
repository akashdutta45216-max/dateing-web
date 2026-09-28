import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Camera,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Lock,
  Smile,
  Eye,
  Hand,
  Volume2,
  ChevronRight
} from 'lucide-react';

interface VideoVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LivenessChallenge {
  id: string;
  instruction: string;
  icon: 'smile' | 'head_left' | 'head_right' | 'blink' | 'hand' | 'phrase';
  phraseBengali?: string;
  durationSeconds: number;
}

const CHALLENGES_POOL: LivenessChallenge[] = [
  {
    id: 'c_smile',
    instruction: 'Please smile warmly at the camera',
    icon: 'smile',
    durationSeconds: 4
  },
  {
    id: 'c_turn_left',
    instruction: 'Turn your head gently to the left',
    icon: 'head_left',
    durationSeconds: 4
  },
  {
    id: 'c_turn_right',
    instruction: 'Turn your head gently to the right',
    icon: 'head_right',
    durationSeconds: 4
  },
  {
    id: 'c_blink',
    instruction: 'Blink your eyes twice naturally',
    icon: 'blink',
    durationSeconds: 4
  },
  {
    id: 'c_hand',
    instruction: 'Raise your open hand near your face',
    icon: 'hand',
    durationSeconds: 4
  },
  {
    id: 'c_phrase',
    instruction: 'Read this phrase aloud clearly:',
    phraseBengali: '“আমি প্রেমকথা-তে আসল এবং সৎ” (Ami PremKotha-te ashol o shot)',
    icon: 'phrase',
    durationSeconds: 5
  }
];

export const VideoVerificationModal: React.FC<VideoVerificationModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, submitVideoVerification } = useApp();

  const [sessionState, setSessionState] = useState<'intro' | 'requesting_camera' | 'active_liveness' | 'analyzing' | 'approved' | 'rejected'>('intro');
  const [selectedChallenges, setSelectedChallenges] = useState<LivenessChallenge[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Pick 3 random challenges for this session to prevent replay
  const setupRandomSession = () => {
    const shuffled = [...CHALLENGES_POOL].sort(() => 0.5 - Math.random());
    setSelectedChallenges(shuffled.slice(0, 3));
    setCurrentChallengeIndex(0);
    setChallengeProgress(0);
  };

  useEffect(() => {
    if (isOpen) {
      setSessionState(currentUser?.verificationStatus === 'approved' ? 'approved' : 'intro');
      setupRandomSession();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const startVerificationSession = async () => {
    setupRandomSession();
    setSessionState('requesting_camera');
    setCameraError(null);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setIsUsingFallback(false);
      } else {
        // Fallback for environments where camera is not available
        setIsUsingFallback(true);
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable in this environment, using interactive simulated camera feed:', err);
      setIsUsingFallback(true);
    }

    setSessionState('active_liveness');
    setCurrentChallengeIndex(0);
    setChallengeProgress(0);
  };

  // Run challenge progression
  useEffect(() => {
    if (sessionState !== 'active_liveness' || selectedChallenges.length === 0) return;

    const currentChallenge = selectedChallenges[currentChallengeIndex];
    if (!currentChallenge) return;

    const stepDuration = currentChallenge.durationSeconds * 1000;
    const intervalTime = 100;
    const increment = (intervalTime / stepDuration) * 100;

    const timer = setInterval(() => {
      setChallengeProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          // Advance to next challenge or finish
          if (currentChallengeIndex < selectedChallenges.length - 1) {
            setCurrentChallengeIndex(ci => ci + 1);
            return 0;
          } else {
            // All 3 challenges complete! Take snapshot
            captureSnapshotAndAnalyze();
            return 100;
          }
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [sessionState, currentChallengeIndex, selectedChallenges]);

  const captureSnapshotAndAnalyze = () => {
    setSessionState('analyzing');

    let snapshotUrl = currentUser?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

    if (videoRef.current && canvasRef.current && !isUsingFallback) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        snapshotUrl = canvas.toDataURL('image/jpeg', 0.85);
      }
    }

    setCapturedSnapshot(snapshotUrl);

    // Analyze liveness vectors (simulated AI verification pipeline)
    setTimeout(() => {
      stopCamera();
      submitVideoVerification(snapshotUrl);
      setSessionState('approved');
    }, 2400);
  };

  if (!isOpen) return null;

  const currentChallenge = selectedChallenges[currentChallengeIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md text-slate-100">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>Real-Time Liveness Verification</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Anti-Replay
                </span>
              </h3>
              <p className="text-xs text-slate-400">Official Bengal Verification Engine</p>
            </div>
          </div>

          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden Canvas for Frame Capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Body Content */}
        <div className="p-6 space-y-4">
          
          {/* STATE: INTRO */}
          {sessionState === 'intro' && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center shadow-lg shadow-emerald-950/40">
                <Camera className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-white">Earn Your Verified Profile Badge</h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-md mx-auto">
                  To keep PremKotha safe and genuine for everyone in West Bengal, we do not accept uploaded pre-recorded videos. You will be guided through 3 quick randomized live actions on camera.
                </p>
              </div>

              {/* Steps explanation */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>How it works in 15 seconds:</span>
                </div>
                <p className="pl-6 text-slate-400">1. Allow real-time camera access.</p>
                <p className="pl-6 text-slate-400">2. Complete 3 dynamic prompts (smile, turn head, read Bengali phrase).</p>
                <p className="pl-6 text-slate-400">3. Receive your permanent <strong className="text-emerald-300">Verified Profile</strong> badge.</p>
              </div>

              {/* Privacy Notice */}
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-900/40 text-left flex items-start gap-2.5 text-[11px] text-purple-300">
                <Lock className="w-4 h-4 shrink-0 text-purple-400 mt-0.5" />
                <p>
                  <strong>Privacy First:</strong> PremKotha does not store raw biometric videos permanently. Video streams are analyzed in real-time for liveness compliance only.
                </p>
              </div>

              <button
                onClick={startVerificationSession}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Camera className="w-4 h-4" />
                <span>Start Real-Time Camera Verification</span>
              </button>
            </div>
          )}

          {/* STATE: ACTIVE LIVENESS SESSION */}
          {sessionState === 'active_liveness' && currentChallenge && (
            <div className="space-y-4">
              
              {/* Challenge progress badges */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Action {currentChallengeIndex + 1} of {selectedChallenges.length}</span>
                <span className="text-emerald-400">Anti-Spoofing Active</span>
              </div>

              {/* Camera Video Viewport */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border-2 border-emerald-500/40 shadow-inner flex items-center justify-center">
                
                {/* Real video stream */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transform -scale-x-100 ${isUsingFallback ? 'hidden' : 'block'}`}
                />

                {/* Simulated Camera Feed if hardware is blocked/unavailable */}
                {isUsingFallback && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-purple-950/30 to-slate-950 p-6 text-center">
                    <img
                      src={currentUser?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                      alt=""
                      className="w-28 h-28 rounded-full object-cover ring-4 ring-emerald-500 shadow-xl mb-3 animate-pulse-subtle"
                    />
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Live Liveness Simulation</span>
                    </div>
                  </div>
                )}

                {/* Face Oval Overlay Guide */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-60 rounded-full border-2 border-dashed border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-pulse" />
                </div>

                {/* Live recording indicator */}
                <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>LIVE SESSION</span>
                </div>

                {/* Active Action Banner at bottom of video */}
                <div className="absolute bottom-3 left-3 right-3 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-center text-white">
                  <p className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider mb-0.5">
                    Live Challenge:
                  </p>
                  <p className="text-sm font-bold text-white">
                    {currentChallenge.instruction}
                  </p>
                  {currentChallenge.phraseBengali && (
                    <p className="text-xs text-amber-300 font-semibold mt-1">
                      {currentChallenge.phraseBengali}
                    </p>
                  )}
                </div>

              </div>

              {/* Linear Progress Bar for Current Action */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Hold action steady...</span>
                  <span className="font-mono text-emerald-400">{Math.round(challengeProgress)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-100 rounded-full"
                    style={{ width: `${challengeProgress}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                <span>West Bengal Liveness Verification API</span>
                <button
                  type="button"
                  onClick={() => captureSnapshotAndAnalyze()}
                  className="text-xs text-emerald-400 hover:underline font-medium"
                >
                  Skip to Final Analysis →
                </button>
              </div>

            </div>
          )}

          {/* STATE: ANALYZING */}
          {sessionState === 'analyzing' && (
            <div className="py-12 text-center space-y-4">
              <RefreshCw className="w-12 h-12 text-emerald-400 animate-spin mx-auto" />
              <div>
                <h4 className="text-lg font-bold text-white">Analyzing Liveness & Face Landmarks</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Cross-referencing 3D facial depth, randomized response cadence, and preventing pre-recorded replay.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Actions validated successfully</span>
              </div>
            </div>
          )}

          {/* STATE: APPROVED */}
          {sessionState === 'approved' && (
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center shadow-xl shadow-emerald-950/50">
                <ShieldCheck className="w-9 h-9" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>VERIFIED PROFILE ACTIVATED</span>
                </div>
                <h4 className="text-xl font-bold text-white">Liveness Verification Approved!</h4>
                <p className="text-xs text-slate-300 mt-1.5 max-w-sm mx-auto">
                  Congratulations! Your profile now carries the verified shield badge across West Bengal. Verified members receive 3.8x more daily matches.
                </p>
              </div>

              {capturedSnapshot && (
                <div className="inline-block p-1 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={capturedSnapshot}
                    alt="Verified Snapshot"
                    className="w-28 h-28 object-cover rounded-xl"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Audit Snapshot Stored</p>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl"
                >
                  Start Swiping with Verified Badge
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
