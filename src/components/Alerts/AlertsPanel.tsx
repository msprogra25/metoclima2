import { useState } from 'react';
import { WeatherAlert, AlertSeverity, HazardType } from '../../types/weather';
import {
  AlertTriangle,
  Waves,
  Zap,
  Wind,
  Mountain,
  MapPin,
  Clock,
  ShieldAlert,
  ChevronRight,
  Share2,
  BellRing
} from 'lucide-react';

interface AlertsPanelProps {
  alerts: WeatherAlert[];
  onFocusAlert?: (alert: WeatherAlert) => void;
  onTriggerTestPush?: (alert: WeatherAlert) => void;
}

export function AlertsPanel({ alerts, onFocusAlert, onTriggerTestPush }: AlertsPanelProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedHazard, setSelectedHazard] = useState<string>('all');
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(alerts[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredAlerts = alerts.filter((alert) => {
    if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) return false;
    if (selectedHazard !== 'all' && alert.hazardType !== selectedHazard) return false;
    return true;
  });

  const getHazardIcon = (type: HazardType) => {
    switch (type) {
      case 'flood':
        return <Waves className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'storm':
        return <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'landslide':
        return <Mountain className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />;
      case 'wind':
        return <Wind className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />;
    }
  };

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return {
          label: 'Emergência Crítica',
          color: 'text-red-700 dark:text-red-400 font-semibold',
          dot: 'bg-red-600',
        };
      case 'severe':
        return {
          label: 'Alerta Severo',
          color: 'text-amber-700 dark:text-amber-400 font-semibold',
          dot: 'bg-amber-500',
        };
      case 'warning':
        return {
          label: 'Atenção Preventiva',
          color: 'text-emerald-700 dark:text-emerald-400 font-semibold',
          dot: 'bg-emerald-600',
        };
      default:
        return {
          label: 'Informativo',
          color: 'text-neutral-600 dark:text-neutral-400',
          dot: 'bg-neutral-400',
        };
    }
  };

  const handleShare = (alert: WeatherAlert) => {
    if (navigator.share) {
      navigator.share({
        title: alert.title,
        text: `${alert.title} - ${alert.headline}. Acompanhe pelo MeteoAlerta.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${alert.title}: ${alert.headline}`);
      setCopiedId(alert.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Alertas em Tempo Real
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Monitoramento contínuo de células convectivas, transbordamentos e risco de desastres.
          </p>
        </div>

        {/* Severity segmented filter tabs */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setSelectedSeverity('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedSeverity === 'all'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            Todos ({alerts.length})
          </button>
          <button
            onClick={() => setSelectedSeverity('critical')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedSeverity === 'critical'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-red-600'
            }`}
          >
            Críticos
          </button>
          <button
            onClick={() => setSelectedSeverity('severe')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedSeverity === 'severe'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-amber-600'
            }`}
          >
            Severos
          </button>
        </div>
      </div>

      {/* Hazard Type Quick Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-neutral-400 shrink-0">Tipo:</span>
        {[
          { key: 'all', label: 'Todos os Perigos' },
          { key: 'flood', label: 'Inundações & Rios' },
          { key: 'storm', label: 'Tempestades & Raios' },
          { key: 'landslide', label: 'Deslizamentos' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setSelectedHazard(item.key)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              selectedHazard === item.key
                ? 'bg-emerald-700 text-white'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 text-neutral-500">
            <p className="text-sm">Nenhum alerta ativo encontrado com os filtros selecionados.</p>
            <p className="text-xs mt-1">A região atual opera sob parâmetros de normalidade climática.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const sevInfo = getSeverityBadge(alert.severity);
            const isExpanded = expandedAlertId === alert.id;

            return (
              <div
                key={alert.id}
                className={`rounded-xl border transition-all duration-200 ${
                  alert.severity === 'critical'
                    ? 'border-red-200 dark:border-red-900/60 bg-red-50/30 dark:bg-red-950/20'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
                }`}
              >
                {/* Alert Item Header */}
                <div
                  onClick={() => setExpandedAlertId(isExpanded ? null : alert.id)}
                  className="p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1.5 flex-1">
                    {/* Unboxed Metadata Header (Zero-Pill Discipline) */}
                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${sevInfo.dot}`}></span>
                        <span className={sevInfo.color}>{sevInfo.label}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.issuedAt}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-neutral-600 dark:text-neutral-400">{alert.source}</span>
                    </div>

                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                      {getHazardIcon(alert.hazardType)}
                      <span>{alert.title}</span>
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2">
                      {alert.headline}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-neutral-600 dark:text-neutral-400 shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className="block text-[11px] text-neutral-400">Precipitação</span>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">{alert.precipitationExpectedMm} mm</span>
                    </div>
                    <div className="text-right hidden sm:block">
                      <span className="block text-[11px] text-neutral-400">Vento</span>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">{alert.windSpeedKmh} km/h</span>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-neutral-100 dark:border-neutral-800 text-xs space-y-4">
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {alert.description}
                    </p>

                    {/* Affected Areas */}
                    <div>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Bairros e Regiões Afetadas:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {alert.affectedAreas.map((area, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px]"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Safety Instructions */}
                    <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40">
                      <span className="font-semibold text-emerald-900 dark:text-emerald-300 block mb-2">
                        Recomendações Imediatas de Segurança:
                      </span>
                      <ul className="space-y-1.5">
                        {alert.safetyInstructions.map((instruction, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-emerald-950 dark:text-emerald-200">
                            <span className="font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">›</span>
                            <span>{instruction}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-1 gap-2">
                      <div className="flex items-center gap-2">
                        {onFocusAlert && (
                          <button
                            onClick={() => onFocusAlert(alert)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors flex items-center gap-1.5 text-xs shadow-sm"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            Ver no Mapa Interativo
                          </button>
                        )}

                        {onTriggerTestPush && (
                          <button
                            onClick={() => onTriggerTestPush(alert)}
                            className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-medium transition-colors flex items-center gap-1.5 text-xs"
                            title="Disparar notificação de teste para este alerta"
                          >
                            <BellRing className="w-3.5 h-3.5 text-amber-500" />
                            Testar Notificação Push
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handleShare(alert)}
                        className="px-3 py-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5 text-xs"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{copiedId === alert.id ? 'Copiado!' : 'Compartilhar'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
