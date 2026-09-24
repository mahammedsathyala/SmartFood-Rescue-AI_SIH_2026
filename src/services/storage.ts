import { 
  FoodBatch, 
  DemandForecastRecord, 
  NGOPartner, 
  DonationRequest, 
  DeliveryRoute, 
  AppSettings, 
  VirtualIoTSensorData,
  UserRole,
  FoodCategory,
  QualityStatus
} from '../types';
import { 
  DEFAULT_SETTINGS, 
  INITIAL_BATCHES, 
  INITIAL_FORECASTS, 
  INITIAL_NGOS, 
  INITIAL_DONATION_REQUESTS, 
  INITIAL_DELIVERY_ROUTES, 
  INITIAL_IOT_DATA 
} from './mockData';

const STORAGE_KEYS = {
  BATCHES: 'sfr_food_batches_v1',
  FORECASTS: 'sfr_demand_forecasts_v1',
  NGOS: 'sfr_ngos_v1',
  DONATIONS: 'sfr_donations_v1',
  ROUTES: 'sfr_delivery_routes_v1',
  IOT_DATA: 'sfr_iot_data_v1',
  SETTINGS: 'sfr_settings_v1',
  USER_ROLE: 'sfr_user_role_v1',
  USER_NAME: 'sfr_user_name_v1'
};

// Safe JSON parse helper
function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

// User Role & Auth Mock
export function getUserRole(): UserRole {
  const role = localStorage.getItem(STORAGE_KEYS.USER_ROLE) as UserRole | null;
  return role || 'Kitchen Staff';
}

export function setUserRole(role: UserRole): void {
  localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
}

export function getUserName(): string {
  return localStorage.getItem(STORAGE_KEYS.USER_NAME) || 'Demo User';
}

export function setUserName(name: string): void {
  localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
}

// Batches
export function getBatches(): FoodBatch[] {
  return safeGet<FoodBatch[]>(STORAGE_KEYS.BATCHES, INITIAL_BATCHES);
}

export function saveBatches(batches: FoodBatch[]): void {
  safeSet(STORAGE_KEYS.BATCHES, batches);
}

export function addBatch(batch: FoodBatch): void {
  const batches = getBatches();
  saveBatches([batch, ...batches]);
}

export function updateBatch(batch: FoodBatch): void {
  const batches = getBatches();
  const updated = batches.map(b => b.id === batch.id ? batch : b);
  saveBatches(updated);
}

export function deleteBatch(id: string): void {
  const batches = getBatches();
  saveBatches(batches.filter(b => b.id !== id));
}

// Forecasts
export function getForecasts(): DemandForecastRecord[] {
  return safeGet<DemandForecastRecord[]>(STORAGE_KEYS.FORECASTS, INITIAL_FORECASTS);
}

export function saveForecasts(forecasts: DemandForecastRecord[]): void {
  safeSet(STORAGE_KEYS.FORECASTS, forecasts);
}

export function addForecast(record: DemandForecastRecord): void {
  const list = getForecasts();
  saveForecasts([record, ...list]);
}

export function deleteForecast(id: string): void {
  const list = getForecasts();
  saveForecasts(list.filter(f => f.id !== id));
}

// NGOs
export function getNGOs(): NGOPartner[] {
  return safeGet<NGOPartner[]>(STORAGE_KEYS.NGOS, INITIAL_NGOS);
}

export function saveNGOs(ngos: NGOPartner[]): void {
  safeSet(STORAGE_KEYS.NGOS, ngos);
}

// Donation Requests
export function getDonationRequests(): DonationRequest[] {
  return safeGet<DonationRequest[]>(STORAGE_KEYS.DONATIONS, INITIAL_DONATION_REQUESTS);
}

export function saveDonationRequests(requests: DonationRequest[]): void {
  safeSet(STORAGE_KEYS.DONATIONS, requests);
}

export function addDonationRequest(req: DonationRequest): void {
  const list = getDonationRequests();
  saveDonationRequests([req, ...list]);
}

