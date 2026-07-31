import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Toast } from './components/common/Toast';

// Auth & Intelligent Onboarding Components
import { SplashScreen } from './components/auth/SplashScreen';
import { WelcomeScreen } from './components/auth/WelcomeScreen';
import { RegisterScreen } from './components/auth/RegisterScreen';
import { EmailVerificationScreen } from './components/auth/EmailVerificationScreen';
import { LoginScreen } from './components/auth/LoginScreen';
import { ForgotPasswordScreen } from './components/auth/ForgotPasswordScreen';
import { IntelligentOnboarding } from './components/onboarding/IntelligentOnboarding';

// Main App Views
import { HomeDashboard } from './components/home/HomeDashboard';
import { AIMatchingEngine } from './components/matching/AIMatchingEngine';
import { StudyWorkspace } from './components/workspace/StudyWorkspace';
import { StudyRoomsView } from './components/rooms/StudyRoomsView';
import { LearningCircleView } from './components/friends/LearningCircleView';
import { StudyPodsView } from './components/pods/StudyPodsView';
import { GlobalCommunitiesView } from './components/communities/GlobalCommunitiesView';
import { ActivityFeedView } from './components/feed/ActivityFeedView';
import { LeaderboardsView } from './components/leaderboards/LeaderboardsView';
import { StudyStatsView } from './components/stats/StudyStatsView';
import { SettingsView } from './components/settings/SettingsView';
import { QuickMatchModal } from './components/matching/QuickMatchModal';
import { BottomNav } from './components/common/BottomNav';
import { AdminPortal } from './components/admin/AdminPortal';
import { AIEcosystemView } from './components/ai/AIEcosystemView';
import { GrowthEngineView } from './components/growth/GrowthEngineView';
import { BusinessPlatformView } from './components/business/BusinessPlatformView';
import { InfrastructureControlView } from './components/infrastructure/InfrastructureControlView';
import { ProductionReadinessView } from './components/launch/ProductionReadinessView';

const MainLayout: React.FC = () => {
  const { 
    user,
    setUser,
    authScreen, 
    setAuthScreen, 
    isLoggedIn, 
    setIsLoggedIn, 
    hasCompletedOnboarding, 
    setHasCompletedOnboarding,
    setAuthTokens,
    activeTab,
    quickMatchOpen,
    setQuickMatchOpen
  } = useApp();

  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otpDemo, setOtpDemo] = useState<string | undefined>();

  // 1. Splash Screen
  if (authScreen === 'splash') {
    return (
      <SplashScreen 
        onComplete={() => {
          if (isLoggedIn) {
            if (hasCompletedOnboarding) {
              setAuthScreen('home');
            } else {
              setAuthScreen('onboarding');
            }
          } else {
            setAuthScreen('welcome');
          }
        }} 
      />
    );
  }

  // If user is not logged in and not on splash, route through auth flow
  if (!isLoggedIn) {
    if (authScreen === 'register') {
      return (
        <RegisterScreen 
          onSuccess={(email, userId, demoOtp) => {
            setRegisteredEmail(email);
            setOtpDemo(demoOtp);
            setAuthScreen('verify-email');
          }}
          onLoginClick={() => setAuthScreen('login')}
        />
      );
    }

    if (authScreen === 'verify-email') {
      return (
        <EmailVerificationScreen 
          email={registeredEmail || user.email || 'alex.chen@university.edu'}
          otpDemo={otpDemo}
          onVerified={() => {
            setIsLoggedIn(true);
            setAuthScreen('onboarding');
          }}
        />
      );
    }

    if (authScreen === 'login') {
      return (
        <LoginScreen 
          onSuccess={(userData, tokens, isOnboarded) => {
            setIsLoggedIn(true);
            setAuthTokens(tokens);
            if (userData) {
              setUser(prev => ({
                ...prev,
                id: userData.id || prev.id,
                name: userData.fullName || userData.username || prev.name,
                username: userData.username || prev.username,
                email: userData.email || prev.email,
                country: userData.country || prev.country,
                language: userData.preferredLanguage || prev.language
              }));
            }
            if (isOnboarded) {
              setHasCompletedOnboarding(true);
              setAuthScreen('home');
            } else {
              setAuthScreen('onboarding');
            }
          }}
          onRegisterClick={() => setAuthScreen('register')}
          onForgotPasswordClick={() => setAuthScreen('forgot-password')}
        />
      );
    }

    if (authScreen === 'forgot-password') {
      return (
        <ForgotPasswordScreen 
          onBackToLogin={() => setAuthScreen('login')}
        />
      );
    }

    // Default to Welcome Screen
    return (
      <WelcomeScreen 
        onGetStarted={() => setAuthScreen('register')}
        onLogin={() => setAuthScreen('login')}
      />
    );
  }

  // 2. Logged in, but onboarding incomplete -> Intelligent Onboarding
  if (!hasCompletedOnboarding || authScreen === 'onboarding') {
    return (
      <IntelligentOnboarding 
        onComplete={(updatedProfile) => {
          if (updatedProfile) {
            setUser(updatedProfile);
          }
          setHasCompletedOnboarding(true);
          setAuthScreen('home');
        }}
      />
    );
  }

  // 3. Authenticated & Onboarded -> Admin Portal or Main StudyConnect Home Application
  if (activeTab === 'admin') {
    return (
      <>
        <AdminPortal />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-12">
      <Header />
      <main className="flex-1">
        {(activeTab === 'home' || !activeTab) && <HomeDashboard />}
        {activeTab === 'matching' && <AIMatchingEngine />}
        {activeTab === 'workspace' && <StudyWorkspace />}
        {activeTab === 'rooms' && <StudyRoomsView />}
        {activeTab === 'pods' && <StudyPodsView />}
        {activeTab === 'communities' && <GlobalCommunitiesView />}
        {activeTab === 'circle' && <LearningCircleView />}
        {activeTab === 'feed' && <ActivityFeedView />}
        {activeTab === 'leaderboards' && <LeaderboardsView />}
        {activeTab === 'stats' && <StudyStatsView />}
        {activeTab === 'settings' && <SettingsView />}
        {activeTab === 'notifications' && <LearningCircleView />}
        {activeTab === 'ai-ecosystem' && <AIEcosystemView />}
        {activeTab === 'growth-engine' && <GrowthEngineView />}
        {activeTab === 'business-platform' && <BusinessPlatformView />}
        {activeTab === 'infrastructure' && <InfrastructureControlView />}
        {activeTab === 'production-readiness' && <ProductionReadinessView />}
      </main>

      {/* Quick Match Wizard Modal */}
      <QuickMatchModal
        isOpen={quickMatchOpen}
        onClose={() => setQuickMatchOpen(false)}
      />

      {/* Floating Action Button (FAB) & Mobile Navigation */}
      <BottomNav />

      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
