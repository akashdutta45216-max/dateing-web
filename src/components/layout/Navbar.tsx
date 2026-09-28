import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  ShieldCheck,
  Heart,
  MessageCircle,
  CreditCard,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  Sparkles,
  PhoneCall,
  Lock
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openLoginModal: () => void;
  openRegisterModal: (gender?: 'male' | 'female') => void;
  openAdminModal: () => void;
  openLegalModal: (type: string) => void;
  openVerificationModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openLoginModal,
  openRegisterModal,
  openAdminModal,
  openLegalModal,
  openVerificationModal
}) => {
  const { currentUser, logoutUser, dailySwipesRemaining, maxDailySwipes, matches } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadCount = matches.reduce((acc, m) => acc + (m.unreadCount || 0), 0);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-rose-950/30 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setCurrentTab(currentUser ? 'discover' : 'home')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-900/30 group-hover:scale-105 transition-transform duration-200">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white">PremKotha</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">WB</span>
              </div>
              <p className="text-[10px] text-rose-300/80 -mt-0.5 font-medium tracking-wide">
                প্রেমকথা · Verified Bengal Dating
              </p>
            </div>
          </div>

          {/* Desktop Navigation for Logged-In Users */}
          {currentUser ? (
            <nav className="hidden md:flex items-center gap-1.5">
              <button
                onClick={() => setCurrentTab('discover')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  currentTab === 'discover'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <Compass className="w-4 h-4 text-rose-400" />
                <span>Discover</span>
              </button>

              <button
                onClick={() => setCurrentTab('matches')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all relative ${
                  currentTab === 'matches'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <Heart className="w-4 h-4 text-pink-400" />
                <span>Matches</span>
                {matches.length > 0 && (
                  <span className="ml-1 text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-rose-600 text-white">
                    {matches.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentTab('messages')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all relative ${
                  currentTab === 'messages'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <MessageCircle className="w-4 h-4 text-purple-400" />
                <span>Messages</span>
                {unreadCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                )}
              </button>

              <button
                onClick={() => setCurrentTab('membership')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  currentTab === 'membership'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-amber-300 hover:bg-slate-900/80'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Membership</span>
              </button>
            </nav>
          ) : (
            /* Desktop Navigation for Public Guests */
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
              <button 
                onClick={() => setCurrentTab('home')} 
                className={`hover:text-white transition-colors ${currentTab === 'home' ? 'text-rose-400 font-semibold' : ''}`}
              >
                Home
              </button>
              <button 
                onClick={() => openLegalModal('how_it_works')} 
                className="hover:text-white transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => openLegalModal('safety')} 
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Safety & Verification</span>
              </button>
              <button 
                onClick={() => setCurrentTab('membership')} 
                className="hover:text-amber-300 transition-colors"
              >
                Membership
              </button>
              <button 
                onClick={() => openLegalModal('faq')} 
                className="hover:text-white transition-colors"
              >
                FAQ
              </button>
              <button 
                onClick={() => openLegalModal('contact')} 
                className="hover:text-white transition-colors"
              >
                Contact
              </button>
            </nav>
          )}

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2 sm:gap-3">
                
                {/* Swipe Counter (50 Swipes per day) */}
                <div 
                  onClick={() => setCurrentTab('discover')}
                  className="hidden sm:flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-xl px-3 py-1.5 text-xs cursor-pointer transition-colors"
                  title="Daily free swipe allowance (Resets at midnight IST)"
                >
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse-subtle" />
                  <span className="font-semibold text-slate-200">
                    {dailySwipesRemaining} / {maxDailySwipes}
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">Swipes</span>
                </div>

                {/* Verification Status Badge */}
                {currentUser.verificationStatus === 'approved' ? (
                  <div 
                    className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-2.5 py-1 text-xs font-medium cursor-default"
                    title="Real-time video verified profile"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="hidden md:inline">Verified</span>
                  </div>
                ) : (
                  <button
                    onClick={openVerificationModal}
                    className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-xl px-2.5 py-1 text-xs font-medium transition-all"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Verify Profile</span>
                  </button>
                )}

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800 transition-colors border border-transparent focus:border-rose-500"
                  >
                    <img
                      src={currentUser.profilePhoto}
                      alt={currentUser.fullName}
                      className="w-9 h-9 rounded-lg object-cover ring-2 ring-rose-500/40"
                    />
                    <span className="hidden xl:inline text-sm font-medium text-slate-200 truncate max-w-[100px]">
                      {currentUser.fullName.split(' ')[0]}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-sm"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-800">
                        <p className="font-semibold text-white">{currentUser.fullName}</p>
                        <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                        <p className="text-[11px] text-rose-400 mt-0.5">{currentUser.city}, {currentUser.district}</p>
                      </div>

                      <button
                        onClick={() => setCurrentTab('profile')}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>My Profile</span>
                      </button>

                      <button
                        onClick={() => setCurrentTab('membership')}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <CreditCard className="w-4 h-4 text-amber-400" />
                        <span>Membership & Invoices</span>
                      </button>

                      <button
                        onClick={openVerificationModal}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Video Verification</span>
                      </button>

                      <div className="border-t border-slate-800 my-1" />

                      <button
                        onClick={logoutUser}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={openLoginModal}
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => openRegisterModal()}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white shadow-lg shadow-rose-950/40 hover:shadow-rose-900/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Join Free (18+)
                </button>
              </div>
            )}

            {/* Quick Admin Portal Button (Isolated Secure Flow) */}
            <button
              onClick={openAdminModal}
              title="Admin Panel Login (Staff Only)"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-slate-900 border border-slate-800/80 transition-colors"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          {currentUser ? (
            <div className="space-y-1">
              <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl mb-3">
                <img src={currentUser.profilePhoto} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <p className="text-sm font-semibold text-white">{currentUser.fullName}</p>
                  <p className="text-xs text-rose-300">{dailySwipesRemaining} / {maxDailySwipes} Swipes Left Today</p>
                </div>
              </div>
              <button
                onClick={() => { setCurrentTab('discover'); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm font-medium text-slate-200 hover:bg-slate-900"
              >
                <Compass className="w-4 h-4 text-rose-400" />
                <span>Discover Profiles</span>
              </button>
              <button
                onClick={() => { setCurrentTab('matches'); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm font-medium text-slate-200 hover:bg-slate-900"
              >
                <Heart className="w-4 h-4 text-pink-400" />
                <span>My Matches ({matches.length})</span>
              </button>
              <button
                onClick={() => { setCurrentTab('messages'); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm font-medium text-slate-200 hover:bg-slate-900"
              >
                <MessageCircle className="w-4 h-4 text-purple-400" />
                <span>Messages</span>
              </button>
              <button
                onClick={() => { setCurrentTab('membership'); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm font-medium text-amber-300 hover:bg-slate-900"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Membership Plans</span>
              </button>
              <button
                onClick={() => { setCurrentTab('profile'); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm font-medium text-slate-200 hover:bg-slate-900"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => { logoutUser(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm font-medium text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
                className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-900 rounded-lg"
              >
                Home
              </button>
              <button
                onClick={() => { openLegalModal('how_it_works'); setMobileMenuOpen(false); }}
                className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-900 rounded-lg"
              >
                How It Works
              </button>
              <button
                onClick={() => { openLegalModal('safety'); setMobileMenuOpen(false); }}
                className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-900 rounded-lg flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Safety & Verification</span>
              </button>
              <button
                onClick={() => { setCurrentTab('membership'); setMobileMenuOpen(false); }}
                className="w-full px-3 py-2 text-left text-sm text-amber-300 hover:bg-slate-900 rounded-lg"
              >
                Membership Plans (From ₹99)
              </button>
              <div className="pt-2 border-t border-slate-800 flex gap-2">
                <button
                  onClick={() => { openLoginModal(); setMobileMenuOpen(false); }}
                  className="flex-1 py-2 rounded-xl text-sm font-medium bg-slate-900 text-white border border-slate-800"
                >
                  Login
                </button>
                <button
                  onClick={() => { openRegisterModal(); setMobileMenuOpen(false); }}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold bg-rose-600 text-white"
                >
                  Register (18+)
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
