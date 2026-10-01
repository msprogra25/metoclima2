import { useState, useMemo } from 'react';
import {
  OccurrenceHistoryItem,
  HazardType,
  AlertSeverity
} from '../../types/weather';
import {
  OCCURRENCE_HISTORY,
  CLIMATE_TRENDS_YEARLY,
  MONTHLY_PRECIPITATION_DATA
} from '../../data/mockWeatherData';
import {
  BarChart3,
  TrendingUp,
  History,
  Calendar,
  Waves,
  Zap,
  Mountain,
  Wind,
  Search,
  Users,
  Building,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';

export function HistoryTrends() {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedHazard, setSelectedHazard] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeChartTab, setActiveChartTab] = useState<'monthly' | 'yearly'>('monthly');
  const [hoveredMonthIdx, setHoveredMonthIdx] = useState<number | null>(null);
  const [hoveredYearIdx, setHoveredYearIdx] = useState<number | null>(null);

  // Filter occurrences
  const filteredOccurrences = useMemo(() => {
    return OCCURRENCE_HISTORY.filter((item) => {
      if (selectedYear !== 'all' && item.year.toString() !== selectedYear) return false;
      if (selectedHazard !== 'all' && item.hazardType !== selectedHazard) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesText =
          item.title.toLowerCase().includes(q) ||
          item.region.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);
        if (!matchesText) return false;
      }
      return true;
    });
  }, [selectedYear, selectedHazard, searchQuery]);

  const getHazardIcon = (type: HazardType) => {
    switch (type) {
      case 'flood':
        return <Waves className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'storm':
        return <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'landslide':
        return <Mountain className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'wind':
        return <Wind className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
      default:
        return <Waves className="w-4 h-4 text-neutral-500" />;
    }
  };

  // Dimensions for SVG Monthly Chart
  const maxRainMm = 350;
  const chartHeight = 220;
  const chartWidth = 720;
  const barWidth = 18;

  return (
    <div className="space-y-6">
      {/* Top Section: Analytical Trends & KPI Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span className="text-[11px] text-neutral-500 block">Precipitação Máxima 24h</span>
          <span className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
            172 mm
          </span>
          <span className="text-[10px] text-red-600 dark:text-red-400 flex items-center gap-0.5 mt-0.5">
            <TrendingUp className="w-3 h-3" />
            +28% acima do normal histórico
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span className="text-[11px] text-neutral-500 block">Eventos Extremos Registrados</span>
          <span className="text-xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
            170 episódios
          </span>
          <span className="text-[10px] text-neutral-400 block mt-0.5">
            Base catalogada 2020-2026
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span className="text-[11px] text-neutral-500 block">Pico Histórico de Transbordamento</span>
          <span className="text-xl font-bold font-mono tabular-nums text-red-600 dark:text-red-400">
            5.35 m
          </span>
          <span className="text-[10px] text-neutral-400 block mt-0.5">
            Cota limite segura: 4.20 m
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span className="text-[11px] text-neutral-500 block">População Protegida/Alertada</span>
          <span className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
            180k+ hab.
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
            Zero fatalidades em áreas evacuadas
          </span>
        </div>
      </div>

      {/* Interactive Intuitive Charts Card */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Tendências Climáticas e Análise de Chuvas
            </h3>
            <p className="text-xs text-neutral-500">
              Visualização comparativa de acumulados observados versus normal climatológica regional.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveChartTab('monthly')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                activeChartTab === 'monthly'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Ciclo Mensal (Chuva Observada vs Média)
            </button>
            <button
              onClick={() => setActiveChartTab('yearly')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                activeChartTab === 'yearly'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Evolução Anual (2020-2026)
            </button>
          </div>
        </div>

        {/* Chart 1: Monthly Observed vs Historical Average */}
        {activeChartTab === 'monthly' && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between text-xs text-neutral-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-600"></span>
                  <span className="text-neutral-700 dark:text-neutral-300">Precipitação Observada (mm)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-neutral-300 dark:bg-neutral-700"></span>
                  <span className="text-neutral-700 dark:text-neutral-300">Média Climatológica Histórica (mm)</span>
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                Passe o cursor sobre os meses para inspecionar anomalias
              </span>
            </div>

            {/* Responsive SVG Chart */}
            <div className="w-full overflow-x-auto pb-2">
              <div className="min-w-[640px]">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-56 select-none font-sans"
                >
                  {/* Grid Lines */}
                  {[0, 100, 200, 300].map((val) => {
                    const y = chartHeight - 30 - (val / maxRainMm) * (chartHeight - 50);
                    return (
                      <g key={val}>
                        <line
                          x1="35"
                          y1={y}
                          x2={chartWidth - 10}
                          y2={y}
                          stroke="currentColor"
                          className="text-neutral-200 dark:text-neutral-800"
                          strokeDasharray="4 4"
                          strokeWidth="1"
                        />
                        <text
                          x="5"
                          y={y + 3}
                          fontSize="10"
                          className="fill-neutral-400 font-mono"
                        >
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Monthly Bars */}
                  {MONTHLY_PRECIPITATION_DATA.map((d, idx) => {
                    const colWidth = (chartWidth - 50) / MONTHLY_PRECIPITATION_DATA.length;
                    const xCenter = 45 + idx * colWidth + colWidth / 2;

                    const heightObserved = (d.observedMm / maxRainMm) * (chartHeight - 50);
                    const heightBaseline = (d.climatologicalBaselineMm / maxRainMm) * (chartHeight - 50);

                    const yObserved = chartHeight - 30 - heightObserved;
                    const yBaseline = chartHeight - 30 - heightBaseline;

                    const isHovered = hoveredMonthIdx === idx;

                    return (
                      <g
                        key={d.month}
                        onMouseEnter={() => setHoveredMonthIdx(idx)}
                        onMouseLeave={() => setHoveredMonthIdx(null)}
                        className="cursor-pointer"
                      >
                        {/* Background highlight on hover */}
                        {isHovered && (
                          <rect
                            x={xCenter - colWidth / 2 + 2}
                            y="10"
                            width={colWidth - 4}
                            height={chartHeight - 40}
                            fill="currentColor"
                            className="text-neutral-100 dark:text-neutral-800/60"
                            rx="4"
                          />
                        )}

                        {/* Baseline Bar (Gray) */}
                        <rect
                          x={xCenter - barWidth - 1}
                          y={yBaseline}
                          width={barWidth}
                          height={heightBaseline}
                          fill="currentColor"
                          className="text-neutral-300 dark:text-neutral-700 transition-colors"
                          rx="3"
                        />

                        {/* Observed Bar (Emerald Green) */}
                        <rect
                          x={xCenter + 1}
                          y={yObserved}
                          width={barWidth}
                          height={heightObserved}
                          fill="currentColor"
                          className={`transition-colors ${
                            isHovered
                              ? 'text-emerald-500'
                              : d.anomalyPercent > 20
                              ? 'text-emerald-600'
                              : 'text-emerald-700'
                          }`}
                          rx="3"
                        />

                        {/* Month Label */}
                        <text
                          x={xCenter}
                          y={chartHeight - 12}
                          fontSize="11"
                          textAnchor="middle"
                          className={`font-semibold ${
                            isHovered
                              ? 'fill-emerald-600 dark:fill-emerald-400'
                              : 'fill-neutral-500 dark:fill-neutral-400'
                          }`}
                        >
                          {d.month}
                        </text>

                        {/* Tooltip on Hover */}
                        {isHovered && (
                          <g>
                            <rect
                              x={Math.min(xCenter - 55, chartWidth - 120)}
                              y={Math.max(yObserved - 40, 10)}
                              width="110"
                              height="32"
                              rx="4"
                              fill="#18181b"
                            />
                            <text
                              x={Math.min(xCenter, chartWidth - 65)}
                              y={Math.max(yObserved - 24, 24)}
                              fontSize="10"
                              textAnchor="middle"
                              fill="#ffffff"
                              className="font-mono font-bold"
                            >
                              {d.observedMm}mm ({d.anomalyPercent > 0 ? `+${d.anomalyPercent}%` : `${d.anomalyPercent}%`})
                            </text>
                            <text
                              x={Math.min(xCenter, chartWidth - 65)}
                              y={Math.max(yObserved - 12, 36)}
                              fontSize="9"
                              textAnchor="middle"
                              fill="#a1a1aa"
                            >
                              Média: {d.climatologicalBaselineMm}mm
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Bottom summary statement */}
            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                Diagnóstico de Tendência Sazonal:
              </span>{' '}
              Verifica-se uma concentração pluviométrica acentuada nos meses de verão (Janeiro a Março) e primavera (Novembro a Dezembro), com anomalias superando 30% a 50% da média histórica, elevando significativamente o risco de inundações relâmpago.
            </div>
          </div>
        )}

        {/* Chart 2: Yearly Evolution of Extreme Events */}
        {activeChartTab === 'yearly' && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between text-xs text-neutral-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-red-600"></span>
                  <span className="text-neutral-700 dark:text-neutral-300">Inundações Severas</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-500"></span>
                  <span className="text-neutral-700 dark:text-neutral-300">Tempestades Convectivas</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-600"></span>
                  <span className="text-neutral-700 dark:text-neutral-300">Chuva Anual Total (x100mm)</span>
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">2020 a 2026</span>
            </div>

            {/* Yearly Trend Chart */}
            <div className="w-full overflow-x-auto pb-2">
              <div className="min-w-[640px]">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-56 select-none font-sans">
                  {/* Grid Lines */}
                  {[0, 10, 20, 30, 40].map((val) => {
                    const y = chartHeight - 30 - (val / 40) * (chartHeight - 50);
                    return (
                      <g key={val}>
                        <line
                          x1="35"
                          y1={y}
                          x2={chartWidth - 10}
                          y2={y}
                          stroke="currentColor"
                          className="text-neutral-200 dark:text-neutral-800"
                          strokeDasharray="4 4"
                          strokeWidth="1"
                        />
                        <text x="5" y={y + 3} fontSize="10" className="fill-neutral-400 font-mono">
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Yearly Stacked Bars */}
                  {CLIMATE_TRENDS_YEARLY.map((yr, idx) => {
                    const colWidth = (chartWidth - 60) / CLIMATE_TRENDS_YEARLY.length;
                    const xCenter = 50 + idx * colWidth + colWidth / 2;

                    const heightFloods = (yr.floodOccurrences / 40) * (chartHeight - 50);
                    const heightStorms = (yr.severeStormsCount / 40) * (chartHeight - 50);

                    const yFloods = chartHeight - 30 - heightFloods;
                    const yStorms = yFloods - heightStorms;

                    const isHovered = hoveredYearIdx === idx;

                    return (
                      <g
                        key={yr.year}
                        onMouseEnter={() => setHoveredYearIdx(idx)}
                        onMouseLeave={() => setHoveredYearIdx(null)}
                        className="cursor-pointer"
                      >
                        {/* Floods bar segment */}
                        <rect
                          x={xCenter - 14}
                          y={yFloods}
                          width={28}
                          height={heightFloods}
                          fill="#dc2626"
                          rx="2"
                        />

                        {/* Storms bar segment */}
                        <rect
                          x={xCenter - 14}
                          y={yStorms}
                          width={28}
                          height={heightStorms}
                          fill="#f59e0b"
                          rx="2"
                        />

                        {/* Year Label */}
                        <text
                          x={xCenter}
                          y={chartHeight - 12}
                          fontSize="11"
                          textAnchor="middle"
                          className={`font-mono font-semibold ${
                            isHovered
                              ? 'fill-emerald-600 dark:fill-emerald-400'
                              : 'fill-neutral-600 dark:fill-neutral-400'
                          }`}
                        >
                          {yr.year}
                        </text>

                        {/* Tooltip */}
                        {isHovered && (
                          <g>
                            <rect
                              x={xCenter - 65}
                              y={Math.max(yStorms - 45, 10)}
                              width="130"
                              height="40"
                              rx="4"
                              fill="#18181b"
                            />
                            <text
                              x={xCenter}
                              y={Math.max(yStorms - 28, 26)}
                              fontSize="10"
                              textAnchor="middle"
                              fill="#ffffff"
                              className="font-mono font-bold"
                            >
                              Total: {yr.extremeEventsCount} eventos
                            </text>
                            <text
                              x={xCenter}
                              y={Math.max(yStorms - 14, 40)}
                              fontSize="9"
                              textAnchor="middle"
                              fill="#a1a1aa"
                            >
                              Inund: {yr.floodOccurrences} | Temp: {yr.severeStormsCount}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                Tendência Plurianual de Desastres:
              </span>{' '}
              Observa-se um aumento de mais de 150% na ocorrência de eventos severos entre 2020 (14 eventos) e 2026 (36 eventos), impulsionado pelo aquecimento térmico urbano e eventos meteorológicos extremos mais frequentes.
            </div>
          </div>
        )}
      </div>

      {/* Historical Occurrences Database */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Arquivo Histórico de Desastres & Ocorrências
            </h3>
            <p className="text-xs text-neutral-500">
              Registro histórico detalhado com acumulados de chuva, impactos e medidas mitigadoras.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar rio, bairro ou evento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-500">Ano:</span>
            {['all', '2026', '2025', '2024', '2023', '2022'].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-2 py-0.5 rounded font-mono text-[11px] transition-colors ${
                  selectedYear === yr
                    ? 'bg-emerald-700 text-white font-semibold'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {yr === 'all' ? 'Todos' : yr}
              </button>
            ))}
          </div>

          <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">|</span>

          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500">Tipo:</span>
            {[
              { key: 'all', label: 'Todos' },
              { key: 'flood', label: 'Inundação' },
              { key: 'storm', label: 'Tempestade' },
              { key: 'landslide', label: 'Deslizamento' },
              { key: 'wind', label: 'Vendaval' },
            ].map((hz) => (
              <button
                key={hz.key}
                onClick={() => setSelectedHazard(hz.key)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                  selectedHazard === hz.key
                    ? 'bg-emerald-700 text-white font-semibold'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {hz.label}
              </button>
            ))}
          </div>
        </div>

        {/* Occurrences List */}
        <div className="space-y-3">
          {filteredOccurrences.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 text-neutral-500 text-xs">
              Nenhuma ocorrência encontrada com os termos ou filtros selecionados.
            </div>
          ) : (
            filteredOccurrences.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    {/* Unboxed Metadata (Zero-Pill Discipline) */}
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                      <span>{item.date}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.region}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-red-600 dark:text-red-400 font-bold">
                        {item.rainfallAccumulationMm} mm de chuva
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                      {getHazardIcon(item.hazardType)}
                      <span>{item.title}</span>
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400 font-mono tabular-nums shrink-0">
                    {item.peakRiverLevelM && (
                      <div className="text-right">
                        <span className="block text-[10px] text-neutral-400">Pico Fluvial</span>
                        <span className="font-bold text-red-600 dark:text-red-400">{item.peakRiverLevelM}m</span>
                      </div>
                    )}
                    <div className="text-right">
                      <span className="block text-[10px] text-neutral-400">Pessoas Atingidas</span>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">{item.affectedPeople.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Mitigation Notes */}
                <div className="p-2.5 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 flex items-start gap-2 text-emerald-950 dark:text-emerald-200 text-[11px]">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-800 dark:text-emerald-300">Medida Mitigadora / Resposta: </strong>
                    <span>{item.mitigationNotes}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
