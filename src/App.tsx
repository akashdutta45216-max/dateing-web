import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { DiscoverView } from './components/swipe/DiscoverView';
import { MatchesView } from './components/chat/MatchesView';
import { ChatView } from './components/chat/ChatView';
import { MembershipView } from './components/membership/MembershipView';
import { UserProfileView } from './components/profile/UserProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Modals
import { RegisterModal } from './components/auth/RegisterModal';
import { LoginModal } from './components/auth/LoginModal';
import { AdminLoginModal } from './components/auth/AdminLoginModal';
import { VideoVerificationModal } from './components/verification/VideoVerificationModal';
import { MatchCelebrationModal } from './components/match/MatchCelebrationModal';
import { CallModal } from './components/calling/CallModal';
import { PaymentGatewayModal } from './components/membership/PaymentGatewayModal';
import { InvoiceModal } from './components/membership/InvoiceModal';
import { LegalModal } from './components/legal/LegalModal';
import { SubscriptionPlan, Invoice, Match, Gender } from './types';

const MainAppContent: React.FC = () => {
  const {
    currentUser,
    activeMatch,
    setActiveMatch,
    newMatchModalData,
    closeMatchModal,
    startCall,
    reportUser,
    blockUser,
    isAdminAuthenticated
  } = useApp();

  // Navigation tab: 'home' | 'discover' | 'matches' | 'messages' | 'membership' | 'profile' | 'admin'
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Modal States
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [initialRegisterGender, setInitialRegisterGender] = useState<Gender>('female');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<string | null>(null);

  // Payment & Invoice Modals
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<SubscriptionPlan | null>(null);
  const [activeInvoiceModal, setActiveInvoiceModal] = useState<Invoice | null>(null);

  // Handlers
  const handleOpenRegister = (gender?: Gender) => {
    if (gender) setInitialRegisterGender(gender);
    setRegisterModalOpen(true);
  };

  const handleOpenLogin = () => {
    setLoginModalOpen(true);
  };

  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setCurrentTab('admin');
    } else {
      setAdminLoginModalOpen(true);
    }
  };

  const handleOpenLegal = (type: string) => {
    setLegalModalType(type);
  };

  const handleOpenChat = (match: Match) => {
    setActiveMatch(match);
    setCurrentTab('messages');
  };

  const handleStartAudioCall = (partner: Match['targetUser']) => {
    startCall(partner, 'audio');
  };

  const handleStartVideoCall = (partner: Match['targetUser']) => {
    startCall(partner, 'video');
  };

  const handleReportFromChat = (userId: string) => {
    reportUser(userId, 'harassment', 'Reported via active conversation / call');
    alert('Thank you. Profile reported for staff moderation review.');
  };

  const handleBlockFromChat = (userId: string) => {
    if (confirm('Are you sure you want to block this user? They will not appear in your discover or chat lists.')) {
      blockUser(userId);
      setActiveMatch(null);
      setCurrentTab('matches');
    }
  };

  // If in Admin Console mode
  if (currentTab === 'admin' && isAdminAuthenticated) {
    return <AdminDashboard onExitAdmin={() => setCurrentTab('discover')} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      
      {/* Sticky Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openLoginModal={handleOpenLogin}
        openRegisterModal={handleOpenRegister}
        openAdminModal={handleOpenAdmin}
        openLegalModal={handleOpenLegal}
        openVerificationModal={() => setVerificationModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <LandingPage
            openRegisterModal={handleOpenRegister}
            openLoginModal={handleOpenLogin}
            openLegalModal={handleOpenLegal}
            onExplore={() => setCurrentTab('discover')}
          />
        )}

        {currentTab === 'discover' && (
          <DiscoverView
            onOpenMembership={() => setCurrentTab('membership')}
            onOpenVerification={() => setVerificationModalOpen(true)}
          />
        )}

        {currentTab === 'matches' && (
          <MatchesView
            onOpenChat={handleOpenChat}
            onStartAudioCall={handleStartAudioCall}
            onStartVideoCall={handleStartVideoCall}
            onExplore={() => setCurrentTab('discover')}
          />
        )}

        {currentTab === 'messages' && (
          activeMatch ? (
            <ChatView
              onBack={() => setCurrentTab('matches')}
              onStartAudioCall={handleStartAudioCall}
              onStartVideoCall={handleStartVideoCall}
              onReportUser={handleReportFromChat}
              onBlockUser={handleBlockFromChat}
            />
          ) : (
            <MatchesView
              onOpenChat={handleOpenChat}
              onStartAudioCall={handleStartAudioCall}
              onStartVideoCall={handleStartVideoCall}
              onExplore={() => setCurrentTab('discover')}
            />
          )
        )}

        {currentTab === 'membership' && (
          <MembershipView
            onSelectPlan={(plan) => setSelectedPlanForPayment(plan)}
            onViewInvoice={(invoice) => setActiveInvoiceModal(invoice)}
          />
        )}

        {currentTab === 'profile' && (
          <UserProfileView
            onOpenVerification={() => setVerificationModalOpen(true)}
            onOpenMembership={() => setCurrentTab('membership')}
            onOpenLegal={handleOpenLegal}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        openLegalModal={handleOpenLegal}
        openRegisterModal={handleOpenRegister}
      />

      {/* MODALS */}

      {/* 18+ Registration Modal */}
      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        initialGender={initialRegisterGender}
        onSuccessOpenVerification={() => {
          setVerificationModalOpen(true);
          setCurrentTab('discover');
        }}
      />

      {/* Normal User Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        openRegisterModal={() => handleOpenRegister()}
      />

      {/* Separate Admin Login Modal (2FA) */}
      <AdminLoginModal
        isOpen={adminLoginModalOpen}
        onClose={() => setAdminLoginModalOpen(false)}
        onSuccessOpenDashboard={() => setCurrentTab('admin')}
      />

      {/* Real-Time Video Liveness Verification Modal */}
      <VideoVerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
      />

      {/* Match Celebration Modal with Confetti */}
      <MatchCelebrationModal
        match={newMatchModalData}
        onClose={closeMatchModal}
        onOpenChat={handleOpenChat}
      />

      {/* Calling Modal (WebRTC Simulation) */}
      <CallModal
        onOpenMembership={() => setCurrentTab('membership')}
        onReportUser={handleReportFromChat}
      />

      {/* Payment Gateway Modal (Razorpay / Cashfree) */}
      {selectedPlanForPayment && (
        <PaymentGatewayModal
          isOpen={!!selectedPlanForPayment}
          plan={selectedPlanForPayment}
          onClose={() => setSelectedPlanForPayment(null)}
          onPaymentSuccess={(invoice) => {
            setSelectedPlanForPayment(null);
            setActiveInvoiceModal(invoice);
          }}
        />
      )}

      {/* GST Tax Invoice Modal */}
      <InvoiceModal
        invoice={activeInvoiceModal}
        onClose={() => setActiveInvoiceModal(null)}
      />

      {/* Legal & Policy Modals (Safety, Terms, Privacy, Refund, FAQ, Support) */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
