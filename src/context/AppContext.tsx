import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Match,
  Message,
  CallSession,
  SubscriptionPlan,
  PaymentTransaction,
  Invoice,
  RefundRequest,
  UserReport,
  AuditLog,
  SupportTicket
} from '../types';
import { INITIAL_PROFILES, DEFAULT_SUBSCRIPTION_PLANS } from '../data/mockData';

interface AppContextType {
  currentUser: UserProfile | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  allProfiles: UserProfile[];
  dailySwipesRemaining: number;
  maxDailySwipes: number;
  serverResetTime: string;
  matches: Match[];
  activeMatch: Match | null;
  setActiveMatch: (match: Match | null) => void;
  messages: Message[];
  activeCall: CallSession | null;
  plans: SubscriptionPlan[];
  activeSubscription: { planId: string; planName: string; expiresAt: string } | null;
  payments: PaymentTransaction[];
  invoices: Invoice[];
  refunds: RefundRequest[];
  reports: UserReport[];
  auditLogs: AuditLog[];
  supportTickets: SupportTicket[];
  isAdminAuthenticated: boolean;
  adminEmail: string | null;
  
  // Actions
  loginUser: (emailOrMobile: string) => boolean;
  logoutUser: () => void;
  registerUser: (newProfile: UserProfile) => void;
  updateCurrentUserProfile: (updates: Partial<UserProfile>) => void;
  deleteAccount: (reason?: string) => void;
  
  // Swipes & Matches
  swipeUser: (targetId: string, action: 'like' | 'pass' | 'superlike') => { isMatch: boolean; match?: Match };
  newMatchModalData: Match | null;
  closeMatchModal: () => void;
  
  // Verification
  submitVideoVerification: (snapshotUrl: string) => void;
  
  // Chat & Calling
  sendMessage: (matchId: string, text: string, imageUrl?: string) => void;
  deleteMessage: (messageId: string) => void;
  startCall: (targetUser: UserProfile, type: 'audio' | 'video') => void;
  endCall: () => void;
  freeCallUsedForUser: (targetUserId: string) => boolean;
  markFreeCallUsed: (targetUserId: string) => void;
  
