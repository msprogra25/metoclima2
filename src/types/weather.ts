export type AlertSeverity = 'critical' | 'severe' | 'warning' | 'info';

export type HazardType = 
  | 'storm'         // Tempestade severa
  | 'flood'         // Inundação / Alagamento
  | 'landslide'     // Deslizamento de terra
  | 'wind'          // Vendaval / Rajadas
  | 'hail';         // Granizo

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface WeatherAlert {
  id: string;
  title: string;
  hazardType: HazardType;
  severity: AlertSeverity;
  headline: string;
  description: string;
  safetyInstructions: string[];
  affectedAreas: string[];
  centerCoordinates: Coordinates;
  radiusKm: number;
  issuedAt: string;
  expiresAt: string;
  precipitationExpectedMm: number;
  windSpeedKmh: number;
  riverLevelStatus?: 'normal' | 'alert' | 'overflow';
  source: string; // e.g. Defesa Civil / CEMADEN / INMET
}

export interface StormTrajectoryPoint {
  timeOffsetMin: number; // e.g. -60, -30, 0 (now), +30, +60
  timeLabel: string;
  lat: number;
  lng: number;
  intensityDbr: number; // Radar reflectivity in dBZ (e.g. 55 dBZ = severe rain/hail)
  speedKmh: number;
  probabilityPercent: number;
}

export interface StormCell {
  id: string;
  name: string;
  hazardType: HazardType;
  severity: AlertSeverity;
  currentLat: number;
  currentLng: number;
  headingDegrees: number;
  speedKmh: number;
  intensityDbr: number;
  rainRateMmH: number;
  windGustsKmh: number;
  trajectory: StormTrajectoryPoint[];
  coneAngleDeg: number;
}

export interface FloodRiskZone {
  id: string;
  name: string;
  basin: string;
  riskLevel: 'critical' | 'high' | 'moderate';
  currentWaterLevelM: number;
  overflowThresholdM: number;
  historyOfFlooding: string;
  polygon: Coordinates[];
}

export interface RiverGauge {
  id: string;
  riverName: string;
  stationName: string;
  lat: number;
  lng: number;
  currentLevelM: number;
  alertLevelM: number;
  overflowLevelM: number;
  status: 'normal' | 'attention' | 'alert' | 'overflow';
  trend: 'rising' | 'stable' | 'falling';
  updatedAt: string;
}

export interface SafetyShelter {
  id: string;
  name: string;
  address: string;
  capacity: number;
  currentOccupancy: number;
  status: 'open' | 'standby' | 'full';
  phone: string;
  lat: number;
  lng: number;
}

export interface OccurrenceHistoryItem {
  id: string;
  title: string;
  date: string;
  year: number;
  month: number;
  hazardType: HazardType;
  severity: AlertSeverity;
  region: string;
  rainfallAccumulationMm: number;
  peakRiverLevelM?: number;
  affectedPeople: number;
  economicImpactBrl?: string;
  description: string;
  mitigationNotes: string;
}

export interface ClimateTrendData {
  year: number;
  totalRainfallMm: number;
  historicalAverageMm: number;
  extremeEventsCount: number;
  floodOccurrences: number;
  severeStormsCount: number;
  maxDailyRainMm: number;
}

export interface MonthlyRainfall {
  month: string;
  observedMm: number;
  climatologicalBaselineMm: number;
  anomalyPercent: number;
}

export interface UserLocationPreference {
  cityName: string;
  stateCode: string;
  lat: number;
  lng: number;
  isAutoGps: boolean;
}

export interface PushNotificationSettings {
  enabled: boolean;
  minSeverity: AlertSeverity;
  radiusKm: number;
  soundEnabled: boolean;
  vibrateEnabled: boolean;
  notifyStorms: boolean;
  notifyFloods: boolean;
  notifyLandslides: boolean;
  notifyHighWinds: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // e.g. "22:00"
  quietHoursEnd: string;   // e.g. "06:00"
}
