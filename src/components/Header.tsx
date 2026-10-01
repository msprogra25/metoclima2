import { NightModePreference } from '../hooks/useNightMode';
import { UserLocationPreference } from '../types/weather';
import {
  Bell,
  Sun,
  Moon,
  Clock,
  MapPin,
  ShieldAlert
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'map' | 'alerts' | 'safety' | 'history';
  onSelectTab: (tab: 'map' | 'alerts' | 'safety' | 'history') => void;
  nightMode: NightModePreference;
  onSetNightMode: (mode: NightModePreference) => void;
  userLocation: UserLocationPreference;
  onOpenNotificationsModal: () => void;
  criticalAlertsCount: number;
}

export function Header({
  activeTab,
  onSelectTab,
  nightMode,
  onSetNightMode,
  userLocation,
  onOpenNotificationsModal,
  criticalAlertsCount,
}: HeaderProps) {
  const cycleNightMode = () => {
    if (nightMode === 'auto') onSetNightMode('dark');
    else if (nightMode === 'dark') onSetNightMode('light');
    else onSetNightMode('auto');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('map');
            }}
            className="text-lg font-bold tracking-tight text-emerald-700 dark:text-emerald-400 hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse"></span>
            <span>MeteoAlerta</span>
          </a>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-600 dark:text-neutral-400">
          <button
            onClick={() => onSelectTab('map')}
            className={`transition-colors hover:text-neutral-900 dark:hover:text-neutral-100 ${
              activeTab === 'map'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            Radar & Trajetória
          </button>

          <button
            onClick={() => onSelectTab('alerts')}
            className={`transition-colors hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            <span>Alertas em Tempo Real</span>
            {criticalAlertsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-red-600 text-white">
                {criticalAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('safety')}
            className={`transition-colors hover:text-neutral-900 dark:hover:text-neutral-100 ${
              activeTab === 'safety'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            Recomendações de Segurança
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`transition-colors hover:text-neutral-900 dark:hover:text-neutral-100 ${
              activeTab === 'history'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            Histórico & Tendências
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Location badge trigger */}
          <button
            onClick={onOpenNotificationsModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs transition-colors"
            title="Alterar local ou raio de alerta"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="max-w-[90px] sm:max-w-[130px] truncate font-medium">
              {userLocation.cityName}
            </span>
          </button>

          {/* Push Notification button */}
          <button
            onClick={onOpenNotificationsModal}
            className="relative p-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-sm"
            title="Configurar Notificações Push Personalizadas"
          >
            <Bell className="w-4 h-4" />
            {criticalAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-neutral-950"></span>
            )}
          </button>

          {/* Automatic Night Mode Toggle */}
          <button
            onClick={cycleNightMode}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 text-xs transition-colors"
            title={`Modo Noturno: ${
              nightMode === 'auto' ? 'Automático (Horário local)' : nightMode === 'dark' ? 'Escuro' : 'Claro'
            }. Clique para alterar.`}
          >
            {nightMode === 'auto' ? (
              <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : nightMode === 'dark' ? (
              <Moon className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span className="hidden sm:inline font-mono text-[11px] capitalize">
              {nightMode === 'auto' ? 'Auto' : nightMode === 'dark' ? 'Noite' : 'Dia'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Nav strip */}
      <div className="md:hidden flex items-center justify-around border-t border-neutral-200 dark:border-neutral-800 px-2 py-1.5 text-[11px] text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-950">
        <button
          onClick={() => onSelectTab('map')}
          className={`px-2 py-1 ${activeTab === 'map' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''}`}
        >
          Mapa
        </button>
        <button
          onClick={() => onSelectTab('alerts')}
          className={`px-2 py-1 flex items-center gap-1 ${activeTab === 'alerts' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''}`}
        >
          <span>Alertas</span>
          {criticalAlertsCount > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
          )}
        </button>
        <button
          onClick={() => onSelectTab('safety')}
          className={`px-2 py-1 ${activeTab === 'safety' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''}`}
        >
          Segurança
        </button>
        <button
          onClick={() => onSelectTab('history')}
          className={`px-2 py-1 ${activeTab === 'history' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''}`}
        >
          Histórico
        </button>
      </div>
    </header>
  );
}