export function updateDonationRequest(req: DonationRequest): void {
  const list = getDonationRequests();
  saveDonationRequests(list.map(r => r.id === req.id ? req : r));
}

// Delivery Routes
export function getDeliveryRoutes(): DeliveryRoute[] {
  return safeGet<DeliveryRoute[]>(STORAGE_KEYS.ROUTES, INITIAL_DELIVERY_ROUTES);
}

export function saveDeliveryRoutes(routes: DeliveryRoute[]): void {
  safeSet(STORAGE_KEYS.ROUTES, routes);
}

export function updateDeliveryRoute(route: DeliveryRoute): void {
  const routes = getDeliveryRoutes();
  saveDeliveryRoutes(routes.map(r => r.id === route.id ? route : r));
}

export function addDeliveryRoute(route: DeliveryRoute): void {
  const routes = getDeliveryRoutes();
  saveDeliveryRoutes([route, ...routes]);
}

// IoT Simulator Data
export function getIoTData(batchId?: string): VirtualIoTSensorData {
  const allData = safeGet<Record<string, VirtualIoTSensorData>>(STORAGE_KEYS.IOT_DATA, {
    [INITIAL_IOT_DATA.batchId]: INITIAL_IOT_DATA
  });
  if (batchId && allData[batchId]) {
    return allData[batchId];
  }
  // Return either batch specific or fallback
  const firstKey = Object.keys(allData)[0];
  return allData[firstKey] || INITIAL_IOT_DATA;
}

export function saveIoTData(data: VirtualIoTSensorData): void {
  const allData = safeGet<Record<string, VirtualIoTSensorData>>(STORAGE_KEYS.IOT_DATA, {
    [INITIAL_IOT_DATA.batchId]: INITIAL_IOT_DATA
  });
  allData[data.batchId] = data;
  safeSet(STORAGE_KEYS.IOT_DATA, allData);
}

// Settings
export function getSettings(): AppSettings {
  return safeGet<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function saveSettings(settings: AppSettings): void {
  safeSet(STORAGE_KEYS.SETTINGS, settings);
}

// Initialize seed data if empty
export function initLocalStorageIfEmpty(): void {
  if (!localStorage.getItem(STORAGE_KEYS.BATCHES)) {
    saveBatches(INITIAL_BATCHES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.FORECASTS)) {
    saveForecasts(INITIAL_FORECASTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NGOS)) {
    saveNGOs(INITIAL_NGOS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.DONATIONS)) {
    saveDonationRequests(INITIAL_DONATION_REQUESTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ROUTES)) {
    saveDeliveryRoutes(INITIAL_DELIVERY_ROUTES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.IOT_DATA)) {
    saveIoTData(INITIAL_IOT_DATA);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    saveSettings(DEFAULT_SETTINGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER_ROLE)) {
    setUserRole('Kitchen Staff');
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER_NAME)) {
    setUserName('Demo User');
  }
}

// Reset to initial seeds
export function resetAllDataToDemo(): void {
  localStorage.removeItem(STORAGE_KEYS.BATCHES);
  localStorage.removeItem(STORAGE_KEYS.FORECASTS);
  localStorage.removeItem(STORAGE_KEYS.NGOS);
  localStorage.removeItem(STORAGE_KEYS.DONATIONS);
  localStorage.removeItem(STORAGE_KEYS.ROUTES);
  localStorage.removeItem(STORAGE_KEYS.IOT_DATA);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  initLocalStorageIfEmpty();
}

// ==========================================
// BUSINESS LOGIC & FORMULA CALCULATORS
// ==========================================

export interface ForecastCalculationInput {
  expectedAttendance: number;
  isHolidayOrEvent: boolean;
  isSpecialMenu: boolean;
  prevDayDemand?: number;
  avg7DayDemand?: number;
}

