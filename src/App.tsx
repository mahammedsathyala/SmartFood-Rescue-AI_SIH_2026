import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  NavigationTab, 
  FoodBatch, 
  DemandForecastRecord, 
  NGOPartner, 
  DonationRequest, 
  DeliveryRoute, 
  VirtualIoTSensorData, 
  AppSettings, 
  ToastMessage 
} from './types';
import { 
  initLocalStorageIfEmpty, 
  getBatches, 
  saveBatches, 
  getForecasts, 
  saveForecasts, 
  getNGOs, 
  saveNGOs, 
  getDonationRequests, 
  saveDonationRequests, 
  getDeliveryRoutes, 
  saveDeliveryRoutes, 
  getIoTData, 
  saveIoTData, 
  getSettings, 
  saveSettings, 
  getUserRole, 
  setUserRole, 
  getUserName, 
  setUserName,
  resetAllDataToDemo 
} from './services/storage';

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

export function App() {
  // App view level: 'landing' | 'role-selection' | 'app'
  const [viewMode, setViewMode] = useState<'landing' | 'role-selection' | 'app'>('landing');
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');

  // App state
  const [activeRole, setActiveRoleState] = useState<UserRole>('Kitchen Staff');
  const [userName, setUserNameState] = useState<string>('Demo User');
  const [batches, setBatches] = useState<FoodBatch[]>([]);
  const [forecasts, setForecasts] = useState<DemandForecastRecord[]>([]);
  const [ngos, setNgos] = useState<NGOPartner[]>([]);
  const [donations, setDonations] = useState<DonationRequest[]>([]);
  const [routes, setRoutes] = useState<DeliveryRoute[]>([]);
  const [iotData, setIotData] = useState<VirtualIoTSensorData | null>(null);
  const [settings, setAppSettings] = useState<AppSettings | null>(null);

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

  // Initialize data on mount
  useEffect(() => {
    initLocalStorageIfEmpty();
    setActiveRoleState(getUserRole());
    setUserNameState(getUserName());
    setBatches(getBatches());
    setForecasts(getForecasts());
    setNgos(getNGOs());
    setDonations(getDonationRequests());
    setRoutes(getDeliveryRoutes());
    setIotData(getIoTData());
    setAppSettings(getSettings());
  }, []);

  // Toast Helper
  const showToast = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts(prev => [...prev, { id, title, message, type }]);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Role changes
  const handleRoleChange = (role: UserRole) => {
    setActiveRoleState(role);
    setUserRole(role);
    setUserNameState('Demo User');
    setUserName('Demo User');
    showToast('Role Switched', `Logged in as ${role} (Demo User).`, 'info');
  };

  const handleSelectRoleFromLanding = (role: UserRole) => {
    handleRoleChange(role);
    setViewMode('app');
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setViewMode('role-selection');
    showToast('Logged Out', 'Returned to role selection page.', 'info');
  };

  // Reset demo data
  const handleConfirmResetData = () => {
    resetAllDataToDemo();
    setActiveRoleState(getUserRole());
    setBatches(getBatches());
    setForecasts(getForecasts());
    setNgos(getNGOs());
    setDonations(getDonationRequests());
    setRoutes(getDeliveryRoutes());
    setIotData(getIoTData());
    setAppSettings(getSettings());
    showToast('Data Reset', 'All records restored to canonical Vijayawada demo scenario.', 'success');
  };

  // Batch Handlers
  const handleAddBatch = (batch: FoodBatch) => {
    const updated = [batch, ...batches];
    setBatches(updated);
    saveBatches(updated);
  };

  const handleUpdateBatch = (batch: FoodBatch) => {
    const updated = batches.map(b => b.id === batch.id ? batch : b);
    setBatches(updated);
    saveBatches(updated);
  };

  const handleDeleteBatch = (id: string) => {
    const updated = batches.filter(b => b.id !== id);
    setBatches(updated);
    saveBatches(updated);
    showToast('Batch Deleted', 'Batch record removed.', 'info');
  };

  // Forecast Handlers
  const handleAddForecast = (forecast: DemandForecastRecord) => {
    const updated = [forecast, ...forecasts];
    setForecasts(updated);
    saveForecasts(updated);
  };

  const handleDeleteForecast = (id: string) => {
    const updated = forecasts.filter(f => f.id !== id);
    setForecasts(updated);
    saveForecasts(updated);
    showToast('Record Deleted', 'Demand forecast entry removed.', 'info');
  };

  // IoT Simulator Handlers
  const handleUpdateIoT = (data: VirtualIoTSensorData) => {
    setIotData(data);
    saveIoTData(data);
  };

  // Donation Handlers
  const handleAddDonation = (req: DonationRequest) => {
    const updated = [req, ...donations];
    setDonations(updated);
    saveDonationRequests(updated);
  };

  const handleUpdateDonation = (req: DonationRequest) => {
    const updated = donations.map(d => d.id === req.id ? req : d);
    setDonations(updated);
    saveDonationRequests(updated);
  };

  // Route Handlers
  const handleUpdateRoute = (route: DeliveryRoute) => {
    const updated = routes.map(r => r.id === route.id ? route : r);
    setRoutes(updated);
    saveDeliveryRoutes(updated);
  };

  // Settings Handlers
  const handleSaveSettings = (newSettings: AppSettings) => {
    setAppSettings(newSettings);
    saveSettings(newSettings);
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

  // Surplus count for sidebar badge
  const activeSurplusCount = batches.filter(b => b.remainingKg > 0 && b.donationStatus !== 'Do Not Redistribute').length;

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
    'settings': 'Kitchen & System Settings'
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
            onRoleChange={handleRoleChange}
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
            {/* View Switching */}
            {currentTab === 'dashboard' && iotData && (
              <DashboardPage
                batches={batches}
                forecasts={forecasts}
                ngos={ngos}
                donations={donations}
                routes={routes}
                iotData={iotData}
                activeRole={activeRole}
                onNavigate={(t) => setCurrentTab(t)}
                onOpenAddBatch={handleOpenAddBatchQuick}
                onSelectBatchForQuality={handleNavigateToQuality}
                onSelectBatchForNgo={handleNavigateToNgo}
                settings={settings}
              />
            )}

            {currentTab === 'demand-forecast' && (
              <DemandForecastPage
                forecasts={forecasts}
                onAddForecast={handleAddForecast}
                onDeleteForecast={handleDeleteForecast}
                showToast={showToast}
              />
            )}

            {currentTab === 'food-batches' && (
              <FoodBatchesPage
                batches={batches}
                onAddBatch={handleAddBatch}
                onUpdateBatch={handleUpdateBatch}
                onDeleteBatch={handleDeleteBatch}
                onStartQualityCheck={handleNavigateToQuality}
                onCreateDonation={handleNavigateToNgo}
                isAddModalOpenInitially={isAddBatchModalOpenInitially}
                showToast={showToast}
              />
            )}

            {currentTab === 'iot-simulator' && iotData && (
              <IoTSimulatorPage
                batches={batches}
                iotData={iotData}
                onUpdateIoT={handleUpdateIoT}
                showToast={showToast}
              />
            )}

            {currentTab === 'quality-check' && iotData && (
              <QualityCheckPage
                batches={batches}
                iotData={iotData}
                activeRole={activeRole}
                selectedBatchIdInitially={targetBatchIdForQuality}
                onUpdateBatch={handleUpdateBatch}
                onProceedToNgoMatching={handleNavigateToNgo}
                showToast={showToast}
              />
            )}

            {currentTab === 'ngo-matching' && (
              <NgoMatchingPage
                batches={batches}
                ngos={ngos}
                donations={donations}
                activeRole={activeRole}
                selectedBatchIdInitially={targetBatchIdForNgo}
                onAddDonationRequest={handleAddDonation}
                onUpdateDonationRequest={handleUpdateDonation}
                onUpdateBatch={handleUpdateBatch}
                onProceedToRoutePlanning={handleNavigateToRoute}
                showToast={showToast}
                settings={settings}
              />
            )}

            {currentTab === 'route-planning' && (
              <RoutePlanningPage
                routes={routes}
                batches={batches}
                donations={donations}
                ngos={ngos}
                activeRole={activeRole}
                selectedDonationIdInitially={targetDonationIdForRoute}
                onUpdateRoute={handleUpdateRoute}
                onUpdateBatch={handleUpdateBatch}
                onUpdateDonation={handleUpdateDonation}
                showToast={showToast}
                settings={settings}
              />
            )}

            {currentTab === 'sustainability' && (
              <SustainabilityPage showToast={showToast} />
            )}

            {currentTab === 'reports' && (
              <ReportsPage
                batches={batches}
                forecasts={forecasts}
                ngos={ngos}
                donations={donations}
                showToast={showToast}
              />
            )}

            {currentTab === 'settings' && settings && (
              <SettingsPage
                settings={settings}
                onSaveSettings={handleSaveSettings}
                onResetAllData={() => setIsResetModalOpen(true)}
                showToast={showToast}
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
        onSwitchRole={handleRoleChange}
      />
    </div>
  );
}
export default App;
