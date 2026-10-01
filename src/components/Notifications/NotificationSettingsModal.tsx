import { useState } from 'react';
import { PushNotificationSettings, UserLocationPreference } from '../../types/weather';
import { SUPPORTED_REGIONS } from '../../data/mockWeatherData';
import { notificationService } from '../../services/notificationService';
import {
  Bell,
  MapPin,
  Volume2,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Navigation,
  VolumeX,
  X
} from 'lucide-react';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PushNotificationSettings;
  onSaveSettings: (settings: PushNotificationSettings) => void;
  userLocation: UserLocationPreference;
  onUpdateLocation: (location: UserLocationPreference) => void;
}

export function NotificationSettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  userLocation,
  onUpdateLocation,
}: NotificationSettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<PushNotificationSettings>({ ...settings });
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(() => {
    return notificationService.getPermissionStatus();
  });
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const status = await notificationService.requestPermission();
    setPermissionStatus(status);
    if (status === 'granted') {
      setLocalSettings((prev) => ({ ...prev, enabled: true }));
      notificationService.playAlertSound('standard');
    }
  };

  const handleDetectGps = () => {
    if (!('geolocation' in navigator)) {
      setGpsError('Geolocalização não suportada neste navegador.');
      return;
    }

    setIsDetectingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingGps(false);
        const { latitude, longitude } = pos.coords;
        onUpdateLocation({
          cityName: 'Localização Atual (GPS)',
          stateCode: 'BR',
          lat: latitude,
          lng: longitude,
          isAutoGps: true,
        });
      },
      (err) => {
        setIsDetectingGps(false);
        setGpsError('Não foi possível obter sua coordenada via GPS. Selecione sua cidade abaixo.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleTestSound = () => {
    notificationService.playAlertSound('critical');
  };

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-xs text-neutral-700 dark:text-neutral-300">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Notificações Push Personalizadas
              </h3>
              <p className="text-[11px] text-neutral-500">
                Configure alertas em tempo real baseados na sua localização exata.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Push Permission Status Card */}
          <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                {permissionStatus === 'granted' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                )}
                Permissão de Notificações do Navegador
              </span>
              <span className="text-[11px] font-mono text-neutral-500">
                Status: {permissionStatus === 'granted' ? 'Autorizado' : permissionStatus === 'denied' ? 'Bloqueado' : 'Pendente'}
              </span>
            </div>

            {permissionStatus !== 'granted' && (
              <div className="pt-1">
                <p className="text-[11px] text-neutral-500 mb-2">
                  Ative o envio de notificações push na área de trabalho ou celular para receber avisos de tempestades mesmo com o app em segundo plano.
                </p>
                <button
                  onClick={handleRequestPermission}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors shadow-sm"
                >
                  Permitir Notificações Push
                </button>
              </div>
            )}
          </div>

          {/* Location Selection & GPS */}
          <div className="space-y-2.5">
            <label className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Localização Monitorada
              </span>
              <button
                type="button"
                onClick={handleDetectGps}
                disabled={isDetectingGps}
                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 text-[11px] font-medium"
              >
                <Navigation className={`w-3 h-3 ${isDetectingGps ? 'animate-spin' : ''}`} />
                {isDetectingGps ? 'Detectando GPS...' : 'Usar Meu GPS Atual'}
              </button>
            </label>

            {gpsError && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400">{gpsError}</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {SUPPORTED_REGIONS.map((region) => {
                const isSelected = userLocation.cityName === region.cityName;
                return (
                  <button
                    key={region.cityName}
                    type="button"
                    onClick={() => onUpdateLocation(region)}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 font-semibold'
                        : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <span className="block text-xs">{region.cityName}</span>
                    <span className="block text-[10px] text-neutral-500">{region.stateCode}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Alert Coverage Radius */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Raio de Cobertura de Alerta
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {localSettings.radiusKm} km
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={5}
              value={localSettings.radiusKm}
              onChange={(e) => setLocalSettings({ ...localSettings, radiusKm: Number(e.target.value) })}
              className="w-full accent-emerald-600 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
              <span>5 km (Bairro)</span>
              <span>25 km (Cidade)</span>
              <span>100 km (Região Metropolitana)</span>
            </div>
          </div>

          {/* Minimum Severity Filter */}
          <div className="space-y-2">
            <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
              Limiar Mínimo de Severidade
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { key: 'warning', label: 'Atenção e Acima' },
                { key: 'severe', label: 'Severo e Crítico' },
                { key: 'critical', label: 'Apenas Emergência' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, minSeverity: opt.key as any })}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    localSettings.minSeverity === opt.key
                      ? 'border-emerald-600 bg-emerald-600 text-white font-medium'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hazard Types to Notify */}
          <div className="space-y-2">
            <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
              Fenômenos Notificados
            </span>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800">
                <input
                  type="checkbox"
                  checked={localSettings.notifyStorms}
                  onChange={(e) => setLocalSettings({ ...localSettings, notifyStorms: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 accent-emerald-600"
                />
                <span>Tempestades & Granizo</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800">
                <input
                  type="checkbox"
                  checked={localSettings.notifyFloods}
                  onChange={(e) => setLocalSettings({ ...localSettings, notifyFloods: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 accent-emerald-600"
                />
                <span>Inundações & Enchentes</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800">
                <input
                  type="checkbox"
                  checked={localSettings.notifyLandslides}
                  onChange={(e) => setLocalSettings({ ...localSettings, notifyLandslides: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 accent-emerald-600"
                />
                <span>Risco de Deslizamentos</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800">
                <input
                  type="checkbox"
                  checked={localSettings.notifyHighWinds}
                  onChange={(e) => setLocalSettings({ ...localSettings, notifyHighWinds: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 accent-emerald-600"
                />
                <span>Vendavais & Rajadas</span>
              </label>
            </div>
          </div>

          {/* Sound & Audio Alert Preview */}
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.soundEnabled}
                  onChange={(e) => setLocalSettings({ ...localSettings, soundEnabled: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 accent-emerald-600"
                />
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Sinal Sonoro de Emergência
                </span>
              </label>
            </div>

            <button
              type="button"
              onClick={handleTestSound}
              className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center gap-1.5 transition-colors text-[11px]"
            >
              <Volume2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              Ouvir Sirene Teste
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors shadow-sm"
          >
            Salvar Preferências
          </button>
        </div>
      </div>
    </div>
  );
}
