import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  NavigationTab, 
  ToastMessage 
} from './types';
import { AppProvider, useAppContext } from './context/AppContext';
import { AuthContext, useAuth } from './context/AuthContext';
import { onAuthStateChanged, User, signOut, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './services/firebase';
import { getUserRole, setUserRole as setUserRoleInStorage, setActiveAuthSessionRole } from './services/storage';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/Toast';
import { ConfirmationModal } from './components/ConfirmationModal';
import { GuidedDemoTour } from './components/GuidedDemoTour';

// Pages
import { LandingPage } from './pages/LandingPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { DashboardPage } from './pages/DashboardPage';
import { DemandForecastPage } from './pages/DemandForecastPage';
import { FoodBatchesPage } from './pages/FoodBatchesPage';
import { IoTSimulatorPage } from './pages/IoTSimulatorPage';
import { QualityCheckPage } from './pages/QualityCheckPage';
import { NgoMatchingPage } from './pages/NgoMatchingPage';
import { RoutePlanningPage } from './pages/RoutePlanningPage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { DatasetManagementPage } from './pages/DatasetManagementPage';

function AppShell() {
  const {
    batches,
    donations,
    routes,
    settings,
    activeRole,
    userName,
    activeSurplusCount,
    handleAddBatch,
    handleAddForecast,
    handleRoleChange,
    handleResetData
  } = useAppContext();

  // App view level: 'landing' | 'role-selection' | 'app'
  const [viewMode, setViewMode] = useState<'landing' | 'role-selection' | 'app'>('landing');
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');

  // Layout state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);

  // Cross-page parameters
  const [targetBatchIdForQuality, setTargetBatchIdForQuality] = useState<string | undefined>(undefined);
  const [targetBatchIdForNgo, setTargetBatchIdForNgo] = useState<string | undefined>(undefined);
  const [targetDonationIdForRoute, setTargetDonationIdForRoute] = useState<string | undefined>(undefined);
  const [isAddBatchModalOpenInitially, setIsAddBatchModalOpenInitially] = useState(false);

  // Toast Helper
  const showToast = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts(prev => [...prev, { id, title, message, type }]);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const authContext = useAuth();

  const handleRoleChangeWithToast = async (role: UserRole) => {
    handleRoleChange(role);
    await authContext.setUserRole(role);
    showToast('Role Switched', `Logged in as ${role} (Demo User).`, 'info');
  };

  const handleSelectRoleFromLanding = async (role: UserRole) => {
    await handleRoleChangeWithToast(role);
    setViewMode('app');
    setCurrentTab('dashboard');
  };

  const handleLogout = async () => {
    await authContext.logout();
    setViewMode('role-selection');
    showToast('Logged Out', 'Returned to role selection page.', 'info');
  };

  const handleConfirmResetData = () => {
    handleResetData();
    setIsResetModalOpen(false);
    showToast('Data Reset', 'All records restored to canonical Vijayawada demo scenario.', 'success');
  };

  // Workflow navigation shortcuts
  const handleNavigateToQuality = (batchId: string) => {
    setTargetBatchIdForQuality(batchId);
    setCurrentTab('quality-check');
  };

  const handleNavigateToNgo = (batchId: string) => {
    setTargetBatchIdForNgo(batchId);
    setCurrentTab('ngo-matching');
  };

  const handleNavigateToRoute = (donationId: string) => {
    setTargetDonationIdForRoute(donationId);
    setCurrentTab('route-planning');
  };

  const handleOpenAddBatchQuick = () => {
    setIsAddBatchModalOpenInitially(true);
    setCurrentTab('food-batches');
  };

  // Page titles
  const tabTitles: Record<NavigationTab, string> = {
    'dashboard': 'Operational Dashboard',
    'demand-forecast': 'AI Demand Forecasting',
    'food-batches': 'Food Batches & Surplus Detection',
    'iot-simulator': 'Virtual IoT Kitchen Simulator',
    'quality-check': 'Quality Check & Redistribution Eligibility',
    'ngo-matching': 'NGO Partner Matching',
    'route-planning': 'Pickup & Delivery Route Planning',
    'sustainability': 'Sustainability & ESG Analytics',
    'reports': 'Audit & Impact Reports',
    'settings': 'Kitchen & System Settings',
    'dataset-management': 'Dataset Governance & Ingestion'
  };

  // Render Landing Page
  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage
          onGetStarted={() => setViewMode('role-selection')}
          onExploreDashboard={() => {
            setViewMode('app');
            setCurrentTab('dashboard');
          }}
          onSelectRole={(role) => handleSelectRoleFromLanding(role)}
          onStartTour={() => {
            setViewMode('app');
            setCurrentTab('demand-forecast');
            setIsDemoTourOpen(true);
          }}
        />
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  // Render Role Selection Page
  if (viewMode === 'role-selection') {
    return (
      <>
        <RoleSelectionPage
          onSelectRole={(role) => handleSelectRoleFromLanding(role)}
          onBackToHome={() => setViewMode('landing')}
        />
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  // Render Main Application Shell
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setIsAddBatchModalOpenInitially(false);
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          activeRole={activeRole}
          surplusCount={activeSurplusCount}
          locationCity={settings?.city}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            pageTitle={tabTitles[currentTab]}
            activeRole={activeRole}
            userName={userName}
            onRoleChange={handleRoleChangeWithToast}
            onLogout={handleLogout}
            onResetData={() => setIsResetModalOpen(true)}
            onToggleSidebar={() => {
              if (window.innerWidth >= 1024) {
                setIsSidebarCollapsed(!isSidebarCollapsed);
              } else {
                setIsMobileSidebarOpen(!isMobileSidebarOpen);
              }
            }}
            onNavigateLanding={() => setViewMode('landing')}
            onStartDemoTour={() => setIsDemoTourOpen(!isDemoTourOpen)}
            isDemoTourActive={isDemoTourOpen}
            locationCity={settings?.city}
            kitchenName={settings?.kitchenName}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {/* View Switching with direct Context Consumption & Props for SustainabilityPage */}
            {currentTab === 'dashboard' && (
              <DashboardPage
                onNavigate={(t) => setCurrentTab(t)}
                onOpenAddBatch={handleOpenAddBatchQuick}
                onSelectBatchForQuality={handleNavigateToQuality}
                onSelectBatchForNgo={handleNavigateToNgo}
              />
            )}

            {currentTab === 'demand-forecast' && (
              <DemandForecastPage
                showToast={showToast}
              />
            )}

            {currentTab === 'food-batches' && (
              <FoodBatchesPage
                onStartQualityCheck={handleNavigateToQuality}
                onCreateDonation={handleNavigateToNgo}
                isAddModalOpenInitially={isAddBatchModalOpenInitially}
                showToast={showToast}
              />
            )}

            {currentTab === 'iot-simulator' && (
              <IoTSimulatorPage
                showToast={showToast}
              />
            )}

            {currentTab === 'quality-check' && (
              <QualityCheckPage
                selectedBatchIdInitially={targetBatchIdForQuality}
                onProceedToNgoMatching={handleNavigateToNgo}
                showToast={showToast}
              />
            )}

            {currentTab === 'ngo-matching' && (
              <NgoMatchingPage
                selectedBatchIdInitially={targetBatchIdForNgo}
                onProceedToRoutePlanning={handleNavigateToRoute}
                showToast={showToast}
              />
            )}

            {currentTab === 'route-planning' && (
              <RoutePlanningPage
                selectedDonationIdInitially={targetDonationIdForRoute}
                showToast={showToast}
              />
            )}

            {currentTab === 'sustainability' && (
              <SustainabilityPage
                batches={batches}
                donations={donations}
                routes={routes}
                showToast={showToast}
              />
            )}

            {currentTab === 'reports' && (
              <ReportsPage
                showToast={showToast}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsPage
                onResetAllData={() => setIsResetModalOpen(true)}
                showToast={showToast}
              />
            )}

            {currentTab === 'dataset-management' && (
              <DatasetManagementPage
                activeRole={activeRole}
                onSwitchRole={handleRoleChangeWithToast}
                showToast={showToast}
                onAddBatch={handleAddBatch}
                onAddForecast={handleAddForecast}
              />
            )}
          </main>
        </div>
      </div>

      {/* Confirmation Modal for Resetting Demo Data */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        title="Reset to Canonical Demo Data?"
        message="This will restore all batches, predictions, IoT telemetry logs, and Vijayawada NGO dispatch routes to the default canonical demo scenario."
        confirmLabel="Reset All Data"
        cancelLabel="Keep Current State"
        variant="warning"
        onConfirm={handleConfirmResetData}
        onCancel={() => setIsResetModalOpen(false)}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Guided Walkthrough Tour for Evaluators */}
      <GuidedDemoTour
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        currentTab={currentTab}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          if (viewMode !== 'app') setViewMode('app');
        }}
        onSwitchRole={handleRoleChangeWithToast}
      />
    </div>
  );
}

