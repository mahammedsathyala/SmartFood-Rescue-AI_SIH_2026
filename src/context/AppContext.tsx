import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  FoodBatch,
  DemandForecastRecord,
  NGOPartner,
  DonationRequest,
  DeliveryRoute,
  VirtualIoTSensorData,
  AppSettings,
  UserRole
} from '../types';
import {
  getBatches,
  saveBatches,
  getForecasts,
  saveForecasts,
  getNGOs,
  getDonationRequests,
  saveDonationRequests,
  getDeliveryRoutes,
  saveDeliveryRoutes,
  getIoTMap,
  saveIoTData,
  getIoTData,
  getSettings,
  saveSettings,
  getUserRole,
  setUserRole,
  getUserName,
  setUserName,
  initLocalStorageIfEmpty,
  resetAllDataToDemo
} from '../services/storage';

export interface AppContextType {
  // Master Entities State
  batches: FoodBatch[];
  donations: DonationRequest[];
  routes: DeliveryRoute[];
  ngos: NGOPartner[];
  forecasts: DemandForecastRecord[];
  iotData: Map<string, VirtualIoTSensorData>;
  settings: AppSettings | null;
  activeRole: UserRole;
  userName: string;
  activeSurplusCount: number;

  // Batch Handlers
  setBatches: React.Dispatch<React.SetStateAction<FoodBatch[]>>;
  handleAddBatch: (batch: FoodBatch) => void;
  handleUpdateBatch: (batch: FoodBatch) => void;
  handleDeleteBatch: (id: string) => void;

  // Forecast Handlers
  setForecasts: React.Dispatch<React.SetStateAction<DemandForecastRecord[]>>;
  handleAddForecast: (forecast: DemandForecastRecord) => void;
  handleDeleteForecast: (id: string) => void;

  // Donation Handlers
  setDonations: React.Dispatch<React.SetStateAction<DonationRequest[]>>;
  handleAddDonation: (req: DonationRequest) => void;
  handleUpdateDonation: (req: DonationRequest) => void;

  // Route Handlers
  setRoutes: React.Dispatch<React.SetStateAction<DeliveryRoute[]>>;
  handleUpdateRoute: (route: DeliveryRoute) => void;
  handleAddRoute: (route: DeliveryRoute) => void;

  // Multi-sensor IoT Handlers
  handleUpdateIoT: (data: VirtualIoTSensorData) => void;
  getBatchIoT: (batchId?: string) => VirtualIoTSensorData;

  // Settings & System Handlers
  handleSaveSettings: (newSettings: AppSettings) => void;
  handleRoleChange: (role: UserRole) => void;
  handleResetData: () => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [batches, setBatches] = useState<FoodBatch[]>([]);
  const [donations, setDonations] = useState<DonationRequest[]>([]);
  const [routes, setRoutes] = useState<DeliveryRoute[]>([]);
  const [ngos, setNgos] = useState<NGOPartner[]>([]);
  const [forecasts, setForecasts] = useState<DemandForecastRecord[]>([]);
  const [iotData, setIotData] = useState<Map<string, VirtualIoTSensorData>>(new Map());
  const [settings, setAppSettings] = useState<AppSettings | null>(null);
  const [activeRole, setActiveRoleState] = useState<UserRole>('Kitchen Staff');
  const [userName, setUserNameState] = useState<string>('Demo User');

