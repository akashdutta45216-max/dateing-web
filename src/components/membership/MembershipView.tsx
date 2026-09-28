import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubscriptionPlan, Invoice } from '../../types';
import {
  Sparkles,
  Check,
  ShieldCheck,
  CreditCard,
  FileText,
  RotateCcw,
  Building2,
  Lock,
  ArrowRight,
  Download,
  AlertCircle
} from 'lucide-react';

interface MembershipViewProps {
  onSelectPlan: (plan: SubscriptionPlan) => void;
  onViewInvoice: (invoice: Invoice) => void;
}

export const MembershipView: React.FC<MembershipViewProps> = ({
  onSelectPlan,
  onViewInvoice
}) => {
  const {
    plans,
    activeSubscription,
    payments,
    invoices,
    requestRefund
  } = useApp();

  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refundNotice, setRefundNotice] = useState('');

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaymentId || !refundReason.trim()) return;

    requestRefund(selectedPaymentId, refundReason.trim());
    setRefundNotice('Refund request registered with Admin audit queue. Per policy, eligible requests are reviewed within 24–48 hours.');
    setTimeout(() => {
      setRefundModalOpen(false);
      setRefundNotice('');
      setRefundReason('');
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PremKotha Moner Sathi Membership</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Unlock Unlimited Bengali Matchmaking
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Transparent, budget-friendly plans with no hidden recurring auto-debits. Prices dynamically configured in database.
        </p>

        {activeSubscription && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold inline-flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Active Plan: {activeSubscription.planName} (Valid until {activeSubscription.expiresAt})</span>
          </div>
        )}
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.filter(p => p.active).map(plan => {
          const isCurrent = activeSubscription?.planId === plan.id;
          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 flex flex-col justify-between transition-all relative ${
                plan.popular
                  ? 'bg-gradient-to-b from-purple-950/60 to-slate-900 border-2 border-rose-500 shadow-2xl shadow-rose-950/40 lg:-translate-y-2'
                  : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-base font-bold text-white">{plan.name}</h3>
                  <span className="text-xs text-rose-300 font-medium">{plan.durationLabel}</span>
                </div>

                <div className="my-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">₹{plan.price}</span>
                    <span className="text-xs text-slate-400 font-normal">/ {plan.durationLabel}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Inclusive of 18% GST (No hidden taxes)</p>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>{plan.dailySwipes >= 999 ? 'Unlimited' : plan.dailySwipes}</strong> Daily Swipes</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>{plan.superLikesPerMonth}</strong> Super Likes / month</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Free Unlimited Chat</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>{plan.audioVideoAllowanceMinutes >= 999 ? 'Unlimited' : `${plan.audioVideoAllowanceMinutes} min`}</strong> Calling</span>
                  </div>

                  {plan.seeWhoLikedYou && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>See Who Liked You</span>
                    </div>
                  )}

                  {plan.priorityMatches && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Priority Match Boost</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onSelectPlan(plan)}
                  disabled={isCurrent}
                  className={`w-full py-3 rounded-2xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : plan.popular
                      ? 'bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white hover:scale-[1.02]'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  <span>{isCurrent ? 'Current Plan' : `Subscribe for ₹${plan.price}`}</span>
                  {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Payment to Owner Bank Account Architecture Display (As per prompt requirement 12) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5">
          <Building2 className="w-5 h-5 text-rose-400" />
          <h3 className="text-base font-bold text-white">Payment Gateway & Owner Bank Settlement Architecture</h3>
        </div>
        
        <p className="text-xs text-slate-300 leading-relaxed">
          PremKotha complies with Reserve Bank of India (RBI) payment guidelines. Customer payments are tokenized and processed via certified Indian Payment Gateways (Razorpay/Cashfree/PayU) and settled directly into the website owner's registered Indian current bank account.
        </p>

        {/* Visual Pipeline */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-2 text-[11px] font-medium text-center">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="block text-slate-400">1. Customer</span>
            <span className="text-white font-semibold">Selects Plan</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="block text-slate-400">2. Checkout</span>
            <span className="text-rose-400 font-semibold">UPI / Card / Net</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="block text-slate-400">3. Gateway</span>
            <span className="text-purple-400 font-semibold">Tokenizes & Bills</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="block text-slate-400">4. Server</span>
            <span className="text-emerald-400 font-semibold">Signature Verify</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="block text-slate-400">5. PremKotha</span>
            <span className="text-amber-400 font-semibold">Instant Activation</span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60 text-white">
            <span className="block text-purple-300">6. Settlement</span>
            <span className="text-white font-bold">Owner Bank A/C</span>
          </div>
        </div>
      </div>

      {/* Invoices & Past Transactions */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Your Official Invoices & Receipts</span>
            </h3>
            <p className="text-xs text-slate-400">Automated tax invoices with GSTIN and transaction IDs</p>
          </div>

          {payments.length > 0 && (
            <button
              onClick={() => setRefundModalOpen(true)}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Request Plan Refund (3-Day Policy)</span>
            </button>
          )}
        </div>

        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Invoice No.</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Plan</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {invoices.map((inv) => (
                  <tr key={inv.invoiceNumber} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-white">{inv.invoiceNumber}</td>
                    <td className="py-3 px-3 text-slate-400">{inv.date}</td>
                    <td className="py-3 px-3 text-slate-200">{inv.planName}</td>
                    <td className="py-3 px-3 font-bold text-white">₹{inv.totalAmount}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px]">
                        ✓ {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onViewInvoice(inv)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        <span>View / Print</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center">
            No payments recorded yet. Invoices appear automatically after your first subscription purchase.
          </p>
        )}
      </div>

      {/* Refund Request Modal */}
      {refundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span>Submit Refund Request</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We offer a 3-day refund guarantee if technical issues prevented calling or matching. Admin reviews each request before gateway initiation.
            </p>

            {refundNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                {refundNotice}
              </div>
            )}

            <form onSubmit={handleRefundSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Select Transaction</label>
                <select
                  required
                  value={selectedPaymentId}
                  onChange={e => setSelectedPaymentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="">Select a transaction...</option>
                  {payments.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.planName} – ₹{p.amount} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Reason for Refund</label>
                <textarea
                  required
                  rows={3}
                  value={refundReason}
                  onChange={e => setRefundReason(e.target.value)}
                  placeholder="Describe why you are requesting a cancellation/refund..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRefundModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