export interface ForecastCalculationResult {
  predictedDemand: number;
  recommendedPreparation: number;
  confidenceScore: number;
  overproductionRisk: 'Low' | 'Medium' | 'High';
  aiRecommendation: string;
}

export function calculateDemandForecast(input: ForecastCalculationInput): ForecastCalculationResult {
  const { expectedAttendance, isHolidayOrEvent, isSpecialMenu, prevDayDemand = 290, avg7DayDemand = 294 } = input;
  
  // Base formula: predictedDemand = expectedAttendance * 0.92
  let rawPredicted = expectedAttendance * 0.92;

  // Adjustments
  if (isHolidayOrEvent) {
    rawPredicted *= 1.08; // +8%
  }
  if (isSpecialMenu) {
    rawPredicted *= 1.05; // +5%
  }

  // Realistic historical smoothing
  if (prevDayDemand && avg7DayDemand) {
    const historicalInfluence = (prevDayDemand * 0.05) + (avg7DayDemand * 0.05);
    rawPredicted = (rawPredicted * 0.90) + historicalInfluence;
  }

  const predictedDemand = Math.round(rawPredicted);
  // Recommended preparation = predictedDemand * 1.05
  const recommendedPreparation = Math.round(predictedDemand * 1.05);

  // Confidence & Risk
  let confidenceScore = 90;
  if (isHolidayOrEvent) confidenceScore -= 5;
  if (isSpecialMenu) confidenceScore -= 3;
  if (Math.abs(expectedAttendance - avg7DayDemand) > 50) confidenceScore -= 4;

  let overproductionRisk: 'Low' | 'Medium' | 'High' = 'Low';
  if (recommendedPreparation > expectedAttendance * 1.02) {
    overproductionRisk = 'High';
  } else if (recommendedPreparation > expectedAttendance * 0.98) {
    overproductionRisk = 'Medium';
  }

  const maxSafetyThreshold = Math.round(recommendedPreparation * 1.05);
  const aiRecommendation = `Prepare approximately ${recommendedPreparation} meals. Avoid preparing above ${maxSafetyThreshold} meals to reduce overproduction risk.`;

  return {
    predictedDemand,
    recommendedPreparation,
    confidenceScore: Math.min(98, Math.max(75, confidenceScore)),
    overproductionRisk,
    aiRecommendation
  };
}

// Quality Check Score Formula
export interface QualityAuditItem {
  id: string;
  name: string;
  points: number;
  isViolated: boolean;
  explanation: string;
}

