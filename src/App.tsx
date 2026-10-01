import { useState, useEffect } from 'react';
import { useNightMode } from './hooks/useNightMode';
import {
  WeatherAlert,
  StormCell,
  FloodRiskZone,
  RiverGauge,
  SafetyShelter,
  UserLocationPreference,
  PushNotificationSettings
} from './types/weather';
import {
  SUPPORTED_REGIONS,
  INITIAL_ALERTS,
  INITIAL_STORM_CELLS,
  FLOOD_RISK_ZONES,
  RIVER_GAUGES,
  SAFETY_SHELTERS,
  DEFAULT_PUSH_SETTINGS
} from './data/mockWeatherData';
import { notificationService } from './services/notificationService';

import { Header } from './components/Header';
import { LiveAlertBanner } from './components/LiveAlertBanner';
import { WeatherMap } from './components/Map/WeatherMap';
import { SatelliteSpotlight } from './components/Map/SatelliteSpotlight';
import { AlertsPanel } from './components/Alerts/AlertsPanel';
import { SafetyGuide } from './components/Safety/SafetyGuide';
import { HistoryTrends } from './components/History/HistoryTrends';
import { NotificationSettingsModal } from './components/Notifications/NotificationSettingsModal';
import { PushToast } from './components/Notifications/PushToast';
import { SimulateAlertModal } from './components/SimulateAlertModal';

import {
  ShieldAlert,
  Waves,
  Zap,
  Radio,
  Sliders,
  Sparkles,
  MapPin,
  TrendingUp,
  Activity,
  PhoneCall,
  BellRing
} from 'lucide-react';