export function App() {
  const [userRole, setUserRole] = useState<UserRole>(getUserRole());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // Sync role across React state, storage, and Firestore
  const handleSetUserRole = async (newRole: UserRole) => {
    setUserRole(newRole);
    setActiveAuthSessionRole(newRole);
    setUserRoleInStorage(newRole);

    if (isFirebaseConfigured && auth?.currentUser) {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userRef, {
          role: newRole,
          name: 'Demo User',
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore role persistence notice:', err);
      }
    }
  };

  // Demo user anonymous sign-in path
  const handleSignInDemoRole = async (role: UserRole) => {
    try {
      if (isFirebaseConfigured && typeof signInAnonymously === 'function' && auth) {
        const cred = await signInAnonymously(auth);
        const uid = cred.user.uid;
        await setDoc(doc(db, 'users', uid), {
          role,
          name: 'Demo User',
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
      await handleSetUserRole(role);
    } catch (err) {
      console.warn('Anonymous sign in notice (offline fallback used):', err);
      await handleSetUserRole(role);
    }
  };

  const handleLogout = async () => {
    try {
      if (isFirebaseConfigured && typeof signOut === 'function' && auth) {
        await signOut(auth);
      }
    } catch (err) {
      console.warn('Sign out notice:', err);
    }
    setCurrentUser(null);
  };

  // onAuthStateChanged listener: fetches user role from Firestore users/{uid}/role
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setAuthLoading(false);
      return;
    }

    let unsubscribe = () => {};

    try {
      if (auth && typeof onAuthStateChanged === 'function') {
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          setCurrentUser(user);

          if (user) {
            try {
              const userDocRef = doc(db, 'users', user.uid);
              const docSnap = await getDoc(userDocRef);
              if (docSnap.exists()) {
                const data = docSnap.data();
                if (data?.role) {
                  const fetchedRole = data.role as UserRole;
                  setUserRole(fetchedRole);
                  setActiveAuthSessionRole(fetchedRole);
                  setUserRoleInStorage(fetchedRole);
                }
              }
            } catch (err) {
              console.warn('Firestore user role fetch error (offline fallback used):', err);
            }
          }
          setAuthLoading(false);
        }, (err) => {
          console.warn('onAuthStateChanged observer notice:', err);
          setAuthLoading(false);
        });
      } else {
        setAuthLoading(false);
      }
    } catch (err) {
      console.warn('Auth observer setup notice:', err);
      setAuthLoading(false);
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Loading spinner while auth state resolves (only if explicitly set)
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center font-sans">
        <div className="relative flex items-center justify-center mb-5">
          <div className="w-14 h-14 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <span className="absolute text-xl">🌱</span>
        </div>
        <h2 className="text-xl font-bold font-display tracking-tight text-white">SmartFood Rescue AI</h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <p className="text-xs text-slate-300 font-mono">
            Resolving Firebase Authentication & security session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole,
        setUserRole: handleSetUserRole,
        loading: authLoading,
        logout: handleLogout,
        signInDemoRole: handleSignInDemoRole
      }}
    >
      <AppProvider>
        <AppShell />
      </AppProvider>
    </AuthContext.Provider>
  );
}

export default App;
