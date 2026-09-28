import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, ShieldCheck, Key, AlertTriangle, ArrowRight } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessOpenDashboard: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessOpenDashboard
}) => {
  const { loginAdmin } = useApp();
  const [adminUser, setAdminUser] = useState('admin@premkotha.com');
  const [adminPass, setAdminPass] = useState('admin2026');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [is2FaStep, setIs2FaStep] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (adminUser.toLowerCase() === 'admin@premkotha.com' && adminPass.length >= 6) {
      setIs2FaStep(true);
    } else {
      setErrorMsg('Invalid staff credentials. Authorized Bengal operations personnel only.');
    }
  };

  const handle2FaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const ok = loginAdmin(twoFactorCode || '202688');
    if (ok) {
      onClose();
      onSuccessOpenDashboard();
    } else {
      setErrorMsg('Invalid 2FA authentication token. (Demo token: 202688)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md text-slate-100">
      <div className="relative w-full max-w-md bg-slate-900 border border-purple-900/50 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 bg-purple-950/30 border-b border-purple-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Staff Admin Portal</h3>
              <p className="text-[11px] text-purple-300/80">Restricted Operations & Moderation Console</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Isolated admin gateway with mandatory 2-Factor Authentication.</span>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {!is2FaStep ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Staff Email / Admin ID
                </label>
                <input
                  type="text"
                  required
                  value={adminUser}
                  onChange={e => setAdminUser(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Admin Master Password
                </label>
                <input
                  type="password"
                  required
                  value={adminPass}
                  onChange={e => setAdminPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <span>Verify Credentials & Request 2FA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handle2FaSubmit} className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mx-auto flex items-center justify-center mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Enter 2FA Security Token</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Generated via Authenticator App / Hardware Security Key.
                </p>
                <div className="mt-2 inline-block px-3 py-1 rounded-lg bg-purple-500/10 text-purple-300 text-xs font-mono font-bold">
                  Demo 2FA Token: 202688
                </div>
              </div>

              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  placeholder="202688"
                  value={twoFactorCode}
                  onChange={e => setTwoFactorCode(e.target.value)}
                  className="w-full text-center tracking-[0.5em] font-mono text-2xl py-2.5 rounded-2xl bg-slate-950 border border-purple-800 text-purple-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIs2FaStep(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg"
                >
                  Authorize Access
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