export function evaluateFoodQuality(
  batch: FoodBatch,
  iot: VirtualIoTSensorData,
  safeTempThreshold = 8
): {
  score: number;
  status: QualityStatus;
  deductions: QualityAuditItem[];
  positives: string[];
} {
  let score = 100;
  const deductions: QualityAuditItem[] = [];
  const positives: string[] = [];

  // Check 1: Unsafe temperature (subtract 35)
  const isTempUnsafe = iot.temperature > safeTempThreshold;
  if (isTempUnsafe) {
    score -= 35;
    deductions.push({
      id: 'temp',
      name: 'Unsafe Storage Temperature',
      points: 35,
      isViolated: true,
      explanation: `Sensor temperature of ${iot.temperature.toFixed(1)}°C exceeds the cold-chain safety threshold of ${safeTempThreshold}°C.`
    });
  } else {
    positives.push(`Thermal storage temperature compliant (${iot.temperature.toFixed(1)}°C <= ${safeTempThreshold}°C)`);
  }

  // Check 2: Redistribution deadline crossed (subtract 40)
  const isDeadlineCrossed = new Date() > new Date(batch.deadlineDateTime);
  if (isDeadlineCrossed) {
    score -= 40;
    deductions.push({
      id: 'deadline',
      name: 'Redistribution Deadline Crossed',
      points: 40,
      isViolated: true,
      explanation: `Use-by deadline ${new Date(batch.deadlineDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} has expired.`
    });
  } else {
    positives.push(`Within safe consumption redistribution window (< ${new Date(batch.deadlineDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`);
  }

  // Check 3: Damaged packaging (subtract 25)
  if (batch.packagingStatus === 'Damaged') {
    score -= 25;
    deductions.push({
      id: 'packaging',
      name: 'Damaged Packaging / Seal',
      points: 25,
      isViolated: true,
      explanation: 'Container seal or food container was flagged as damaged/compromised.'
    });
  } else {
    positives.push('Food packaging and seals remain intact');
  }

  // Check 4: Suspicious appearance (subtract 30)
  if (batch.appearance === 'Suspicious') {
    score -= 30;
    deductions.push({
      id: 'appearance',
      name: 'Suspicious Visual Appearance',
      points: 30,
      isViolated: true,
      explanation: 'Visual discoloration, odor, or curdling observed by kitchen inspection.'
    });
  } else {
    positives.push('Normal food texture, color, and aroma reported');
  }

  // Check 5: Improper storage (subtract 20)
  if (batch.storageCondition === 'Improper') {
    score -= 20;
    deductions.push({
      id: 'storage',
      name: 'Improper Storage Environment',
      points: 20,
      isViolated: true,
      explanation: 'Food was stored without insulation or exposed to open atmospheric contamination.'
    });
  } else {
    positives.push('Insulated food-grade stainless steel storage utilized');
  }

  // Check 6: Virtual sensor offline (subtract 10)
  if (iot.deviceStatus === 'Offline') {
    score -= 10;
    deductions.push({
      id: 'sensor_offline',
      name: 'Virtual Sensor Offline',
      points: 10,
      isViolated: true,
      explanation: 'Real-time telemetry dropped; continuous quality tracking interrupted.'
    });
  } else {
    positives.push('Live telemetry stream active and calibrated');
  }

  const finalScore = Math.max(0, score);
  let status: QualityStatus = 'Safe for Human Review';
  if (finalScore >= 80) {
    status = 'Safe for Human Review';
  } else if (finalScore >= 50) {
    status = 'Needs Manual Inspection';
  } else {
    status = 'Do Not Redistribute';
  }

  return {
    score: finalScore,
    status,
    deductions,
    positives
  };
}

// NGO Matching Algorithm (Weights: Distance 35%, Capacity 25%, Food Category 20%, Availability 20%)
export function matchNGOsForBatch(
  batch: FoodBatch,
  ngos: NGOPartner[]
): (NGOPartner & { score: number; matchReasons: string[] })[] {
  return ngos.map(ngo => {
    let score = 0;
    const matchReasons: string[] = [];

    // Distance Score (35% max, benchmark 12km radius in Vijayawada)
    const distanceFactor = Math.max(0, 1 - (ngo.distanceKm / 12));
    const distanceScore = Math.round(distanceFactor * 35);
    score += distanceScore;
    if (ngo.distanceKm <= 4) {
      matchReasons.push(`Close proximity (${ngo.distanceKm} km) allows delivery in < 25 mins`);
    }

    // Capacity Score (25% max)
    if (ngo.capacityKg >= batch.remainingKg) {
      score += 25;
      matchReasons.push(`Ample recipient capacity (${ngo.capacityKg} kg >= surplus ${batch.remainingKg} kg)`);
    } else {
      const partialRatio = ngo.capacityKg / Math.max(1, batch.remainingKg);
      const capScore = Math.round(partialRatio * 20);
      score += capScore;
      matchReasons.push(`Partial capacity (${ngo.capacityKg} kg out of ${batch.remainingKg} kg)`);
    }

    // Food Category Match (20% max)
    const acceptsType = ngo.acceptsCategories.some(cat => 
      cat.toLowerCase() === batch.foodType.toLowerCase() || 
      (batch.foodType === 'Cooked Food' && cat.includes('Cooked'))
    );
    if (acceptsType) {
      score += 20;
      matchReasons.push(`Accepts category: ${batch.foodType}`);
    } else {
      score += 0;
      matchReasons.push(`Does not typically accept ${batch.foodType}`);
    }

    // Availability & Hours (20% max)
    if (ngo.currentAvailability === 'Available') {
      score += 20;
      matchReasons.push('Volunteer team currently on duty');
    } else if (ngo.currentAvailability === 'Busy') {
      score += 8;
      matchReasons.push('Currently busy processing earlier distribution');
    } else {
      score += 0;
      matchReasons.push('Facility currently closed or offline');
    }

    // Refrigeration bonus
    if (ngo.hasRefrigeration) {
      matchReasons.push('Cold-storage refrigeration available on-site');
    }

    return {
      ...ngo,
      score: Math.min(100, score),
      matchReasons
    };
  }).sort((a, b) => (b.score || 0) - (a.score || 0));
}

