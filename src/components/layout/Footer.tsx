import React from 'react';
import { Heart, ShieldCheck, Lock, Award, MapPin } from 'lucide-react';
import { WEST_BENGAL_DISTRICTS } from '../../data/districts';

interface FooterProps {
  openLegalModal: (type: string) => void;
  openRegisterModal: (gender?: 'male' | 'female') => void;
}

export const Footer: React.FC<FooterProps> = ({ openLegalModal, openRegisterModal }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Top Trust Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-900">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Real-Time Liveness Checked</h4>
              <p className="mt-1 text-slate-400 text-xs leading-relaxed">
                Camera-based dynamic gesture verification prevents fake photos and pre-recorded videos.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Strict 18+ & Private</h4>
              <p className="mt-1 text-slate-400 text-xs leading-relaxed">
                Contact numbers and residential addresses are never displayed publicly. Phone numbers stay masked during calls.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">50 Free Daily Swipes</h4>
              <p className="mt-1 text-slate-400 text-xs leading-relaxed">
                Every member gets 50 free swipes every day, reset nightly by server time, with mutual free chats.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Focused on West Bengal</h4>
              <p className="mt-1 text-slate-400 text-xs leading-relaxed">
                Built specifically for singles in Kolkata and all 23 districts of West Bengal from the hills to the plains.
              </p>
            </div>
          </div>
        </div>

        {/* Middle Navigation & Information */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-10">
          
          {/* Brand info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">PremKotha</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-medium">18+ Only</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              PremKotha (প্রেমকথা) is West Bengal’s trusted modern dating and matchmaking community. Dedicated to fostering sincere, verified connections among adults aged 18 and older living across Kolkata, Howrah, Siliguri, and all districts of West Bengal.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                🔒 256-bit SSL Protected
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                🇮🇳 Indian IT Act & DPDP Compliant
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">Quick Links</p>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => openRegisterModal('female')} className="hover:text-rose-300 transition-colors">
                  Female Registration (18+)
                </button>
              </li>
              <li>
                <button onClick={() => openRegisterModal('male')} className="hover:text-rose-300 transition-colors">
                  Male Registration (18+)
                </button>
              </li>
              <li>
                <button onClick={() => openLegalModal('how_it_works')} className="hover:text-white transition-colors">
                  How Mutual Matching Works
                </button>
              </li>
              <li>
                <button onClick={() => openLegalModal('safety')} className="hover:text-white transition-colors">
                  Real-Time Video Verification
                </button>
              </li>
              <li>
                <button onClick={() => openLegalModal('faq')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Safety & Legal */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">Trust & Legal</p>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => openLegalModal('terms')} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => openLegalModal('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <button onClick={() => openLegalModal('community')} className="hover:text-white transition-colors">
                  Community Guidelines
                </button>
              </li>
              <li>
                <button onClick={() => openLegalModal('refund')} className="hover:text-white transition-colors">
                  Refund & Cancellation Policy
                </button>
              </li>
              <li>
                <button onClick={() => openLegalModal('delete_account')} className="hover:text-rose-400 transition-colors">
                  Delete Account & Data
                </button>
              </li>
            </ul>
          </div>

          {/* West Bengal SEO & Regional Hubs */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">Popular Hubs</p>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-400">Kolkata Dating & Matchmaking</li>
              <li className="text-slate-400">Siliguri Singles Network</li>
              <li className="text-slate-400">Howrah & Hooghly Connections</li>
              <li className="text-slate-400">Durgapur & Asansol Dating</li>
              <li className="text-slate-400">Darjeeling & Hills Matchmaking</li>
              <li className="text-slate-400">Shantiniketan & Bolpur Singles</li>
            </ul>
          </div>
        </div>

        {/* West Bengal District Directory Chips */}
        <div className="py-6 border-t border-slate-900">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            West Bengal Districts Served:
          </p>
          <div className="flex flex-wrap gap-x-2 gap-y-1.5 text-[11px] text-slate-500">
            {WEST_BENGAL_DISTRICTS.map((item, idx) => (
              <span key={item.district} className="hover:text-slate-300 transition-colors cursor-default">
                {item.district} {idx < WEST_BENGAL_DISTRICTS.length - 1 ? '·' : ''}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar & Disclaimer */}
        <div className="pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} PremKotha. Built with love in West Bengal, India. Strict 18+ enforcement.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => openLegalModal('privacy')} className="hover:text-slate-400">Privacy</button>
            <span>·</span>
            <button onClick={() => openLegalModal('terms')} className="hover:text-slate-400">Terms</button>
            <span>·</span>
            <button onClick={() => openLegalModal('refund')} className="hover:text-slate-400">Refunds</button>
            <span>·</span>
            <button onClick={() => openLegalModal('contact')} className="hover:text-slate-400">Support Desk</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
