import { WeatherAlert } from '../../types/weather';
import { Bell, X, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PushToastProps {
  toast: {
    alert: WeatherAlert;
    timestamp: string;
  } | null;
  onClose: () => void;
  onOpenAlert: (alert: WeatherAlert) => void;
}

export function PushToast({ toast, onClose, onOpenAlert }: PushToastProps) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-subtle">
      <div className="p-4 rounded-xl bg-neutral-900 text-white border border-emerald-500/40 shadow-2xl space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
            <Bell className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>Notificação Push Geolocalizada</span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-0.5 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div>
          <p className="font-bold text-sm text-neutral-100">{toast.alert.title}</p>
          <p className="text-neutral-300 mt-1 line-clamp-2 leading-relaxed">
            {toast.alert.headline}
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-neutral-800">
          <span className="text-[10px] text-neutral-500 font-mono">{toast.timestamp}</span>
          <button
            onClick={() => {
              onOpenAlert(toast.alert);
              onClose();
            }}
            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors text-[11px]"
          >
            Ver Detalhes do Alerta
          </button>
        </div>
      </div>
    </div>
  );
}
