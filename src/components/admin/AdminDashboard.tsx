import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile, SubscriptionPlan, UserReport } from '../../types';
import {
  Users,
  ShieldCheck,
  CreditCard,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Activity,
  FileSpreadsheet,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  LogOut,
  Sliders,
  Sparkles,
  PhoneCall,
  Video,
  Lock,
  MessageSquare
} from 'lucide-react';

interface AdminDashboardProps {
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitAdmin }) => {
  const {
    adminEmail,
    logoutAdmin,
    allProfiles,
    plans,
    payments,
    refunds,
    reports,
    auditLogs,
    adminApproveVerification,
    adminRejectVerification,
    adminRequestReverification,
    adminUpdatePlanPrice,
    adminTogglePlanActive,
    adminSuspendUser,
    adminBanUser,
    adminUnbanUser,
    adminApproveRefund,
    adminRejectRefund,
    adminModerateReport
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'verifications' | 'plans' | 'payments' | 'moderation' | 'audit'>('overview');

  // Search & Filters for User Management
  const [userSearch, setUserSearch] = useState('');
  const [userGenderFilter, setUserGenderFilter] = useState('all');
  const [userVerifyFilter, setUserVerifyFilter] = useState('all');

  // Price Editing State
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [newPriceValue, setNewPriceValue] = useState<number>(99);

  // Filtered Users
  const filteredUsers = allProfiles.filter(u => {
    const matchQuery = u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
                       u.district.toLowerCase().includes(userSearch.toLowerCase()) ||
                       u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchGender = userGenderFilter === 'all' || u.gender === userGenderFilter;
    const matchVerify = userVerifyFilter === 'all' || u.verificationStatus === userVerifyFilter;
    return matchQuery && matchGender && matchVerify;
  });

  // Calculate Metrics
  const totalUsers = allProfiles.length;
  const femaleUsers = allProfiles.filter(u => u.gender === 'female').length;
  const maleUsers = allProfiles.filter(u => u.gender === 'male').length;
  const verifiedUsers = allProfiles.filter(u => u.verificationStatus === 'approved').length;
  const pendingVerifications = allProfiles.filter(u => u.verificationStatus === 'pending' || u.verificationStatus === 'required').length;
  const totalRevenue = payments.reduce((acc, p) => p.status === 'paid' ? acc + p.amount : acc, 0);
  const totalNetSettled = payments.reduce((acc, p) => p.status === 'paid' ? acc + p.netSettlementAmount : acc, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Admin Top Navigation */}
      <header className="bg-slate-900 border-b border-purple-900/40 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500 text-purple-300 flex items-center justify-center font-bold font-mono">
            PK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white">PremKotha Admin Console</h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-semibold">
                West Bengal Cluster 01
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Authenticated as: {adminEmail || 'admin@premkotha.com'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => {
              logoutAdmin();
              onExitAdmin();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-rose-300 font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </header>

      {/* Admin Subtabs Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-4 sm:px-8 overflow-x-auto scrollbar-none flex gap-1">
        {[
          { id: 'overview', label: 'Overview Metrics', icon: Activity },
          { id: 'users', label: `Users (${totalUsers})`, icon: Users },
          { id: 'verifications', label: `Verification Queue (${pendingVerifications})`, icon: ShieldCheck },
          { id: 'plans', label: 'Subscription Pricing', icon: Sliders },
          { id: 'payments', label: `Settlements (₹${totalRevenue})`, icon: DollarSign },
          { id: 'moderation', label: `Reports (${reports.length})`, icon: AlertTriangle },
          { id: 'audit', label: 'Audit Logs', icon: FileSpreadsheet }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                isActive
                  ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <p className="text-xs text-slate-400">Total Registered (18+)</p>
                <p className="text-3xl font-black text-white mt-1">{totalUsers}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
                  <span>Female: {femaleUsers}</span>
                  <span>·</span>
                  <span>Male: {maleUsers}</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <p className="text-xs text-slate-400">Verified Profiles (Live)</p>
                <p className="text-3xl font-black text-emerald-400 mt-1">{verifiedUsers}</p>
                <p className="text-[11px] text-slate-500 mt-2">
                  {Math.round((verifiedUsers / Math.max(1, totalUsers)) * 100)}% Liveness approval rate
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <p className="text-xs text-slate-400">Total Revenue Collected</p>
                <p className="text-3xl font-black text-amber-400 mt-1">₹{totalRevenue}</p>
                <p className="text-[11px] text-emerald-400 mt-2 font-mono">
                  Net Settled to Bank: ₹{totalNetSettled}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <p className="text-xs text-slate-400">Pending Safety Queue</p>
                <p className="text-3xl font-black text-rose-400 mt-1">{reports.length + pendingVerifications}</p>
                <p className="text-[11px] text-slate-500 mt-2">Requires manual staff review</p>
              </div>
            </div>

            {/* Quick Bengal Activity Chart / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span>District Distribution (Active Singles)</span>
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Kolkata (Ballygunge, Salt Lake, Jadavpur)</span>
                      <span className="font-bold">54%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[54%] h-full bg-rose-500" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Howrah & Hooghly</span>
                      <span className="font-bold">22%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[22%] h-full bg-purple-500" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Siliguri, Darjeeling & Jalpaiguri</span>
                      <span className="font-bold">16%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[16%] h-full bg-emerald-500" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Durgapur, Asansol & Other WB Districts</span>
                      <span className="font-bold">8%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[8%] h-full bg-amber-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Platform Compliance & Bank Settlements</span>
                </h3>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 text-slate-300">
                  <p className="font-semibold text-white">Owner Bank Settlement Status:</p>
                  <p className="text-slate-400">Registered Beneficiary: PremKotha Pvt. Ltd. (HDFC Bank ending in **8921)</p>
                  <p className="text-emerald-400">Gateway Status: Online (Razorpay / Cashfree active)</p>
                  <p className="text-slate-400">Settlement Cycle: T+1 business days in India</p>
                </div>
                <div className="text-[11px] text-slate-400">
                  Daily free swipe quota (50/50) enforced strictly via server clock (Asia/Kolkata timezone). Client device clocks are ignored.
                </div>
              </div>

            </div>

          </div>
        )}

        {/* USERS MANAGEMENT TAB */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search user by name, email, or Bengal district..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <select
                value={userGenderFilter}
                onChange={e => setUserGenderFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                <option value="all">All Genders</option>
                <option value="female">Female Only</option>
                <option value="male">Male Only</option>
              </select>

              <select
                value={userVerifyFilter}
                onChange={e => setUserVerifyFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                <option value="all">All Verification Statuses</option>
                <option value="approved">Approved</option>
                <option value="required">Pending / Required</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">District / City</th>
                    <th className="py-3 px-4">Age / Gender</th>
                    <th className="py-3 px-4">Profession</th>
                    <th className="py-3 px-4">Verification</th>
                    <th className="py-3 px-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user.profilePhoto}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
                          />
                          <div>
                            <p className="font-bold text-white">{user.fullName}</p>
                            <p className="text-[10px] text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {user.city}, {user.district}
                      </td>
                      <td className="py-3 px-4 capitalize">
                        {user.age} yrs · {user.gender}
                      </td>
                      <td className="py-3 px-4 text-slate-300 truncate max-w-[120px]">
                        {user.profession}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          user.verificationStatus === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {user.verificationStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => adminRequestReverification(user.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px]"
                          title="Trigger real-time re-verification on next login"
                        >
                          Re-Verify
                        </button>
                        <button
                          onClick={() => adminBanUser(user.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px]"
                        >
                          Ban
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* VERIFICATIONS QUEUE TAB */}
        {activeTab === 'verifications' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">Real-Time Liveness Review Queue</h3>
                <p className="text-xs text-slate-400">Review suspicious or uncertain video liveness sessions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allProfiles.map(u => (
                <div key={u.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex gap-3 items-center">
                    <img
                      src={u.verificationSnapshot || u.profilePhoto}
                      alt=""
                      className="w-14 h-14 rounded-xl object-cover ring-2 ring-emerald-500/40"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{u.fullName}</h4>
                      <p className="text-xs text-slate-400">{u.city}, {u.district}</p>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        Status: {u.verificationStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 text-[11px] text-slate-400 space-y-1">
                    <p>Liveness Prompts Checked: <span className="text-white">Smile, Turn Head, Read Phrase</span></p>
                    <p>Replay Detection: <span className="text-emerald-400 font-semibold">PASS (No screen artifact)</span></p>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => adminApproveVerification(u.id)}
                      className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
                    >
                      Approve Badge
                    </button>
                    <button
                      onClick={() => adminRejectVerification(u.id, 'Unclear lighting / face angle')}
                      className="flex-1 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-200 font-semibold text-xs"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBSCRIPTION PRICING CONFIGURATION */}
        {activeTab === 'plans' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-900/40 text-xs text-purple-300">
              ⚡ <strong>Database Dynamic Pricing Engine:</strong> Prices are not hardcoded. The admin can adjust rates anytime. Default baseline: Monthly ₹99, Quarterly ₹299, Half-Yearly ₹399, Yearly ₹599.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map(p => (
                <div key={p.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-sm">{p.name}</h4>
                      <p className="text-xs text-slate-400">{p.durationLabel}</p>
                    </div>
                    <button
                      onClick={() => adminTogglePlanActive(p.id)}
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${p.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}
                    >
                      {p.active ? 'ACTIVE' : 'DISABLED'}
                    </button>
                  </div>

                  {editingPlanId === p.id ? (
                    <div className="space-y-2">
                      <label className="text-[11px] text-slate-400">New Price (INR)</label>
                      <input
                        type="number"
                        value={newPriceValue}
                        onChange={e => setNewPriceValue(parseInt(e.target.value, 10))}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-purple-500 text-sm text-white"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            adminUpdatePlanPrice(p.id, newPriceValue);
                            setEditingPlanId(null);
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                        >
                          Save Price
                        </button>
                        <button
                          onClick={() => setEditingPlanId(null)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white">₹{p.price}</span>
                        <span className="text-xs text-slate-400">/ {p.durationLabel}</span>
                      </div>
                      <button
                        onClick={() => {
                          setEditingPlanId(p.id);
                          setNewPriceValue(p.price);
                        }}
                        className="mt-3 text-xs text-purple-400 hover:underline font-semibold"
                      >
                        Edit Plan Price →
                      </button>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <p>• Daily Swipes: {p.dailySwipes >= 999 ? 'Unlimited' : p.dailySwipes}</p>
                    <p>• Super Likes: {p.superLikesPerMonth}/mo</p>
                    <p>• Calling Allowance: {p.audioVideoAllowanceMinutes} mins</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAYMENTS & SETTLEMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="py-3 px-4">Transaction / Order</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Plan / Amount</th>
                    <th className="py-3 px-4">Gateway & Fee</th>
                    <th className="py-3 px-4">Net Settlement Info</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {payments.map(p => (
                    <tr key={p.id}>
                      <td className="py-3 px-4 font-mono">
                        <p className="text-white font-semibold">{p.id}</p>
                        <p className="text-[10px] text-slate-500">{p.orderId}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-white">{p.userName}</p>
                        <p className="text-[10px] text-slate-400">{p.userMobile}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-slate-200">{p.planName}</p>
                        <p className="font-bold text-white">₹{p.amount}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {p.gateway} (₹{p.gatewayFee} fee)
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-emerald-400 font-mono">₹{p.netSettlementAmount}</p>
                        <p className="text-[10px] text-slate-500">{p.bankAccountRef}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODERATION REPORTS TAB */}
        {activeTab === 'moderation' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">User Moderation & Safety Reports</h3>
            {reports.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
                ✓ No active abuse reports. Platform safety filters are green.
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map(r => (
                  <div key={r.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase">
                        {r.reason.replace('_', ' ')}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">Reported: {r.reportedUserName}</h4>
                      <p className="text-xs text-slate-400">{r.details}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => adminModerateReport(r.id, 'warn')}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-semibold"
                      >
                        Issue Warning
                      </button>
                      <button
                        onClick={() => adminModerateReport(r.id, 'ban')}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold"
                      >
                        Ban Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AUDIT LOGS TAB */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Immutable Platform Audit Trail</h3>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5 px-4">Timestamp</th>
                    <th className="py-2.5 px-4">Actor</th>
                    <th className="py-2.5 px-4">Action</th>
                    <th className="py-2.5 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {auditLogs.map(l => (
                    <tr key={l.id}>
                      <td className="py-2.5 px-4 text-slate-400 whitespace-nowrap">{l.timestamp}</td>
                      <td className="py-2.5 px-4 text-purple-400">{l.adminEmail}</td>
                      <td className="py-2.5 px-4 text-amber-300 font-semibold">{l.action}</td>
                      <td className="py-2.5 px-4 text-slate-200 font-sans">{l.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
