import { useState } from 'react';
import { WeatherAlert, HazardType, AlertSeverity } from '../types/weather';
import { Zap, Waves, Wind, Mountain, Send, X, AlertTriangle } from 'lucide-react';

interface SimulateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerAlert: (alert: WeatherAlert) => void;
  currentCityName: string;
}

export function SimulateAlertModal({
  isOpen,
  onClose,
  onTriggerAlert,
  currentCityName,
}: SimulateAlertModalProps) {
  const [hazardType, setHazardType] = useState<HazardType>('storm');
  const [severity, setSeverity] = useState<AlertSeverity>('critical');
  const [customTitle, setCustomTitle] = useState('Tempestade Convectiva Severa com Granizo');
  const [rainRate, setRainRate] = useState(65);
  const [windSpeed, setWindSpeed] = useState(78);

  if (!isOpen) return null;

  const handleFireAlert = () => {
    const newAlert: WeatherAlert = {
      id: `sim-${Date.now()}`,
      title: customTitle,
      hazardType,
      severity,
      headline: `Condição meteorológica adversa detectada em tempo real na região de ${currentCityName}`,
      description: `Radar meteorológico acusa formação rápida de célula instável com taxa pluviométrica de ${rainRate} mm/h e rajadas de vento de até ${windSpeed} km/h. Risco de alagamentos imediatos e destelhamentos.`,
      safetyInstructions: [
        'Procure abrigo sólido imediatamente e fique longe de portas e janelas de vidro.',
        'Não trafegue por vias sujeitas a acúmulo de água ou bacias fluviais.',
        'Em caso de cabos de energia caídos, mantenha distância e acione a concessionária ou Bombeiros (193).'
      ],
      affectedAreas: [currentCityName, 'Bairros Centrais', 'Eixo Fluvial'],
      centerCoordinates: { lat: -23.5505, lng: -46.6333 },
      radiusKm: 20,
      issuedAt: 'Agora mesmo',
      expiresAt: 'Válido pelas próximas 2 horas',
      precipitationExpectedMm: rainRate,
      windSpeedKmh: windSpeed,
      riverLevelStatus: severity === 'critical' ? 'overflow' : 'alert',
      source: 'Simulador MeteoAlerta / CEMADEN'
    };

    onTriggerAlert(newAlert);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col text-xs text-neutral-700 dark:text-neutral-300">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Simulador de Eventos Extremos
              </h3>
              <p className="text-[11px] text-neutral-500">
                Dispare alertas instantâneos para testar o sistema de notificação push e áudio.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-neutral-900 dark:text-neutral-100 block">
              Tipo de Desastre
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setHazardType('storm');
                  setCustomTitle('Tempestade Convectiva com Granizo e Vento');
                }}
                className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                  hazardType === 'storm'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-bold'
                    : 'border-neutral-200 dark:border-neutral-800'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Tempestade</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setHazardType('flood');
                  setCustomTitle('Inundação e Transbordamento de Bacia');
                }}
                className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                  hazardType === 'flood'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-bold'
                    : 'border-neutral-200 dark:border-neutral-800'
                }`}
              >
                <Waves className="w-4 h-4 text-sky-500" />
                <span>Inundação</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-neutral-900 dark:text-neutral-100 block">
              Nível de Severidade
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { key: 'critical', label: 'Crítico', color: 'bg-red-600' },
                { key: 'severe', label: 'Severo', color: 'bg-amber-600' },
                { key: 'warning', label: 'Atenção', color: 'bg-emerald-600' },
              ].map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSeverity(s.key as any)}
                  className={`p-2 rounded-lg text-center font-medium border ${
                    severity === s.key
                      ? 'border-emerald-600 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                      : 'border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span>Chuva Esperada:</span>
              <span className="font-mono font-bold">{rainRate} mm</span>
            </div>
            <input
              type="range"
              min={20}
              max={150}
              value={rainRate}
              onChange={(e) => setRainRate(Number(e.target.value))}
              className="w-full accent-emerald-600 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span>Velocidade das Rajadas:</span>
              <span className="font-mono font-bold">{windSpeed} km/h</span>
            </div>
            <input
              type="range"
              min={30}
              max={120}
              value={windSpeed}
              onChange={(e) => setWindSpeed(Number(e.target.value))}
              className="w-full accent-emerald-600 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleFireAlert}
            className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Emitir Alerta em Tempo Real</span>
          </button>
        </div>
      </div>
    </div>
  );
}
