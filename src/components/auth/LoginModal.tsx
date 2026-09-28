import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, Phone, KeyRound, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  openRegisterModal: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  openRegisterModal
}) => {
  const { loginUser, allProfiles, setCurrentUser } = useApp();
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState('shubham.ganguly@premkotha.in');
  const [password, setPassword] = useState('password123');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isForgotPass, setIsForgotPass] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (loginMethod === 'password') {
      if (!identifier.trim() || !password.trim()) {
        setErrorMsg('Please enter both identifier and password');
        return;
      }
      const ok = loginUser(identifier.trim());
      if (ok) {
        onClose();
      } else {
        setErrorMsg('Invalid login credentials or unverified account.');
      }
    } else {
      if (!otpSent) {
        setOtpSent(true);
      } else {
        if (otpCode === '8921' || otpCode === '1234' || otpCode.length === 4) {
          loginUser(identifier.trim());
          onClose();
        } else {
          setErrorMsg('Invalid OTP. Use demo code: 8921');
        }
      }
    }
  };

  const quickLoginAs = (userEmail: string) => {
    loginUser(userEmail);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Sign In to PremKotha</h3>
            <p className="text-xs text-slate-400 mt-0.5">West Bengal's Verified Dating & Matchmaking</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isForgotPass ? (
            <div className="space-y-4">
              <div className="text-center">
                <KeyRound className="w-10 h-10 text-rose-400 mx-auto mb-2" />
                <h4 className="text-base font-bold text-white">Account Recovery</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your registered email address or mobile number to receive a secure password reset link.
                </p>
              </div>

              {recoverySent ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center space-y-2">
                  <p className="font-semibold">Reset instructions dispatched!</p>
                  <p className="text-[11px] text-slate-300">
                    Check your SMS or inbox for recovery instructions.
                  </p>
                  <button
                    onClick={() => { setIsForgotPass(false); setRecoverySent(false); }}
                    className="mt-2 text-rose-400 hover:underline font-semibold"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter email or mobile number"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                  <button
                    onClick={() => setRecoverySent(true)}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs"
                  >
                    Send Reset Link
                  </button>
                  <button
                    onClick={() => setIsForgotPass(false)}
                    className="w-full text-xs text-slate-400 hover:text-white text-center block"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Login Method Toggle */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => { setLoginMethod('password'); setOtpSent(false); }}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    loginMethod === 'password'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Password Login
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('otp')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    loginMethod === 'otp'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Mobile OTP
                </button>
              </div>

              {loginMethod === 'password' ? (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email or Mobile Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="name@example.com or 98300..."
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-slate-300">Password</label>
                      <button
                        type="button"
                        onClick={() => setIsForgotPass(true)}
                        className="text-[11px] text-rose-400 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Number</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-500">+91</span>
                      <input
                        type="tel"
                        required
                        placeholder="98300 12345"
                        value={identifier}
                        onChange={e => setIdentifier(e.target.value)}
                        className="w-full pl-11 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  {otpSent && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-slate-300">Enter 4-Digit OTP</label>
                        <span className="text-[11px] text-emerald-400 font-mono">Demo: 8921</span>
                      </div>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="8921"
                        value={otpCode}
                        onChange={e => setOtpCode(e.target.value)}
                        className="w-full text-center tracking-[0.5em] font-mono text-xl py-2 rounded-xl bg-slate-950 border border-slate-800 text-rose-400 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-semibold text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <span>{loginMethod === 'otp' && !otpSent ? 'Send OTP to Mobile' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}

          {/* Quick Demo Logins for Fast Review */}
          <div className="pt-2 border-t border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wide text-center">
              Instant Demo Logins (1-Click Switch)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => quickLoginAs('ananya.mukherjee@example.com')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors flex items-center gap-2"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt=""
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-pink-500/40"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-white truncate">Ananya M.</p>
                  <p className="text-[10px] text-pink-300">Female · Kolkata</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => quickLoginAs('shubham.ganguly@premkotha.in')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors flex items-center gap-2"
              >
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80"
                  alt=""
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-purple-500/40"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-white truncate">Shubham G.</p>
                  <p className="text-[10px] text-purple-300">Male · Kolkata</p>
                </div>
              </button>
            </div>
          </div>

          {/* Switch to Register */}
          <div className="text-center pt-2 text-xs text-slate-400">
            Don't have a profile yet?{' '}
            <button
              onClick={() => { onClose(); openRegisterModal(); }}
              className="text-rose-400 hover:underline font-semibold"
            >
              Join Free (18+)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
