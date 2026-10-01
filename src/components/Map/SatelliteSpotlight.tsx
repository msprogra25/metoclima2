import { useState } from 'react';
import { Eye, Shield, Radio, Sparkles, X, Maximize2 } from 'lucide-react';

interface SatelliteSpotlightProps {
  isDark: boolean;
}

export function SatelliteSpotlight({ isDark }: SatelliteSpotlightProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Exact generated image path from generate_image tool response
  const imagePath = '/src/assets/images/storm_satellite_radar_1790893405320.jpg';

  return (
    <>
      {/* Widget / Preview Card */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
              Imagens Orbitais & Satélite GOES-16
            </h4>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline font-medium"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Expandir</span>
          </button>
        </div>

        {/* Satellite Imagery Frame */}
        <div
          onClick={() => setIsOpen(true)}
          className="relative h-44 rounded-lg overflow-hidden cursor-pointer group border border-neutral-200 dark:border-neutral-800 bg-neutral-950"
        >
          {!imageError ? (
            <img
              src={imagePath}
              alt="Satélite meteorológico GOES-16 em canal infravermelho e radar"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            />
          ) : (
            /* Mandatory Fallback container */
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-950 via-neutral-900 to-black text-neutral-400 p-4 text-center">
              <Radio className="w-8 h-8 text-emerald-500 mb-2" />
              <span className="text-xs font-semibold text-neutral-200">
                Canal Infravermelho GOES-16 / Radar
              </span>
              <span className="text-[10px] text-neutral-400">
                Refletividade convectiva e topos de nuvens frias
              </span>
            </div>
          )}

          {/* Scrim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-black/20 flex flex-col justify-end p-3 pointer-events-none">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Topos de Nuvem & Células Ativas
            </span>
            <span className="text-[10px] text-neutral-300">
              Faixa espectral 10.3µm · Atualizado a cada 10 min
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col text-neutral-200">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  Mosaico de Satélite Geostacionário e Radar Convectivo
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Resolução 2km x 2km · Composição espectral infravermelha com topos frios (-65°C)
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full h-[480px] bg-black">
              {!imageError ? (
                <img
                  src={imagePath}
                  alt="Satélite meteorológico de alta resolução"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 p-6 text-center">
                  <Radio className="w-12 h-12 text-emerald-500 mb-3" />
                  <span className="text-sm font-semibold text-neutral-200">
                    Satélite GOES-16 Geostacionário
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-neutral-800 bg-neutral-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-neutral-400">
                Fonte: Instituto Nacional de Pesquisas Espaciais (INPE/CPTEC) e NOAA
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
              >
                Fechar Visualização
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