export default function App() {
  const { preference: nightModePref, isDark, setPreference: setNightModePref } = useNightMode();

  // Navigation
  const [activeTab, setActiveTab] = useState<'map' | 'alerts' | 'safety' | 'history'>('map');

  // User location preference
  const [userLocation, setUserLocation] = useState<UserLocationPreference>(() => {
    if (typeof window === 'undefined') return SUPPORTED_REGIONS[0];
    try {
      const saved = localStorage.getItem('meteo_user_location');
      return saved ? JSON.parse(saved) : SUPPORTED_REGIONS[0];
    } catch {
      return SUPPORTED_REGIONS[0];
    }
  });

  // Push Notification settings
  const [pushSettings, setPushSettings] = useState<PushNotificationSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_PUSH_SETTINGS;
    try {
      const saved = localStorage.getItem('meteo_push_settings');
      return saved ? JSON.parse(saved) : DEFAULT_PUSH_SETTINGS;
    } catch {
      return DEFAULT_PUSH_SETTINGS;
    }
  });

  // Dynamic Weather Data State
  const [alerts, setAlerts] = useState<WeatherAlert[]>(INITIAL_ALERTS);
  const [stormCells] = useState<StormCell[]>(INITIAL_STORM_CELLS);
  const [floodZones] = useState<FloodRiskZone[]>(FLOOD_RISK_ZONES);
  const [riverGauges] = useState<RiverGauge[]>(RIVER_GAUGES);
  const [shelters] = useState<SafetyShelter[]>(SAFETY_SHELTERS);

  // Modals & Banners
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<{ alert: WeatherAlert; timestamp: string } | null>(null);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  // Most critical alert for banner
  const topCriticalAlert = alerts.find((a) => a.severity === 'critical') || null;

  // Persist location
  const handleUpdateLocation = (loc: UserLocationPreference) => {
    setUserLocation(loc);
    try {
      localStorage.setItem('meteo_user_location', JSON.stringify(loc));
    } catch {}
  };

  // Persist push settings
  const handleSavePushSettings = (settings: PushNotificationSettings) => {
    setPushSettings(settings);
    try {
      localStorage.setItem('meteo_push_settings', JSON.stringify(settings));
    } catch {}
  };

  // Trigger test push
  const handleTriggerPushAlert = (alert: WeatherAlert) => {
    notificationService.sendPushNotification(alert, userLocation.cityName);
    setActiveToast({
      alert,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    });
  };

  // Add new simulated event
  const handleAddSimulatedAlert = (newAlert: WeatherAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);
    setIsBannerDismissed(false);
    handleTriggerPushAlert(newAlert);
  };

  const criticalAlertsCount = alerts.filter((a) => a.severity === 'critical').length;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      {/* Top Bar Contract Compliant Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        nightMode={nightModePref}
        onSetNightMode={setNightModePref}
        userLocation={userLocation}
        onOpenNotificationsModal={() => setIsNotifModalOpen(true)}
        criticalAlertsCount={criticalAlertsCount}
      />

      {/* Urgent Warning Banner */}
      {!isBannerDismissed && topCriticalAlert && (
        <LiveAlertBanner
          alert={topCriticalAlert}
          onViewDetails={() => {
            setActiveTab('alerts');
          }}
          onDismiss={() => setIsBannerDismissed(true)}
        />
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Quick Action Sub-bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-1 font-semibold text-neutral-900 dark:text-neutral-100">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              {userLocation.cityName} ({userLocation.stateCode})
            </span>
            <span aria-hidden="true">·</span>
            <span>Raio de Alerta: {pushSettings.radiusKm} km</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Radar Operacional
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSimulateModalOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs font-medium flex items-center gap-1.5 shadow-sm"
              title="Testar simulação de tempestades ou inundações em tempo real"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulador de Tempestades</span>
            </button>

            <button
              onClick={() => setIsNotifModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors text-xs font-medium flex items-center gap-1.5 shadow-sm"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>Personalizar Notificações</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Map & Trajectories */}
        {activeTab === 'map' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Map Canvas (3 cols) */}
              <div className="lg:col-span-3 space-y-4">
                <WeatherMap
                  userLocation={userLocation}
                  stormCells={stormCells}
                  floodZones={floodZones}
                  riverGauges={riverGauges}
                  shelters={shelters}
                  isDark={isDark}
                  onSelectStorm={(storm) => {
                    // Quick feedback
                  }}
                  onSelectFloodZone={(zone) => {
                    // Quick feedback
                  }}
                />
              </div>

              {/* Sidebar with Satellite & Quick Telemetry (1 col) */}
              <div className="space-y-4">
                {/* Satellite Radar Spotlight with Generated Asset */}
                <SatelliteSpotlight isDark={isDark} />

                {/* River Basin Gauges Quick Telemetry */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                      <Waves className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                      Nível de Rios em Tempo Real
                    </h4>
                    <span className="text-[10px] text-neutral-400 font-mono">18:04</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {riverGauges.map((gauge) => (
                      <div
                        key={gauge.id}
                        className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100">{gauge.riverName}</p>
                          <p className="text-[10px] text-neutral-500">{gauge.stationName}</p>
                        </div>
                        <div className="text-right font-mono tabular-nums">
                          <span
                            className={`font-bold block ${
                              gauge.status === 'overflow'
                                ? 'text-red-600 dark:text-red-400'
                                : gauge.status === 'alert'
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-emerald-700 dark:text-emerald-400'
                            }`}
                          >
                            {gauge.currentLevelM.toFixed(2)}m
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            Cota: {gauge.overflowLevelM.toFixed(2)}m
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Emergency Dispatch Box */}
                <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/30 dark:bg-emerald-950/20 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Plantão da Defesa Civil</span>
                  </div>
                  <p className="text-emerald-950/80 dark:text-emerald-300/80 text-[11px] leading-relaxed">
                    Alagamento na sua rua ou trincas em encostas? Ligue gratuitamente para o número oficial de emergência.
                  </p>
                  <a
                    href="tel:199"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition-colors text-xs shadow-sm mt-1"
                  >
                    Ligar Defesa Civil (199)
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Real-time Alerts */}
        {activeTab === 'alerts' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <AlertsPanel
              alerts={alerts}
              onFocusAlert={(alert) => {
                setActiveTab('map');
              }}
              onTriggerTestPush={handleTriggerPushAlert}
            />
          </div>
        )}

        {/* Tab 3: Safety Recommendations */}
        {activeTab === 'safety' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <SafetyGuide />
          </div>
        )}

        {/* Tab 4: Occurrence History & Climate Trends */}
        {activeTab === 'history' && (
          <div className="animate-fade-in max-w-5xl mx-auto">
            <HistoryTrends />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-800 dark:text-neutral-200">MeteoAlerta</span>
            <span>· Sistema de Alerta Meteorológico e Prevenção de Desastres</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Dados integrados: INMET · CEMADEN · Defesa Civil</span>
            <span>·</span>
            <span>Modo Noturno Automático Ativo</span>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <NotificationSettingsModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        settings={pushSettings}
        onSaveSettings={handleSavePushSettings}
        userLocation={userLocation}
        onUpdateLocation={handleUpdateLocation}
      />

      <SimulateAlertModal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
        onTriggerAlert={handleAddSimulatedAlert}
        currentCityName={userLocation.cityName}
      />

      <PushToast
        toast={activeToast}
        onClose={() => setActiveToast(null)}
        onOpenAlert={(alert) => {
          setActiveTab('alerts');
        }}
      />
    </div>
  );
}