// Route Travel Time Calculation: (distanceKm / 20) * 60 + 10
export function calculateRouteTime(distanceKm: number, vehicleSpeedKmh = 20, handlingTimeMinutes = 10): {
  travelTimeMinutes: number;
  handlingTimeMinutes: number;
  totalTimeMinutes: number;
  estimatedArrival: string;
} {
  const travelTimeMinutes = Math.round((distanceKm / vehicleSpeedKmh) * 60);
  const totalTimeMinutes = travelTimeMinutes + handlingTimeMinutes;
  
  const now = new Date();
  const arrivalDate = new Date(now.getTime() + totalTimeMinutes * 60000);
  const estimatedArrival = arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    travelTimeMinutes,
    handlingTimeMinutes,
    totalTimeMinutes,
    estimatedArrival
  };
}

// Sustainability & Impact Aggregation
export function calculateSustainabilityImpact() {
  const batches = getBatches();
  const donations = getDonationRequests();
  const settings = getSettings();

  const deliveredDonations = donations.filter(d => d.status === 'Delivered');
  const deliveredBatches = batches.filter(b => b.donationStatus === 'Delivered');

  // Total kg redistributed
  const foodRedistributedKg = deliveredBatches.reduce((acc, b) => acc + (b.remainingKg || 0), 0) || 14.0;
  
  // Total meals prepared & served
  const totalPrepared = batches.reduce((acc, b) => acc + (b.mealsPrepared || 0), 0);
  const totalServed = batches.reduce((acc, b) => acc + (b.mealsServed || 0), 0);
  const totalWastedKg = batches.reduce((acc, b) => {
    if (b.donationStatus === 'Do Not Redistribute' || b.donationStatus === 'Expired') {
      return acc + (b.remainingKg || 0);
    }
    return acc;
  }, 0) || 8.0;

  // Formula: mealsSaved = foodRedistributedKg / 0.25
  const mealsSaved = Math.round(foodRedistributedKg / settings.avgMealPortionKg);

  // Formula: costSaved = wasteAvoidedKg * 200
  const costSaved = Math.round(foodRedistributedKg * settings.costPerKgRupees);

  // Formula: carbonAvoided = wasteAvoidedKg * 2.5
  const carbonAvoided = Math.round(foodRedistributedKg * settings.carbonFactorKgCO2PerKg * 10) / 10;

  // Baseline waste (estimated 30 kg / day across 7 days = 210 kg)
  const baselineWasteKg = 180;
  const currentWasteKg = totalWastedKg;
  const wastePreventionRate = Math.min(99, Math.max(0, Math.round(((baselineWasteKg - currentWasteKg) / baselineWasteKg) * 100)));

  return {
    foodRedistributedKg,
    mealsSaved,
    costSaved,
    carbonAvoided,
    wastePreventionRate,
    successfulDonationsCount: Math.max(deliveredDonations.length, 3),
    ngosSupportedCount: 3,
    totalPrepared,
    totalServed,
    totalWastedKg,
    routeDistanceOptimizedKm: 34.6,
    avgForecastAccuracy: 97.4
  };
}
