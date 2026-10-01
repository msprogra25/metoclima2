import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  StormCell,
  FloodRiskZone,
  RiverGauge,
  SafetyShelter,
  UserLocationPreference
} from '../../types/weather';
import {
  Play,
  Pause,
  RotateCcw,
  Layers,
  Shield,
  Waves,
  Zap,
  MapPin,
  Clock,
  Compass
} from 'lucide-react';

interface WeatherMapProps {
  userLocation: UserLocationPreference;
  stormCells: StormCell[];
  floodZones: FloodRiskZone[];
  riverGauges: RiverGauge[];
  shelters: SafetyShelter[];
  isDark: boolean;
  onSelectStorm?: (storm: StormCell) => void;
  onSelectFloodZone?: (zone: FloodRiskZone) => void;
}

export function WeatherMap({
  userLocation,
  stormCells,
  floodZones,
  riverGauges,
  shelters,
  isDark,
  onSelectStorm,
  onSelectFloodZone
}: WeatherMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  // Time scrubber state: -60 to +90 min (index 0 to 5)
  const timeSteps = [
    { offset: -60, label: '-60 min' },
    { offset: -30, label: '-30 min' },
    { offset: 0, label: 'Tempo Real' },
    { offset: 30, label: '+30 min (Proj.)' },
    { offset: 60, label: '+60 min (Proj.)' },
    { offset: 90, label: '+90 min (Proj.)' },
  ];
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(2); // Default to 'Tempo Real' (0 min)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Layer visibility toggles
  const [showStorms, setShowStorms] = useState<boolean>(true);
  const [showFloodZones, setShowFloodZones] = useState<boolean>(true);
  const [showRiverGauges, setShowRiverGauges] = useState<boolean>(true);
  const [showShelters, setShowShelters] = useState<boolean>(true);
  const [showRadarPrecipitation, setShowRadarPrecipitation] = useState<boolean>(true);

  // Selected item modal/card
  const [selectedCellInfo, setSelectedCellInfo] = useState<StormCell | null>(null);
  const [selectedZoneInfo, setSelectedZoneInfo] = useState<FloodRiskZone | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 11,
      zoomControl: false,
    });

    // Add zoom control top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Dark/Light tile layers (CartoDB Positron / Dark Matter)
    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tiles = L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layersGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update base tiles when theme changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        const currentUrl = isDark
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
        layer.setUrl(currentUrl);
      }
    });
  }, [isDark]);

  // Recenter map on user location change
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 11, {
        duration: 1.2,
      });
    }
  }, [userLocation]);

  // Animation playback interval
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStepIdx((prev) => (prev + 1) % timeSteps.length);
    }, 1800);

    return () => clearInterval(timer);
  }, [isPlaying, timeSteps.length]);

  // Redraw layers when timeStep or layer toggles change
  const renderMapLayers = useCallback(() => {
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    const selectedOffset = timeSteps[currentStepIdx].offset;

    // 1. User Location Pin
    const userIcon = L.divIcon({
      className: 'custom-user-icon',
      html: `
        <div class="relative flex items-center justify-center w-7 h-7">
          <span class="absolute w-7 h-7 rounded-full bg-emerald-500/30 animate-ping"></span>
          <span class="relative w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md"></span>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .bindPopup(`
        <div class="p-1 font-sans text-xs">
          <p class="font-bold text-slate-900">${userLocation.cityName} - ${userLocation.stateCode}</p>
          <p class="text-slate-500">Sua localização monitorada</p>
        </div>
      `);
    group.addLayer(userMarker);

    // 2. Flood Risk Zones
    if (showFloodZones) {
      floodZones.forEach((zone) => {
        const fillColor = zone.riskLevel === 'critical' ? '#dc2626' : zone.riskLevel === 'high' ? '#ea580c' : '#16a34a';
        const polygon = L.polygon(
          zone.polygon.map((p) => [p.lat, p.lng] as L.LatLngTuple),
          {
            color: fillColor,
            weight: 2,
            opacity: 0.9,
            fillColor: fillColor,
            fillOpacity: isDark ? 0.35 : 0.25,
            dashArray: zone.riskLevel === 'critical' ? '4, 4' : undefined,
          }
        );

        polygon.on('click', () => {
          setSelectedZoneInfo(zone);
          if (onSelectFloodZone) onSelectFloodZone(zone);
        });

        polygon.bindTooltip(
          `<strong>${zone.name}</strong><br/>Nível do Rio: ${zone.currentWaterLevelM.toFixed(2)}m (Cota: ${zone.overflowThresholdM.toFixed(2)}m)`,
          { direction: 'top', className: 'text-xs font-sans' }
        );

        group.addLayer(polygon);
      });
    }

    // 3. Storm Trajectories & Animated Cells
    if (showStorms) {
      stormCells.forEach((cell) => {
        // Find trajectory point matching selected offset or interpolated
        const exactPt = cell.trajectory.find((t) => t.timeOffsetMin === selectedOffset) || cell.trajectory[2];
        const currentCoord: [number, number] = [exactPt.lat, exactPt.lng];

        // Draw Historical Path (past points)
        const pastPoints: [number, number][] = cell.trajectory
          .filter((t) => t.timeOffsetMin <= 0)
          .map((t) => [t.lat, t.lng]);

        if (pastPoints.length > 1) {
          const pastLine = L.polyline(pastPoints, {
            color: '#94a3b8',
            weight: 3,
            dashArray: '6, 6',
            opacity: 0.8,
          });
          group.addLayer(pastLine);
        }

        // Draw Projected Cone of Uncertainty (future points)
        const futurePoints: [number, number][] = cell.trajectory
          .filter((t) => t.timeOffsetMin >= 0)
          .map((t) => [t.lat, t.lng]);

        if (futurePoints.length > 1) {
          const futureLine = L.polyline(futurePoints, {
            color: '#ef4444',
            weight: 3,
            dashArray: '8, 8',
            opacity: 0.9,
          });
          group.addLayer(futureLine);

          // Draw uncertainty circles along future track
          cell.trajectory
            .filter((t) => t.timeOffsetMin > 0)
            .forEach((pt) => {
              const radiusMeters = (pt.timeOffsetMin / 30) * 2200; // Expands with time
              const uncertaintyCircle = L.circle([pt.lat, pt.lng], {
                radius: radiusMeters,
                color: '#f87171',
                weight: 1,
                fillColor: '#f87171',
                fillOpacity: 0.12,
              }).bindTooltip(`Previsão ${pt.timeLabel}: Probabilidade ${pt.probabilityPercent}%`, {
                className: 'text-xs',
              });
              group.addLayer(uncertaintyCircle);
            });
        }

        // Simulated Radar Reflectivity Contour around the cell
        if (showRadarPrecipitation) {
          const radarHalo = L.circle(currentCoord, {
            radius: 8000,
            color: '#10b981',
            weight: 1,
            fillColor: exactPt.intensityDbr > 52 ? '#dc2626' : exactPt.intensityDbr > 45 ? '#f59e0b' : '#10b981',
            fillOpacity: 0.28,
          });
          group.addLayer(radarHalo);
        }

        // Core storm icon at active timestep
        const isSelectedStep = exactPt.timeOffsetMin === selectedOffset;
        const stormIcon = L.divIcon({
          className: 'custom-storm-icon',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer group">
              <span class="absolute w-12 h-12 rounded-full ${
                cell.severity === 'critical' ? 'bg-red-500/25' : 'bg-emerald-500/25'
              } hazard-pulse-ring"></span>
              <div class="relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg ${
                cell.severity === 'critical' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
              } border-2 border-white dark:border-neutral-900 transition-transform hover:scale-110">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div class="absolute top-9 px-2 py-0.5 bg-neutral-900/90 text-white text-[10px] font-mono rounded whitespace-nowrap shadow pointer-events-none">
                ${exactPt.intensityDbr} dBZ · ${cell.speedKmh} km/h
              </div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const stormMarker = L.marker(currentCoord, { icon: stormIcon });
        stormMarker.on('click', () => {
          setSelectedCellInfo(cell);
          if (onSelectStorm) onSelectStorm(cell);
        });

        group.addLayer(stormMarker);
      });
    }

    // 4. River Gauges (Réguas Fluviométricas)
    if (showRiverGauges) {
      riverGauges.forEach((gauge) => {
        const gaugeIcon = L.divIcon({
          className: 'custom-gauge-icon',
          html: `
            <div class="flex items-center gap-1 px-1.5 py-0.5 rounded shadow text-[10px] font-mono font-semibold ${
              gauge.status === 'overflow'
                ? 'bg-red-600 text-white border border-red-400 animate-pulse'
                : gauge.status === 'alert'
                ? 'bg-amber-500 text-white'
                : 'bg-emerald-800 text-white'
            }">
              <span>${gauge.currentLevelM.toFixed(2)}m</span>
            </div>
          `,
          iconSize: [44, 20],
          iconAnchor: [22, 10],
        });

        const marker = L.marker([gauge.lat, gauge.lng], { icon: gaugeIcon }).bindPopup(`
          <div class="p-1 font-sans text-xs">
            <p class="font-bold text-slate-900">${gauge.riverName}</p>
            <p class="text-slate-600">${gauge.stationName}</p>
            <div class="mt-2 text-[11px] text-slate-700">
              <p>Nível Atual: <strong>${gauge.currentLevelM.toFixed(2)}m</strong></p>
              <p>Cota de Alerta: ${gauge.alertLevelM.toFixed(2)}m</p>
              <p>Cota de Transbordamento: ${gauge.overflowLevelM.toFixed(2)}m</p>
              <p>Tendência: <strong>${gauge.trend === 'rising' ? 'Subindo ↗' : gauge.trend === 'falling' ? 'Baixando ↘' : 'Estável →'}</strong></p>
            </div>
          </div>
        `);
        group.addLayer(marker);
      });
    }

    // 5. Emergency Shelters (Abrigos Seguros)
    if (showShelters) {
      shelters.forEach((shelter) => {
        const shelterIcon = L.divIcon({
          className: 'custom-shelter-icon',
          html: `
            <div class="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white border border-white shadow hover:scale-110 transition-transform">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([shelter.lat, shelter.lng], { icon: shelterIcon }).bindPopup(`
          <div class="p-1 font-sans text-xs">
            <p class="font-bold text-slate-900">${shelter.name}</p>
            <p class="text-slate-500">${shelter.address}</p>
            <div class="mt-2 text-[11px] text-slate-700">
              <p>Capacidade: ${shelter.capacity} pessoas</p>
              <p>Ocupação: ${shelter.currentOccupancy} (${Math.round((shelter.currentOccupancy / shelter.capacity) * 100)}%)</p>
              <p>Telefone: <strong>${shelter.phone}</strong></p>
              <p>Status: <span class="font-semibold ${shelter.status === 'open' ? 'text-emerald-600' : 'text-amber-600'}">${shelter.status === 'open' ? 'Aberto / Ativo' : 'Em Sobreaviso'}</span></p>
            </div>
          </div>
        `);
        group.addLayer(marker);
      });
    }
  }, [
    userLocation,
    currentStepIdx,
    showStorms,
    showFloodZones,
    showRiverGauges,
    showShelters,
    showRadarPrecipitation,
    stormCells,
    floodZones,
    riverGauges,
    shelters,
    isDark,
    timeSteps,
    onSelectStorm,
    onSelectFloodZone,
  ]);

  useEffect(() => {
    renderMapLayers();
  }, [renderMapLayers]);

  return (
    <div className="relative w-full h-[620px] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900">
      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Control: Layer Toggles */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="p-2.5 rounded-lg bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-lg text-xs">
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-neutral-100 dark:border-neutral-800 font-semibold text-neutral-800 dark:text-neutral-200">
            <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Camadas do Radar</span>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <input
                type="checkbox"
                checked={showStorms}
                onChange={(e) => setShowStorms(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <span className="flex items-center gap-1 text-neutral-700 dark:text-neutral-300">
                <Zap className="w-3 h-3 text-red-500" />
                Trajetórias de Tempestades
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <input
                type="checkbox"
                checked={showFloodZones}
                onChange={(e) => setShowFloodZones(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <span className="flex items-center gap-1 text-neutral-700 dark:text-neutral-300">
                <Waves className="w-3 h-3 text-amber-500" />
                Zonas de Inundação
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <input
                type="checkbox"
                checked={showRiverGauges}
                onChange={(e) => setShowRiverGauges(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <span className="flex items-center gap-1 text-neutral-700 dark:text-neutral-300">
                <Compass className="w-3 h-3 text-emerald-500" />
                Réguas Telemétricas (Rios)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <input
                type="checkbox"
                checked={showShelters}
                onChange={(e) => setShowShelters(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <span className="flex items-center gap-1 text-neutral-700 dark:text-neutral-300">
                <Shield className="w-3 h-3 text-emerald-500" />
                Abrigos de Emergência
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <input
                type="checkbox"
                checked={showRadarPrecipitation}
                onChange={(e) => setShowRadarPrecipitation(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <span className="text-neutral-700 dark:text-neutral-300">
                Eco de Chuva (Refletividade)
              </span>
            </label>
          </div>
        </div>

        {/* Legend Panel */}
        <div className="p-2.5 rounded-lg bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow text-[11px] text-neutral-600 dark:text-neutral-400">
          <p className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Severidade de Eco Radar</p>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded bg-emerald-500" title="Chuva moderada (30-40 dBZ)"></span>
            <span>30 dBZ</span>
            <span className="w-3 h-2 rounded bg-amber-500" title="Chuva forte (45-50 dBZ)"></span>
            <span>45 dBZ</span>
            <span className="w-3 h-2 rounded bg-red-600" title="Tempestade severa / granizo (>55 dBZ)"></span>
            <span>55+ dBZ</span>
          </div>
        </div>
      </div>

      {/* Floating Bottom: Trajectory Timeline Player */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="p-3 rounded-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-xl flex flex-col md:flex-row items-center gap-3 justify-between">
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shrink-0 shadow-sm"
              title={isPlaying ? 'Pausar animação' : 'Animar trajetória do radar'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            {/* Reset Button */}
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIdx(2);
              }}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
              title="Voltar ao tempo real"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="text-xs">
              <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Linha Temporal de Trajetória:
              </span>
              <span className="font-semibold font-mono text-neutral-900 dark:text-neutral-100">
                {timeSteps[currentStepIdx].label}
              </span>
            </div>
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {timeSteps.map((step, idx) => (
              <button
                key={step.offset}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIdx(idx);
                }}
                className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors whitespace-nowrap ${
                  idx === currentStepIdx
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Storm Detail Overlay */}
      {selectedCellInfo && (
        <div className="absolute top-4 right-4 z-20 max-w-sm p-4 rounded-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-xl text-xs">
          <div className="flex items-start justify-between gap-3 pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <p className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{selectedCellInfo.name}</p>
              <p className="text-neutral-500">Direção: {selectedCellInfo.headingDegrees}° · Velocidade: {selectedCellInfo.speedKmh} km/h</p>
            </div>
            <button
              onClick={() => setSelectedCellInfo(null)}
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 font-bold text-sm"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 text-neutral-700 dark:text-neutral-300">
            <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-800">
              <span className="text-[10px] text-neutral-500 block">Taxa de Chuva</span>
              <span className="text-sm font-semibold font-mono">{selectedCellInfo.rainRateMmH} mm/h</span>
            </div>
            <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-800">
              <span className="text-[10px] text-neutral-500 block">Rajadas Previstas</span>
              <span className="text-sm font-semibold font-mono">{selectedCellInfo.windGustsKmh} km/h</span>
            </div>
            <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-800">
              <span className="text-[10px] text-neutral-500 block">Eco Radar</span>
              <span className="text-sm font-semibold font-mono text-red-600 dark:text-red-400">{selectedCellInfo.intensityDbr} dBZ</span>
            </div>
            <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-800">
              <span className="text-[10px] text-neutral-500 block">Abertura do Cone</span>
              <span className="text-sm font-semibold font-mono">{selectedCellInfo.coneAngleDeg}°</span>
            </div>
          </div>
        </div>
      )}

      {/* Selected Flood Zone Detail Overlay */}
      {selectedZoneInfo && (
        <div className="absolute top-4 right-4 z-20 max-w-sm p-4 rounded-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-xl text-xs">
          <div className="flex items-start justify-between gap-3 pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <p className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{selectedZoneInfo.name}</p>
              <p className="text-neutral-500">{selectedZoneInfo.basin}</p>
            </div>
            <button
              onClick={() => setSelectedZoneInfo(null)}
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 font-bold text-sm"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 space-y-2 text-neutral-700 dark:text-neutral-300">
            <div className="flex justify-between items-center p-2 rounded bg-neutral-100 dark:bg-neutral-800">
              <span>Nível da Água Atual:</span>
              <span className="font-mono font-bold text-red-600 dark:text-red-400">{selectedZoneInfo.currentWaterLevelM.toFixed(2)} m</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-neutral-100 dark:bg-neutral-800">
              <span>Cota de Transbordamento:</span>
              <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{selectedZoneInfo.overflowThresholdM.toFixed(2)} m</span>
            </div>
            <p className="text-[11px] text-neutral-500 italic mt-1 leading-relaxed">
              {selectedZoneInfo.historyOfFlooding}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
