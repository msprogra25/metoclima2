import { WeatherAlert } from '../types/weather';
import { AlertTriangle, ArrowRight, X } from 'lucide-react';

interface LiveAlertBannerProps {
  alert: WeatherAlert | null;
  onViewDetails: (alert: WeatherAlert) => void;
  onDismiss: () => void;
}

export function LiveAlertBanner({ alert, onViewDetails, onDismiss }: LiveAlertBannerProps) {
  if (!alert) return null;

  return (
    <div className="bg-red-600 text-white px-4 py-2 text-xs flex items-center justify-between gap-3 shadow-sm transition-all animate-fade-in">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="font-bold uppercase tracking-wider text-[11px] shrink-0 bg-red-800/80 px-1.5 py-0.5 rounded">
            Alerta Urgente
          </span>
          <p className="truncate text-red-50">
            <strong>{alert.title}:</strong> {alert.headline}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onViewDetails(alert)}
            className="flex items-center gap-1 font-semibold underline underline-offset-2 hover:text-red-100 transition-colors"
          >
            <span>Ver Instruções</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={onDismiss}
            className="p-1 hover:bg-red-700 rounded transition-colors text-white/80 hover:text-white"
            title="Fechar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
