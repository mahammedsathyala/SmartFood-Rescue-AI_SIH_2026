export type UserRole = 
  | 'Kitchen Staff' 
  | 'NGO Partner' 
  | 'Delivery Partner' 
  | 'Administrator';

export type NavigationTab = 
  | 'dashboard' 
  | 'demand-forecast' 
  | 'food-batches' 
  | 'iot-simulator' 
  | 'quality-check' 
  | 'ngo-matching' 
  | 'route-planning' 
  | 'sustainability' 
  | 'reports' 
  | 'settings'
  | 'dataset-management';

export type FoodCategory = 'Rice' | 'Curry' | 'Snacks' | 'Breakfast' | 'Dessert' | 'Other';
export type FoodType = 'Cooked Food' | 'Raw Material' | 'Packaged Food';
export type StorageCondition = 'Proper' | 'Improper';
export type PackagingStatus = 'Intact' | 'Damaged';
export type AppearanceStatus = 'Normal' | 'Suspicious';

export type QualityStatus = 
  | 'Safe for Human Review' 
  | 'Needs Manual Inspection' 
  | 'Do Not Redistribute' 
  | 'Pending Assessment';

export type DonationStatus = 
  | 'Draft' 
  | 'No Surplus' 
  | 'Surplus Detected' 
  | 'Offered' 
  | 'Pending NGO Response' 
  | 'Accepted' 
  | 'Rejected' 
  | 'Pickup Scheduled' 
  | 'Collected' 
  | 'Delivered' 
  | 'Expired' 
  | 'Do Not Redistribute';

export interface FoodBatch {
  id: string;
  foodItem: string;
  category: FoodCategory;
  foodType: FoodType;
  mealsPrepared: number;
  mealsServed: number;
  preparedKg: number;
  servedKg: number;
  remainingKg: number;
  remainingMeals: number;
  prepDateTime: string;
  deadlineDateTime: string;
  storageCondition: StorageCondition;
  packagingStatus: PackagingStatus;
  appearance: AppearanceStatus;
  notes?: string;
  imageUrl?: string;
  qualityScore?: number;
  qualityStatus: QualityStatus;
  donationStatus: DonationStatus;
  matchedNgoId?: string;
  assignedDriver?: string;
  deliveryProofUrl?: string;
}

export interface DemandForecastRecord {
  id: string;
  date: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner';
  foodItem: string;
  category: FoodCategory;
  expectedAttendance: number;
  dayOfWeek: string;
  isHolidayOrEvent: boolean;
  isSpecialMenu: boolean;
  prevDayDemand: number;
  avg7DayDemand: number;
  predictedDemand: number;
  recommendedPreparation: number;
  actualMealsServed?: number;
  confidenceScore: number;
  overproductionRisk: 'Low' | 'Medium' | 'High';
  aiRecommendation: string;
  accuracy?: number;
  status: 'Completed' | 'Pending Actuals';
}

export interface SensorLogItem {
  timestamp: string;
  temp: number;
  humidity: number;
  weight: number;
  status: string;
}

export interface VirtualIoTSensorData {
  batchId: string;
  temperature: number; // °C
  humidity: number; // %
  containerWeight: number; // kg
  storageDurationHours: number;
  hoursRemaining: number;
  deviceStatus: 'Online' | 'Offline';
  lastUpdated: string;
  alertLevel: 'green' | 'yellow' | 'red';
  alertMessage: string;
  readingsHistory: SensorLogItem[];
}

export interface NGOPartner {
  id: string;
  name: string;
  area: string;
  address: string;
  distanceKm: number;
  capacityKg: number;
  currentAvailability: 'Available' | 'Busy' | 'Offline';
  acceptsCategories: string[];
  operatingHours: string;
  phone: string;
  contactPerson: string;
  rating: number;
  hasRefrigeration: boolean;
  score?: number;
  matchReasons?: string[];
}

export interface DonationRequest {
  id: string;
  batchId: string;
  ngoId: string;
  ngoName: string;
  foodItem: string;
  quantityKg: number;
  preparationTime: string;
  deadline: string;
  pickupAddress: string;
  pickupWindow: string;
  qualityStatus: QualityStatus;
  status: DonationStatus;
  notes?: string;
  createdAt: string;
  rejectionReason?: string;
}

export type RouteStep = 1 | 2 | 3 | 4 | 5 | 6; 
// 1: Pickup Requested, 2: NGO Accepted, 3: Driver Assigned, 4: Food Collected, 5: In Transit, 6: Delivered

export interface DeliveryRoute {
  id: string;
  donationId: string;
  batchId: string;
  ngoId: string;
  ngoName: string;
  origin: string;
  destination: string;
  distanceKm: number;
  vehicleType: 'Bike' | 'Auto' | 'Van' | 'Refrigerated Van';
  speedKmh: number;
  travelTimeMinutes: number;
  handlingTimeMinutes: number;
  totalTimeMinutes: number;
  pickupDeadline: string;
  estimatedArrival: string;
  safetyStatus: 'Safe' | 'At Risk' | 'Deadline Missed';
  currentStep: RouteStep;
  driverName?: string;
  driverPhone?: string;
  proofImage?: string;
  completedAt?: string;
}

export interface AppSettings {
  kitchenName: string;
  kitchenAddress: string;
  city: string;
  contactPerson: string;
  phoneNumber: string;
  kitchenCapacity: number;
  defaultRedistributionDeadlineHours: number;
  safeTempThreshold: number;
  avgMealPortionKg: number;
  costPerKgRupees: number;
  carbonFactorKgCO2PerKg: number;
  defaultVehicleSpeedKmh: number;
  emailAlerts: boolean;
  smsAlerts: boolean;
  autoNgoBroadcast: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}
