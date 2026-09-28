export type Gender = 'male' | 'female' | 'other';
export type InterestedIn = 'female' | 'male' | 'all';
export type VerificationStatus = 'required' | 'pending' | 'approved' | 'rejected';
export type RelationshipGoal = 'long_term' | 'dating' | 'marriage' | 'friendship' | 'casual';

export interface UserProfile {
  id: string;
  fullName: string;
  dob: string; // YYYY-MM-DD
  age: number;
  gender: Gender;
  interestedIn: InterestedIn;
  mobile: string;
  email: string;
  district: string;
  city: string;
  profilePhoto: string;
  additionalPhotos: string[];
  bio: string;
  profession: string;
  education: string;
  height: string; // e.g. "5' 8\" (173 cm)"
  relationshipStatus: string;
  relationshipGoal: RelationshipGoal;
  interests: string[];
  languages: string[];
  verificationStatus: VerificationStatus;
  verificationDate?: string;
  verificationSnapshot?: string;
  isOnline: boolean;
  lastActive: string;
  isBanned?: boolean;
  isSuspended?: boolean;
  isBoosted?: boolean;
  distanceKm?: number;
}

export interface SwipeAction {
  id: string;
  userId: string;
  targetUserId: string;
  action: 'like' | 'pass' | 'superlike';
  timestamp: string;
}

export interface Match {
  id: string;
  users: [string, string];
  matchedAt: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  targetUser: UserProfile;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  text: string;
  imageUrl?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface CallSession {
  id: string;
  matchId: string;
  callerId: string;
  receiverId: string;
  type: 'audio' | 'video';
  status: 'calling' | 'connected' | 'ended' | 'declined';
  startTime?: string;
  durationSeconds?: number;
  targetUser: UserProfile;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  durationMonths: number;
  durationLabel: string;
  price: number;
  popular?: boolean;
  dailySwipes: number;
  superLikesPerMonth: number;
  unlimitedChat: boolean;
  audioVideoAllowanceMinutes: number; // or unlimited
  seeWhoLikedYou: boolean;
  priorityMatches: boolean;
  active: boolean;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userMobile: string;
  planId: string;
  planName: string;
  amount: number;
  currency: 'INR';
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  gateway: 'Razorpay' | 'Cashfree' | 'PayU';
  gatewayFee: number;
  taxGst: number;
  netSettlementAmount: number;
  settlementStatus: 'Settled to Owner Bank Account' | 'Processing' | 'Pending';
  bankAccountRef: string; // e.g. "HDFC Bank ending in **8921"
  timestamp: string;
  signature?: string;
}

export interface Invoice {
  invoiceNumber: string;
  transactionId: string;
  orderId: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  planName: string;
  durationLabel: string;
  baseAmount: number;
  gstAmount: number; // 18% GST in India
  totalAmount: number;
  status: 'Paid';
  companyName: string;
  companyAddress: string;
  gstin: string;
}

export interface RefundRequest {
  id: string;
  paymentId: string;
  userId: string;
  userName: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  processedDate?: string;
  adminNotes?: string;
}

export interface UserReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reportedUserName: string;
  reason: 'fake_profile' | 'harassment' | 'spam' | 'scam' | 'inappropriate_content' | 'impersonation' | 'sexual_exploitation' | 'threatening_behavior' | 'other';
  details: string;
  timestamp: string;
  status: 'pending' | 'warned' | 'suspended' | 'banned' | 'dismissed';
  moderatorNotes?: string;
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  targetId?: string;
  details: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  category: 'verification' | 'payment' | 'match' | 'privacy' | 'technical';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}