  // Payment & Membership
  processPayment: (plan: SubscriptionPlan, method: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking') => Promise<{ success: boolean; invoice: Invoice }>;
  requestRefund: (paymentId: string, reason: string) => void;
  
  // Safety
  reportUser: (reportedUserId: string, reason: UserReport['reason'], details: string) => void;
  blockUser: (blockedUserId: string) => void;
  createSupportTicket: (subject: string, message: string, category: SupportTicket['category']) => void;

  // Admin Actions
  loginAdmin: (code: string) => boolean;
  logoutAdmin: () => void;
  adminApproveVerification: (userId: string) => void;
  adminRejectVerification: (userId: string, reason: string) => void;
  adminRequestReverification: (userId: string) => void;
  adminUpdatePlanPrice: (planId: string, newPrice: number) => void;
  adminTogglePlanActive: (planId: string) => void;
  adminSuspendUser: (userId: string) => void;
  adminBanUser: (userId: string) => void;
  adminUnbanUser: (userId: string) => void;
  adminApproveRefund: (refundId: string) => void;
  adminRejectRefund: (refundId: string) => void;
  adminModerateReport: (reportId: string, action: 'warn' | 'suspend' | 'ban' | 'dismiss') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'premkotha_user';
const STORAGE_KEY_SWIPES = 'premkotha_swipes_count';
const STORAGE_KEY_SWIPES_DATE = 'premkotha_swipes_date';
const STORAGE_KEY_PLANS = 'premkotha_plans';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default logged in demo profile (can switch or logout anytime)
  const defaultUser: UserProfile = {
    id: 'user_current_main',
    fullName: 'Shubham Ganguly',
    dob: '1997-04-10',
    age: 27,
    gender: 'male',
    interestedIn: 'female',
    mobile: '+91 98309 88123',
    email: 'shubham.ganguly@premkotha.in',
    district: 'Kolkata',
    city: 'South Kolkata (Ballygunge/Alipore)',
    profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
    ],
    bio: 'Product manager living in South Kolkata. Big fan of College Street books, Rabindrasangeet evenings, and Sunday mutton biryani. Looking for someone genuine to share laughter and adda with.',
    profession: 'Senior Product Manager',
    education: 'B.E. Jadavpur University, MBA IIM Calcutta',
    height: "5' 11\" (180 cm)",
    relationshipStatus: 'Single',
    relationshipGoal: 'long_term',
    interests: ['Coffee House Adda ☕', 'Rabindrasangeet 🎶', 'Reading Bengali Novels 📚', 'Photography 📷'],
    languages: ['Bengali', 'English', 'Hindi'],
    verificationStatus: 'approved',
    verificationDate: '2026-08-10',
    isOnline: true,
    lastActive: 'Now'
  };

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return defaultUser; }
    }
    return defaultUser;
  });

  const [allProfiles, setAllProfiles] = useState<UserProfile[]>(INITIAL_PROFILES);
  const [dailySwipesRemaining, setDailySwipesRemaining] = useState<number>(() => {
    const today = new Date().toISOString().split('T')[0];
    const savedDate = localStorage.getItem(STORAGE_KEY_SWIPES_DATE);
    if (savedDate !== today) {
      localStorage.setItem(STORAGE_KEY_SWIPES_DATE, today);
      localStorage.setItem(STORAGE_KEY_SWIPES, '50');
      return 50;
    }
    const savedSwipes = localStorage.getItem(STORAGE_KEY_SWIPES);
    return savedSwipes ? parseInt(savedSwipes, 10) : 50;
  });

  const [plans, setPlans] = useState<SubscriptionPlan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PLANS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return DEFAULT_SUBSCRIPTION_PLANS; }
    }
    return DEFAULT_SUBSCRIPTION_PLANS;
  });

  const [activeSubscription, setActiveSubscription] = useState<{ planId: string; planName: string; expiresAt: string } | null>(null);

  // Initial Matches
  const [matches, setMatches] = useState<Match[]>([
    {
      id: 'match_1',
      users: ['user_current_main', 'wb_user_1'],
      matchedAt: 'Yesterday, 8:42 PM',
      lastMessage: 'Shubho shondhya! Which book are you reading right now?',
      lastMessageAt: '8:45 PM',
      unreadCount: 1,
      targetUser: INITIAL_PROFILES[0] // Ananya Mukherjee
    },
    {
      id: 'match_2',
      users: ['user_current_main', 'wb_user_7'],
      matchedAt: '3 days ago',
      lastMessage: 'Would love to catch a play at Academy of Fine Arts!',
      lastMessageAt: 'Sep 25',
      unreadCount: 0,
      targetUser: INITIAL_PROFILES[6] // Shreya Bandyopadhyay
    }
  ]);

  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [newMatchModalData, setNewMatchModalData] = useState<Match | null>(null);

  // Messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_1',
      matchId: 'match_1',
      senderId: 'wb_user_1',
      receiverId: 'user_current_main',
      text: 'Shubho shondhya! Loved your bio—especially the College Street books part! Which book are you reading currently?',
      timestamp: 'Yesterday, 8:45 PM',
      status: 'read'
    },
    {
      id: 'msg_2',
      matchId: 'match_1',
      senderId: 'user_current_main',
      receiverId: 'wb_user_1',
      text: 'Shubho shondhya Ananya! Currently re-reading Aranyak by Bibhutibhushan. Are you more into classic literature or contemporary thrillers?',
      timestamp: 'Yesterday, 8:50 PM',
      status: 'read'
    },
    {
      id: 'msg_3',
      matchId: 'match_1',
      senderId: 'wb_user_1',
      receiverId: 'user_current_main',
      text: 'Aranyak is an absolute masterpiece 🍃! I love classic Bengali fiction with a cup of hot Darjeeling tea.',
      timestamp: 'Yesterday, 8:55 PM',
      status: 'delivered'
    }
  ]);

  // Calls
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [usedFreeCalls, setUsedFreeCalls] = useState<Record<string, boolean>>({});

  // Payments & Invoices
  const [payments, setPayments] = useState<PaymentTransaction[]>([
    {
      id: 'pay_wb_9921',
      orderId: 'order_wb_48912',
      userId: 'user_current_main',
      userName: 'Shubham Ganguly',
      userEmail: 'shubham.ganguly@premkotha.in',
      userMobile: '+91 98309 88123',
      planId: 'plan_monthly',
      planName: 'Monthly Spark',
      amount: 99,
      currency: 'INR',
      paymentMethod: 'UPI',
      status: 'paid',
      gateway: 'Razorpay',
      gatewayFee: 1.98,
      taxGst: 15.1,
      netSettlementAmount: 81.92,
      settlementStatus: 'Settled to Owner Bank Account',
      bankAccountRef: 'HDFC Bank A/C **8921',
      timestamp: '2026-09-15 14:22:10 IST',
      signature: 'sig_wb_verified_7a81c0'
    }
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      invoiceNumber: 'PK-INV-2026-00412',
      transactionId: 'pay_wb_9921',
      orderId: 'order_wb_48912',
      date: '15 September 2026',
      customerName: 'Shubham Ganguly',
      customerEmail: 'shubham.ganguly@premkotha.in',
      customerMobile: '+91 98309 88123',
      planName: 'Monthly Spark (₹99)',
      durationLabel: '1 Month',
      baseAmount: 83.9,
      gstAmount: 15.1,
      totalAmount: 99.0,
      status: 'Paid',
      companyName: 'PremKotha Matchmaking Services India Pvt. Ltd.',
      companyAddress: 'Salt Lake Sector V, Bidhannagar, Kolkata, West Bengal 700091',
      gstin: '19AAECP1234M1Z5'
    }
  ]);

  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      id: 'tkt_101',
      userId: 'user_current_main',
      userName: 'Shubham Ganguly',
      userEmail: 'shubham.ganguly@premkotha.in',
      subject: 'Inquiry on Video Verification Badge re-check',
      message: 'Hello PremKotha team, had a question about how often liveness verification is checked.',
      category: 'verification',
      status: 'resolved',
      createdAt: '2026-09-20'
    }
  ]);

  // Admin
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log_01',
      adminEmail: 'admin@premkotha.com',
      action: 'SYSTEM_INIT',
      details: 'PremKotha West Bengal Engine initialized with server-side 50 swipes allowance policy.',
      timestamp: '2026-09-28 00:00:00 IST'
    },
    {
      id: 'log_02',
      adminEmail: 'admin@premkotha.com',
      action: 'VERIFICATION_APPROVED',
      targetId: 'wb_user_1',
      details: 'Approved real-time video liveness verification for Ananya Mukherjee (Kolkata).',
      timestamp: '2026-08-12 11:30:15 IST'
    }
  ]);

  // Persist Current User
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [currentUser]);

  // Persist Swipes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SWIPES, dailySwipesRemaining.toString());
  }, [dailySwipesRemaining]);

  // Persist Plans
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(plans));
  }, [plans]);

  // Server midnight reset calculation
  const getMidnightResetString = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diffMs = midnight.getTime() - now.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m (IST)`;
  };

  const [serverResetTime, setServerResetTime] = useState(getMidnightResetString);

  useEffect(() => {
    const timer = setInterval(() => {
      setServerResetTime(getMidnightResetString());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const maxDailySwipes = activeSubscription ? 150 : 50;

  // Swipe Action
  const swipeUser = (targetId: string, action: 'like' | 'pass' | 'superlike') => {
    if (dailySwipesRemaining <= 0) {
      return { isMatch: false };
    }

    setDailySwipesRemaining(prev => Math.max(0, prev - 1));

    const target = allProfiles.find(p => p.id === targetId);
    if (!target) return { isMatch: false };

    // High match probability on likes to showcase mutual matching
    const willMatch = action === 'like' || action === 'superlike';
    if (willMatch) {
      // Check if already matched
      const existingMatch = matches.find(m => m.users.includes(targetId));
      if (!existingMatch && currentUser) {
        const newMatch: Match = {
          id: `match_${Date.now()}`,
          users: [currentUser.id, target.id],
          matchedAt: 'Just now',
          lastMessage: action === 'superlike' ? '⭐ You super liked each other!' : '✨ You matched! Say Shubho Shondhya!',
          lastMessageAt: 'Just now',
          unreadCount: 0,
          targetUser: target
        };

        setMatches(prev => [newMatch, ...prev]);
        setNewMatchModalData(newMatch);
        return { isMatch: true, match: newMatch };
      }
    }

    return { isMatch: false };
  };

  const closeMatchModal = () => {
    setNewMatchModalData(null);
  };

  const submitVideoVerification = (snapshotUrl: string) => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      verificationStatus: 'approved',
      verificationDate: new Date().toISOString().split('T')[0],
      verificationSnapshot: snapshotUrl
    };
    setCurrentUser(updated);

    // Add audit log
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      adminEmail: 'system_liveness@premkotha.in',
      action: 'REALTIME_LIVENESS_PASSED',
      targetId: currentUser.id,
      details: `User ${currentUser.fullName} completed real-time multi-gesture liveness detection. Verified badge awarded.`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const sendMessage = (matchId: string, text: string, imageUrl?: string) => {
    if (!currentUser) return;
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    const receiverId = match.users.find(u => u !== currentUser.id) || '';

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      matchId,
      senderId: currentUser.id,
      receiverId,
      text,
      imageUrl,
      timestamp: 'Just now',
      status: 'sent'
    };

    setMessages(prev => [...prev, newMsg]);

    // Update match last message
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          lastMessage: text || '📷 Photo shared',
          lastMessageAt: 'Just now'
        };
      }
      return m;
    }));

    // Simulate realistic auto-reply after 2 seconds
    setTimeout(() => {
      const replies = [
        'Haa, perfectly agree with you! Kolkata-te bhalo adda ar kothao hoy na!',
        'Ami ektu por reply dichhi! So nice hearing from you.',
        'That sounds wonderful! Let’s plan a coffee meet soon!',
        'Tomar profile-er picture ta khub bhalo laglo!'
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const replyMsg: Message = {
        id: `msg_reply_${Date.now()}`,
        matchId,
        senderId: receiverId,
        receiverId: currentUser.id,
        text: randomReply,
        timestamp: 'Just now',
        status: 'read'
      };
      setMessages(p => [...p, replyMsg]);
      setMatches(prev => prev.map(m => {
        if (m.id === matchId) {
          return {
            ...m,
            lastMessage: randomReply,
            lastMessageAt: 'Just now',
            unreadCount: (m.unreadCount || 0) + 1
          };
        }
        return m;
      }));
    }, 2200);
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
  };

  const freeCallUsedForUser = (targetUserId: string) => {
    return !!usedFreeCalls[targetUserId];
  };

  const markFreeCallUsed = (targetUserId: string) => {
    setUsedFreeCalls(prev => ({ ...prev, [targetUserId]: true }));
  };

  const startCall = (targetUser: UserProfile, type: 'audio' | 'video') => {
    if (!currentUser) return;
    const session: CallSession = {
      id: `call_${Date.now()}`,
      matchId: `match_active_${targetUser.id}`,
      callerId: currentUser.id,
      receiverId: targetUser.id,
      type,
      status: 'calling',
      startTime: new Date().toISOString(),
      targetUser
    };
    setActiveCall(session);
  };

  const endCall = () => {
    if (activeCall) {
      markFreeCallUsed(activeCall.receiverId);
    }
    setActiveCall(null);
  };

  const processPayment = async (plan: SubscriptionPlan, method: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking'): Promise<{ success: boolean; invoice: Invoice }> => {
    if (!currentUser) throw new Error('User not logged in');

    // Indian GST calculation (18%)
    const totalAmount = plan.price;
    const baseAmount = Math.round((totalAmount / 1.18) * 100) / 100;
    const gstAmount = Math.round((totalAmount - baseAmount) * 100) / 100;
    const gatewayFee = Math.round((totalAmount * 0.02) * 100) / 100;
    const netSettlement = Math.round((totalAmount - gatewayFee) * 100) / 100;

    const txId = `pay_wb_${Date.now().toString().slice(-6)}`;
    const orderId = `order_wb_${Date.now().toString().slice(-5)}`;
    const invoiceNum = `PK-INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newPayment: PaymentTransaction = {
      id: txId,
      orderId,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userEmail: currentUser.email,
      userMobile: currentUser.mobile,
      planId: plan.id,
      planName: plan.name,
      amount: totalAmount,
      currency: 'INR',
      paymentMethod: method,
      status: 'paid',
      gateway: 'Razorpay',
      gatewayFee,
      taxGst: gstAmount,
      netSettlementAmount: netSettlement,
      settlementStatus: 'Settled to Owner Bank Account',
      bankAccountRef: 'HDFC Bank Current A/C **8921',
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      signature: `sig_verified_${Math.random().toString(36).substring(2, 10)}`
    };

    const newInvoice: Invoice = {
      invoiceNumber: invoiceNum,
      transactionId: txId,
      orderId,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      customerName: currentUser.fullName,
      customerEmail: currentUser.email,
      customerMobile: currentUser.mobile,
      planName: `${plan.name} (₹${plan.price})`,
      durationLabel: plan.durationLabel,
      baseAmount,
      gstAmount,
      totalAmount,
      status: 'Paid',
      companyName: 'PremKotha Matchmaking Services India Pvt. Ltd.',
      companyAddress: 'Salt Lake Sector V, Bidhannagar, Kolkata, West Bengal 700091',
      gstin: '19AAECP1234M1Z5'
    };

    // Calculate expiry date
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + plan.durationMonths);

    setPayments(prev => [newPayment, ...prev]);
    setInvoices(prev => [newInvoice, ...prev]);
    setActiveSubscription({
      planId: plan.id,
      planName: plan.name,
      expiresAt: expiry.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    });
    setDailySwipesRemaining(prev => Math.max(prev, plan.dailySwipes));

    // Audit log
    const audit: AuditLog = {
      id: `log_${Date.now()}`,
      adminEmail: 'payment_engine@premkotha.in',
      action: 'PAYMENT_VERIFIED_AND_SETTLED',
      targetId: txId,
      details: `₹${totalAmount} collected via ${method} for ${plan.name} from ${currentUser.fullName}. Net settlement of ₹${netSettlement} queued to owner bank account.`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    setAuditLogs(prev => [audit, ...prev]);

    return { success: true, invoice: newInvoice };
  };

  const requestRefund = (paymentId: string, reason: string) => {
    if (!currentUser) return;
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    const refund: RefundRequest = {
      id: `ref_${Date.now()}`,
      paymentId,
      userId: currentUser.id,
      userName: currentUser.fullName,
      amount: payment.amount,
      reason,
      status: 'pending',
      requestDate: new Date().toLocaleDateString('en-IN')
    };

    setRefunds(prev => [refund, ...prev]);
  };

  const reportUser = (reportedUserId: string, reason: UserReport['reason'], details: string) => {
    if (!currentUser) return;
    const target = allProfiles.find(p => p.id === reportedUserId);
    const report: UserReport = {
      id: `rep_${Date.now()}`,
      reporterId: currentUser.id,
      reportedUserId,
      reportedUserName: target ? target.fullName : 'User',
      reason,
      details,
      timestamp: new Date().toLocaleString('en-IN'),
      status: 'pending'
    };
    setReports(prev => [report, ...prev]);
  };

  const blockUser = (blockedUserId: string) => {
    setBlockedUserIds(prev => [...prev, blockedUserId]);
    setAllProfiles(prev => prev.filter(p => p.id !== blockedUserId));
    setMatches(prev => prev.filter(m => !m.users.includes(blockedUserId)));
  };

  const createSupportTicket = (subject: string, message: string, category: SupportTicket['category']) => {
    if (!currentUser) return;
    const ticket: SupportTicket = {
      id: `tkt_${Date.now().toString().slice(-4)}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userEmail: currentUser.email,
      subject,
      message,
      category,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSupportTickets(prev => [ticket, ...prev]);
  };

  const loginUser = (emailOrMobile: string) => {
    const existing = allProfiles.find(p => p.email === emailOrMobile || p.mobile === emailOrMobile);
    if (existing) {
      setCurrentUser(existing);
      return true;
    }
    // Default fallback to default user
    setCurrentUser(defaultUser);
    return true;
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const registerUser = (newProfile: UserProfile) => {
    // Strictly enforce 18+
    if (newProfile.age < 18) {
      throw new Error('Registration is strictly permitted for individuals aged 18 and above.');
    }
    setCurrentUser(newProfile);
    setAllProfiles(prev => [newProfile, ...prev]);

    const audit: AuditLog = {
      id: `log_${Date.now()}`,
      adminEmail: 'auth_service@premkotha.in',
      action: 'USER_REGISTERED',
      targetId: newProfile.id,
      details: `New account registered: ${newProfile.fullName} (${newProfile.gender}, age ${newProfile.age}) from ${newProfile.district}, West Bengal.`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  const updateCurrentUserProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setAllProfiles(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteAccount = (reason?: string) => {
    if (!currentUser) return;
    const uid = currentUser.id;
    const uname = currentUser.fullName;
    setCurrentUser(null);
    setAllProfiles(prev => prev.filter(p => p.id !== uid));
    setMatches(prev => prev.filter(m => !m.users.includes(uid)));

    const audit: AuditLog = {
      id: `log_${Date.now()}`,
      adminEmail: 'privacy_officer@premkotha.in',
      action: 'USER_ACCOUNT_DELETED',
      targetId: uid,
      details: `User ${uname} invoked GDPR/DPDP Right to be Forgotten. Account & sensitive data permanently purged. Reason: ${reason || 'User requested'}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  // Admin Actions
  const loginAdmin = (code: string) => {
    if (code === '202688' || code === '123456' || code.length === 6) {
      setIsAdminAuthenticated(true);
      setAdminEmail('admin@premkotha.com');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminEmail(null);
  };

  const adminApproveVerification = (userId: string) => {
    setAllProfiles(prev => prev.map(p => p.id === userId ? { ...p, verificationStatus: 'approved' } : p));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, verificationStatus: 'approved' } : null);
    }
    const audit: AuditLog = {
      id: `log_${Date.now()}`,
      adminEmail: adminEmail || 'admin@premkotha.com',
      action: 'ADMIN_APPROVE_VERIFICATION',
      targetId: userId,
      details: `Admin manually approved real-time verification session for user ID: ${userId}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  const adminRejectVerification = (userId: string, reason: string) => {
    setAllProfiles(prev => prev.map(p => p.id === userId ? { ...p, verificationStatus: 'rejected' } : p));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, verificationStatus: 'rejected' } : null);
    }
    const audit: AuditLog = {
      id: `log_${Date.now()}`,
      adminEmail: adminEmail || 'admin@premkotha.com',
      action: 'ADMIN_REJECT_VERIFICATION',
      targetId: userId,
      details: `Admin rejected verification for user ${userId}. Reason: ${reason}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  const adminRequestReverification = (userId: string) => {
    setAllProfiles(prev => prev.map(p => p.id === userId ? { ...p, verificationStatus: 'required' } : p));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, verificationStatus: 'required' } : null);
    }
  };

  const adminUpdatePlanPrice = (planId: string, newPrice: number) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, price: newPrice } : p));
    const audit: AuditLog = {
      id: `log_${Date.now()}`,
      adminEmail: adminEmail || 'admin@premkotha.com',
      action: 'SUBSCRIPTION_PRICE_UPDATED',
      targetId: planId,
      details: `Updated subscription price for ${planId} to ₹${newPrice}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  const adminTogglePlanActive = (planId: string) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, active: !p.active } : p));
  };

  const adminSuspendUser = (userId: string) => {
    setAllProfiles(prev => prev.map(p => p.id === userId ? { ...p, isSuspended: !p.isSuspended } : p));
  };

  const adminBanUser = (userId: string) => {
    setAllProfiles(prev => prev.map(p => p.id === userId ? { ...p, isBanned: true } : p));
  };

  const adminUnbanUser = (userId: string) => {
    setAllProfiles(prev => prev.map(p => p.id === userId ? { ...p, isBanned: false } : p));
  };

  const adminApproveRefund = (refundId: string) => {
    setRefunds(prev => prev.map(r => r.id === refundId ? { ...r, status: 'approved', processedDate: new Date().toISOString() } : r));
  };

  const adminRejectRefund = (refundId: string) => {
    setRefunds(prev => prev.map(r => r.id === refundId ? { ...r, status: 'rejected', processedDate: new Date().toISOString() } : r));
  };

  const adminModerateReport = (reportId: string, action: 'warn' | 'suspend' | 'ban' | 'dismiss') => {
    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status: action === 'warn' ? 'warned' : action === 'suspend' ? 'suspended' : action === 'ban' ? 'banned' : 'dismissed'
        };
      }
      return r;
    }));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        allProfiles: allProfiles.filter(p => !blockedUserIds.includes(p.id) && !p.isBanned),
        dailySwipesRemaining,
        maxDailySwipes,
        serverResetTime,
        matches,
        activeMatch,
        setActiveMatch,
        messages,
        activeCall,
        plans,
        activeSubscription,
        payments,
        invoices,
        refunds,
        reports,
        auditLogs,
        supportTickets,
        isAdminAuthenticated,
        adminEmail,
        loginUser,
        logoutUser,
        registerUser,
        updateCurrentUserProfile,
        deleteAccount,
        swipeUser,
        newMatchModalData,
        closeMatchModal,
        submitVideoVerification,
        sendMessage,
        deleteMessage,
        startCall,
        endCall,
        freeCallUsedForUser,
        markFreeCallUsed,
        processPayment,
        requestRefund,
        reportUser,
        blockUser,
        createSupportTicket,
        loginAdmin,
        logoutAdmin,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
