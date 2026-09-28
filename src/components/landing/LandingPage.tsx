import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Flame,
  Heart,
  MessageCircle,
  PhoneCall,
  Lock,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  Users,
  Compass,
  Star,
  ChevronRight
} from 'lucide-react';
import { WEST_BENGAL_DISTRICTS } from '../../data/districts';

interface LandingPageProps {
  openRegisterModal: (gender?: 'male' | 'female') => void;
  openLoginModal: () => void;
  openLegalModal: (type: string) => void;
  onExplore: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  openRegisterModal,
  openLoginModal,
  openLegalModal,
  onExplore
}) => {
  const { allProfiles } = useApp();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Kolkata');

  const filteredPreviewProfiles = allProfiles.filter(p => 
    selectedDistrict === 'All' ? true : p.district.toLowerCase().includes(selectedDistrict.toLowerCase())
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-600/20 via-pink-600/15 to-purple-600/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* 18+ Notice and Bengal Identity */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>West Bengal’s Premier Verified Dating Platform</span>
              <span className="text-slate-500">|</span>
              <span className="font-bold text-rose-400">Strictly 18+</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Meet Genuine People from{' '}
              <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                West Bengal
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Discover verified profiles, connect through meaningful matches and start conversations safely.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => openRegisterModal()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-base font-semibold bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white shadow-xl shadow-rose-950/50 hover:shadow-rose-900/60 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
              >
                <span>Join Now (Free)</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={openLoginModal}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-base font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all hover:border-slate-600 shadow-md"
              >
                Login
              </button>

              <button
                onClick={() => openLegalModal('how_it_works')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                How It Works
              </button>
            </div>

            {/* Separate Registration Shortcuts for Male / Female */}
            <div className="pt-3 flex items-center justify-center gap-4 text-xs text-slate-400">
              <span>Register as:</span>
              <button
                onClick={() => openRegisterModal('female')}
                className="px-3 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 transition-colors font-medium"
              >
                👩 Female Registration
              </button>
              <button
                onClick={() => openRegisterModal('male')}
                className="px-3 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors font-medium"
              >
                👨 Male Registration
              </button>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm text-center">
            <div>
              <p className="text-2xl font-bold text-white">50 Free</p>
              <p className="text-xs text-slate-400 mt-0.5">Daily Swipes Every Day</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">100%</p>
              <p className="text-xs text-slate-400 mt-0.5">Real-Time Liveness Verified</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-rose-400">23</p>
              <p className="text-xs text-slate-400 mt-0.5">West Bengal Districts</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">Zero</p>
              <p className="text-xs text-slate-400 mt-0.5">Fake Bots or Pre-recorded Replay</p>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Cards Grid (As per User Prompt) */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Crafted for Sincere, Safe Bengal Connections
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Modern matchmaking designed to honor authenticity, culture and strict digital privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-lg font-semibold text-white">Real-Time Profile Verification</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                No fake pre-recorded videos. Our live camera liveness check assigns random real-time actions (smile, turn head, blink, raise hand) before awarding the Verified badge.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-orange-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-orange-400" />
                <h3 className="text-lg font-semibold text-white">50 Daily Free Swipes</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Enjoy 50 profile interactions every single day without paying a single rupee. Reset automatically based on trusted server time every midnight IST.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400" />
                <h3 className="text-lg font-semibold text-white">Mutual Matching</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Match only when both of you express genuine mutual interest. No unsolicited spam messages or unwanted attention in your inbox.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Free Chat After Match</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Once two members match mutually, chat is 100% free with instant text, emojis, and secure photo sharing. No paywalls to talk to your matches.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-pink-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                <h3 className="text-lg font-semibold text-white">Audio & Video Calling</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                High quality in-app audio and video calls with WebRTC encryption. Talk face-to-face safely without revealing your personal phone numbers.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Secure & Private</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Residential addresses, phone numbers, and raw biometric recordings are never exposed or stored permanently. You control your privacy settings.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* West Bengal District Showcase */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-rose-400 text-xs font-semibold tracking-wide uppercase mb-1">
              <MapPin className="w-4 h-4" />
              <span>West Bengal Regional Matchmaking</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Connect with Verified Singles in Your City
            </h2>
          </div>

          {/* District selector buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {['Kolkata', 'Howrah', 'Siliguri (Sub-division)', 'Darjeeling', 'Paschim Bardhaman'].map((dist) => (
              <button
                key={dist}
                onClick={() => setSelectedDistrict(dist)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedDistrict === dist
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {dist.replace(' (Sub-division)', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Profile preview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPreviewProfiles.map(profile => (
            <div 
              key={profile.id}
              className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 group hover:border-slate-700 transition-all hover:shadow-xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-950">
                <img
                  src={profile.profilePhoto}
                  alt={profile.fullName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Verified Badge */}
                {profile.verificationStatus === 'approved' && (
                  <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </div>
                )}

                {/* District location tag */}
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-slate-200 text-[11px] font-medium px-2 py-0.5 rounded-lg flex items-center gap-1 border border-slate-700">
                  <MapPin className="w-3 h-3 text-rose-400" />
                  <span>{profile.district}</span>
                </div>

                {/* Bottom details */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-lg font-bold">
                    {profile.fullName}, {profile.age}
                  </p>
                  <p className="text-xs text-rose-300 font-medium truncate mt-0.5">
                    {profile.profession}
                  </p>
                  <p className="text-[11px] text-slate-300/90 line-clamp-2 mt-1">
                    "{profile.bio}"
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-900 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {profile.languages.join(' · ')}
                </span>
                <button
                  onClick={() => openRegisterModal(profile.gender === 'male' ? 'female' : 'male')}
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <span>Connect</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Explore All Profiles Banner */}
        <div className="mt-8 text-center">
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-sm font-semibold text-rose-300 border border-slate-800 transition-colors"
          >
            <Compass className="w-4 h-4 text-rose-400" />
            <span>Discover All Verified West Bengal Singles (50 Daily Swipes)</span>
          </button>
        </div>

      </section>

      {/* Sincere Testimonials from Bengal */}
      <section className="py-16 bg-slate-900/30 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-white">Bengal Stories of Real Connection</h2>
            <p className="mt-1 text-xs text-slate-400">Real verified members from Kolkata, Durgapur, and Siliguri.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "What I appreciated most was the real-time video verification. In most dating apps you never know who is behind the screen. Here, every matched profile was genuine. Met Tanmoy over College Street Coffee House adda!"
              </p>
              <div className="pt-2 border-t border-slate-800 text-xs">
                <p className="font-semibold text-white">Srijita & Tanmoy</p>
                <p className="text-slate-400 text-[11px]">South Kolkata · Matched in 2026</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Being in Siliguri, mainstream apps only showed people 600km away in Kolkata. PremKotha's district filters let me find someone right here who loves the Darjeeling hills and tea gardens."
              </p>
              <div className="pt-2 border-t border-slate-800 text-xs">
                <p className="font-semibold text-white">Priyanka & Arjun</p>
                <p className="text-slate-400 text-[11px]">Siliguri · Matched in 2026</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "50 free swipes a day with zero paywalls for mutual messaging is such a breath of fresh air. The video calling feature kept our numbers private until we were comfortable meeting in person."
              </p>
              <div className="pt-2 border-t border-slate-800 text-xs">
                <p className="font-semibold text-white">Aniket & Deblina</p>
                <p className="text-slate-400 text-[11px]">Howrah & Salt Lake · Matched in 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-gradient-to-b from-slate-950 to-purple-950/20 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center mb-5 shadow-xl shadow-rose-950/50">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Ready to Discover Genuine Bengal Singles?
          </h2>
          <p className="mt-2 text-sm text-slate-300 max-w-lg mx-auto">
            Join thousands of verified adults across West Bengal. Free registration, 50 daily swipes, and real-time safety.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openRegisterModal()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-base font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-transform hover:scale-105"
            >
              Create Free Profile (18+)
            </button>
            <button
              onClick={openLoginModal}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800"
            >
              Sign In to Your Account
            </button>
          </div>
          <p className="mt-4 text-[11px] text-slate-500">
            Strictly 18 years and above. Mobile OTP & live verification required.
          </p>
        </div>
      </section>

    </div>
  );
};