  // Load and sync from LocalStorage
  const loadData = useCallback(() => {
    initLocalStorageIfEmpty();
    setActiveRoleState(getUserRole());
    setUserNameState(getUserName());
    setBatches(getBatches());
    setForecasts(getForecasts());
    setNgos(getNGOs());
    setDonations(getDonationRequests());
    setRoutes(getDeliveryRoutes());
    setIotData(getIoTMap());
    setAppSettings(getSettings());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Surplus Count
  const activeSurplusCount = useMemo(() => {
    return batches.filter(b => b.remainingKg > 0 && b.donationStatus !== 'Do Not Redistribute').length;
  }, [batches]);

  // Batch Operations
  const handleAddBatch = useCallback((batch: FoodBatch) => {
    setBatches(prev => {
      const updated = [batch, ...prev];
      saveBatches(updated);
      return updated;
    });
  }, []);

  const handleUpdateBatch = useCallback((batch: FoodBatch) => {
    setBatches(prev => {
      const updated = prev.map(b => b.id === batch.id ? batch : b);
      saveBatches(updated);
      return updated;
    });
  }, []);

  const handleDeleteBatch = useCallback((id: string) => {
    setBatches(prev => {
      const updated = prev.filter(b => b.id !== id);
      saveBatches(updated);
      return updated;
    });
  }, []);

  // Forecast Operations
  const handleAddForecast = useCallback((forecast: DemandForecastRecord) => {
    setForecasts(prev => {
      const updated = [forecast, ...prev];
      saveForecasts(updated);
      return updated;
    });
  }, []);

  const handleDeleteForecast = useCallback((id: string) => {
    setForecasts(prev => {
      const updated = prev.filter(f => f.id !== id);
      saveForecasts(updated);
      return updated;
    });
  }, []);

  // Donation Operations
  const handleAddDonation = useCallback((req: DonationRequest) => {
    setDonations(prev => {
      const updated = [req, ...prev];
      saveDonationRequests(updated);
      return updated;
    });
  }, []);

  const handleUpdateDonation = useCallback((req: DonationRequest) => {
    setDonations(prev => {
      const updated = prev.map(d => d.id === req.id ? req : d);
      saveDonationRequests(updated);
      return updated;
    });
  }, []);

  // Route Operations
  const handleUpdateRoute = useCallback((route: DeliveryRoute) => {
    setRoutes(prev => {
      const updated = prev.map(r => r.id === route.id ? route : r);
      saveDeliveryRoutes(updated);
      return updated;
    });
  }, []);

  const handleAddRoute = useCallback((route: DeliveryRoute) => {
    setRoutes(prev => {
      const updated = [route, ...prev];
      saveDeliveryRoutes(updated);
      return updated;
    });
  }, []);

  // Multi-sensor IoT Operations
  const handleUpdateIoT = useCallback((data: VirtualIoTSensorData) => {
    saveIoTData(data);
    setIotData(prev => {
      const nextMap = new Map(prev);
      nextMap.set(data.batchId, data);
      return nextMap;
    });
  }, []);

  const getBatchIoT = useCallback((batchId?: string): VirtualIoTSensorData => {
    if (batchId && iotData.has(batchId)) {
      return iotData.get(batchId)!;
    }
    return getIoTData(batchId);
  }, [iotData]);

  // Settings & Roles
  const handleSaveSettings = useCallback((newSettings: AppSettings) => {
    setAppSettings(newSettings);
    saveSettings(newSettings);
  }, []);

  const handleRoleChange = useCallback((role: UserRole) => {
    setActiveRoleState(role);
    setUserRole(role);
    setUserNameState('Demo User');
    setUserName('Demo User');
  }, []);

  const handleResetData = useCallback(() => {
    resetAllDataToDemo();
    loadData();
  }, [loadData]);

  const value = useMemo<AppContextType>(() => ({
    batches,
    donations,
    routes,
    ngos,
    forecasts,
    iotData,
    settings,
    activeRole,
    userName,
    activeSurplusCount,
    setBatches,
    handleAddBatch,
    handleUpdateBatch,
    handleDeleteBatch,
    setForecasts,
    handleAddForecast,
    handleDeleteForecast,
    setDonations,
    handleAddDonation,
    handleUpdateDonation,
    setRoutes,
    handleUpdateRoute,
    handleAddRoute,
    handleUpdateIoT,
    getBatchIoT,
    handleSaveSettings,
    handleRoleChange,
    handleResetData,
    refreshData: loadData
  }), [
    batches,
    donations,
    routes,
    ngos,
    forecasts,
    iotData,
    settings,
    activeRole,
    userName,
    activeSurplusCount,
    handleAddBatch,
    handleUpdateBatch,
    handleDeleteBatch,
    handleAddForecast,
    handleDeleteForecast,
    handleAddDonation,
    handleUpdateDonation,
    handleUpdateRoute,
    handleAddRoute,
    handleUpdateIoT,
    getBatchIoT,
    handleSaveSettings,
    handleRoleChange,
    handleResetData,
    loadData
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
