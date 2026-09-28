import React, { useState } from 'react';
import { X, ShieldCheck, FileText, AlertCircle, HelpCircle, PhoneCall, Send, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LegalModalProps {
  type: string | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const { createSupportTicket, currentUser } = useApp();

  const [activeType, setActiveType] = useState<string>(type || 'safety');
  
  // Support ticket form
  const [supportSubject, setSupportSubject] = useState('');
  const [supportCategory, setSupportCategory] = useState<'verification' | 'payment' | 'match' | 'privacy' | 'technical'>('verification');
  const [supportMsg, setSupportMsg] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  if (!type) return null;

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportSubject.trim() || !supportMsg.trim()) return;

    createSupportTicket(supportSubject.trim(), supportMsg.trim(), supportCategory);
    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setSupportSubject('');
      setSupportMsg('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md text-slate-100">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white capitalize">
              {activeType.replace('_', ' ')}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold">
              PremKotha Bengal Trust
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2 bg-slate-950/50 border-b border-slate-800/80 flex gap-2 overflow-x-auto shrink-0 scrollbar-none text-xs">
          {[
            { id: 'safety', label: 'Safety & Verification' },
            { id: 'how_it_works', label: 'How It Works' },
            { id: 'privacy', label: 'Privacy Policy' },
            { id: 'terms', label: 'Terms & Conditions' },
            { id: 'refund', label: 'Refund Policy' },
            { id: 'community', label: 'Community Guidelines' },
            { id: 'faq', label: 'FAQ' },
            { id: 'contact', label: 'Support Desk' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveType(tab.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors font-medium ${
                activeType === tab.id
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
          
          {/* SAFETY & VERIFICATION */}
          {activeType === 'safety' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
                <span>Real-Time Liveness Profile Verification & Anti-Spoofing</span>
              </div>
              <p>
                At PremKotha, user trust is our highest priority. To prevent catfishing, bots, and impersonators across West Bengal, we enforce real-time camera liveness verification:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                <li><strong>No Pre-Recorded Uploads:</strong> Verification cannot be passed with static photos or uploaded videos. The session requires live camera feed.</li>
                <li><strong>Randomized Dynamic Actions:</strong> Each liveness session issues a randomized sequence of challenges (e.g. smile, blink, turn head left/right, raise hand, read Bengali phrase).</li>
                <li><strong>Privacy Safeguard:</strong> PremKotha does not store raw biometric facial scans permanently. Video is processed in-memory for verification and compliance audit only.</li>
                <li><strong>Masked Phone Numbers:</strong> In-app audio and video calls never reveal your personal phone number or email address.</li>
              </ul>
            </div>
          )}

          {/* HOW IT WORKS */}
          {activeType === 'how_it_works' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">How PremKotha Works in West Bengal</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-bold text-rose-400">1. Strict 18+ Registration</p>
                  <p className="text-[11px] text-slate-400 mt-1">Provide your verified date of birth, Bengali district, interests, and verify your mobile via OTP.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-bold text-emerald-400">2. Real-Time Camera Check</p>
                  <p className="text-[11px] text-slate-400 mt-1">Complete a 15-second live face check to earn your official green Verified badge.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-bold text-orange-400">3. 50 Free Daily Swipes</p>
                  <p className="text-[11px] text-slate-400 mt-1">Every free user receives 50 swipes every single day, reset automatically at midnight IST.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-bold text-purple-400">4. Mutual Match & Free Chat</p>
                  <p className="text-[11px] text-slate-400 mt-1">When both like each other, it's a match! Unlimited text and in-app audio/video calling are unlocked.</p>
                </div>
              </div>
            </div>
          )}

          {/* PRIVACY POLICY */}
          {activeType === 'privacy' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Privacy Policy & Digital Personal Data Protection (DPDP)</h3>
              <p>
                PremKotha complies with the Indian Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023.
              </p>
              <p>
                <strong>Information We Collect:</strong> Name, age, gender, contact number (for OTP authentication only), profile bio, city and district. We never collect or publish exact residential addresses.
              </p>
              <p>
                <strong>Payment Data:</strong> Card details, UPI PINs, and banking credentials are handled exclusively by certified payment gateways (Razorpay/Cashfree). We never store or handle raw financial credentials.
              </p>
              <p>
                <strong>Right to Erasure:</strong> Users can permanently delete their account and associated profile data at any time via the "Delete My Account" button.
              </p>
            </div>
          )}

          {/* TERMS & CONDITIONS */}
          {activeType === 'terms' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Terms of Service</h3>
              <p>1. <strong>Eligibility:</strong> You must be at least 18 years old to create an account or use PremKotha.</p>
              <p>2. <strong>Account Security:</strong> You are responsible for safeguarding your login credentials and agreeing to liveness verification.</p>
              <p>3. <strong>Zero Tolerance for Abuse:</strong> Harassment, solicitation, commercial advertising, explicit unsolicited imagery, or hate speech results in immediate permanent account termination without refund.</p>
              <p>4. <strong>Subscription Pricing:</strong> All subscription rates (₹99 Monthly, ₹299 Quarterly, ₹399 Half-Yearly, ₹599 Yearly) are clearly displayed prior to checkout and include applicable taxes.</p>
            </div>
          )}

          {/* REFUND POLICY */}
          {activeType === 'refund' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Refund & Cancellation Policy</h3>
              <p>
                PremKotha is committed to user satisfaction. We offer a <strong>3-Day Refund Guarantee</strong> on subscription plans:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>If technical defects prevent in-app messaging or calling within 72 hours of purchase, you may submit a refund request from the Membership tab.</li>
                <li>The website administration reviews all refund requests within 24–48 business hours.</li>
                <li>Approved refunds are credited back to the original source (UPI/Card/Bank) within 5–7 banking business days according to the payment gateway's settlement cycle.</li>
              </ul>
            </div>
          )}

          {/* COMMUNITY GUIDELINES */}
          {activeType === 'community' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Bengali Matchmaking Community Standards</h3>
              <p>• <strong>Respect & Courtesy:</strong> Treat all members with dignity. PremKotha is a respectful community for friendship, dating, and matrimonial connections.</p>
              <p>• <strong>Authenticity:</strong> Use only real, recent photos of yourself that match your live camera check.</p>
              <p>• <strong>Safety First:</strong> Never wire money or share financial details with any match.</p>
            </div>
          )}

          {/* FAQ */}
          {activeType === 'faq' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="font-bold text-white">Is chat really free after matching?</p>
                <p className="text-slate-400 mt-1">Yes! Once two users mutually right-swipe / like each other, text messaging is 100% free with no hidden charges.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="font-bold text-white">How do daily free swipes work?</p>
                <p className="text-slate-400 mt-1">Free users get 50 swipes every day. The counter resets based on server time at midnight IST every night.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="font-bold text-white">Can users below 18 years old join?</p>
                <p className="text-slate-400 mt-1">No. Registration strictly blocks anyone whose calculated age is below 18.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="font-bold text-white">What payment methods are supported?</p>
                <p className="text-slate-400 mt-1">UPI (Google Pay, PhonePe, Paytm, BHIM), RuPay/Visa/Mastercard credit and debit cards, and Net Banking across major Indian banks.</p>
              </div>
            </div>
          )}

          {/* CONTACT / SUPPORT DESK */}
          {activeType === 'contact' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Contact PremKotha Support Desk</h3>
                <p className="text-slate-400">Our Kolkata based member assistance team responds within 12 hours.</p>
              </div>

              {ticketSent ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center space-y-1">
                  <Check className="w-8 h-8 mx-auto text-emerald-400" />
                  <p className="font-bold">Support Ticket Dispatched!</p>
                  <p className="text-[11px] text-slate-300">Ticket ID has been logged in your dashboard.</p>
                </div>
              ) : (
                <form onSubmit={handleSupportSubmit} className="space-y-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Issue Category</label>
                    <select
                      value={supportCategory}
                      onChange={e => setSupportCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    >
                      <option value="verification">Profile Video Verification Issue</option>
                      <option value="payment">Payment & Invoice Support</option>
                      <option value="match">Matching & Chat Inquiries</option>
                      <option value="privacy">Privacy & Account Deletion</option>
                      <option value="technical">Technical Bug Report</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="Brief summary of the issue..."
                      value={supportSubject}
                      onChange={e => setSupportSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Message</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Provide details so our operations team can resolve it quickly..."
                      value={supportMsg}
                      onChange={e => setSupportMsg(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Support Ticket</span>
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
