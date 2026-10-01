import { useState, useEffect } from 'react';
import {
  PhoneCall,
  ShieldCheck,
  AlertOctagon,
  Waves,
  Zap,
  Mountain,
  CheckSquare,
  Square,
  Info,
  ExternalLink
} from 'lucide-react';

interface SafetyItem {
  id: string;
  name: string;
  category: 'vital' | 'medical' | 'tools';
}

const EMERGENCY_KIT_ITEMS: SafetyItem[] = [
  { id: 'water', name: 'Água potável (pelo menos 2 litros por pessoa/dia)', category: 'vital' },
  { id: 'food', name: 'Alimentos não perecíveis (barras, enlatados, bolachas)', category: 'vital' },
  { id: 'flashlight', name: 'Lanterna com pilhas reservas (preferência LED)', category: 'tools' },
  { id: 'radio', name: 'Rádio portátil AM/FM à pilha para ouvir boletins da Defesa Civil', category: 'tools' },
  { id: 'first_aid', name: 'Kit primeiros socorros (antisséptico, gaze, ataduras, esparadrapo)', category: 'medical' },
  { id: 'meds', name: 'Medicamentos de uso contínuo (receitas e dosagem para 7 dias)', category: 'medical' },
  { id: 'documents', name: 'Documentos essenciais protegidos em saco plástico impermeável', category: 'vital' },
  { id: 'powerbank', name: 'Carregador portátil (Powerbank) com carga total', category: 'tools' },
  { id: 'whistle', name: 'Apito sonoro para sinalizar localização em caso de soterramento', category: 'tools' },
  { id: 'clothes', name: 'Muda de roupas secas, agasalho e capa de chuva', category: 'vital' },
];

export function SafetyGuide() {
  const [activeTab, setActiveTab] = useState<'flood' | 'storm' | 'landslide' | 'kit'>('flood');
  const [checkedKitIds, setCheckedKitIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('meteo_emergency_kit');
      return saved ? JSON.parse(saved) : ['water', 'flashlight', 'documents'];
    } catch {
      return ['water', 'flashlight', 'documents'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('meteo_emergency_kit', JSON.stringify(checkedKitIds));
    } catch {}
  }, [checkedKitIds]);

  const toggleKitItem = (id: string) => {
    setCheckedKitIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const kitProgressPercent = Math.round((checkedKitIds.length / EMERGENCY_KIT_ITEMS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Emergency Contacts Header Banner */}
      <div className="p-4 rounded-xl bg-neutral-900 text-white shadow-md border border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2 text-emerald-400">
              <PhoneCall className="w-4 h-4" />
              Números de Emergência e Resgate Imediato
            </h3>
            <p className="text-xs text-neutral-300 mt-0.5">
              Linhas oficiais públicas de prontidão 24 horas para socorro e contenção de riscos.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <a
              href="tel:199"
              className="p-2 rounded-lg bg-neutral-800 hover:bg-emerald-950 border border-neutral-700 hover:border-emerald-600 transition-colors text-center block"
            >
              <span className="block text-[10px] text-neutral-400">Defesa Civil</span>
              <span className="text-base font-bold font-mono text-emerald-400">199</span>
            </a>
            <a
              href="tel:193"
              className="p-2 rounded-lg bg-neutral-800 hover:bg-red-950 border border-neutral-700 hover:border-red-600 transition-colors text-center block"
            >
              <span className="block text-[10px] text-neutral-400">Bombeiros</span>
              <span className="text-base font-bold font-mono text-red-400">193</span>
            </a>
            <a
              href="tel:192"
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors text-center block"
            >
              <span className="block text-[10px] text-neutral-400">SAMU (Médico)</span>
              <span className="text-base font-bold font-mono text-white">192</span>
            </a>
            <a
              href="tel:190"
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors text-center block"
            >
              <span className="block text-[10px] text-neutral-400">Polícia Militar</span>
              <span className="text-base font-bold font-mono text-white">190</span>
            </a>
          </div>
        </div>
      </div>

      {/* Protocol Selection Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
        <button
          onClick={() => setActiveTab('flood')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'flood'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          <Waves className="w-3.5 h-3.5 text-sky-500" />
          <span>Inundações & Enchentes</span>
        </button>

        <button
          onClick={() => setActiveTab('storm')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'storm'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Tempestades Severas</span>
        </button>

        <button
          onClick={() => setActiveTab('landslide')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'landslide'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          <Mountain className="w-3.5 h-3.5 text-emerald-500" />
          <span>Deslizamentos de Terra</span>
        </button>

        <button
          onClick={() => setActiveTab('kit')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'kit'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Mochila 72 Horas ({kitProgressPercent}%)</span>
        </button>
      </div>

      {/* Content Panes */}
      {activeTab === 'flood' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2">
              <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100 block">
                1. Antes da Inundação
              </span>
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span>Mantenha bueiros e calhas desobstruídos em volta do seu imóvel.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span>Coloque móveis, eletrodomésticos e documentos em prateleiras elevadas.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span>Identifique previamente a rota de fuga para o ponto mais alto do bairro.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/20 dark:bg-red-950/20 space-y-2">
              <span className="font-bold text-xs text-red-700 dark:text-red-400 block flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
                2. Durante a Inundação (Regra de Ouro)
              </span>
              <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                <li className="flex items-start gap-1.5 font-medium text-red-950 dark:text-red-200">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>NUNCA atravesse água com correnteza a pé ou de carro (15cm derrubam um adulto; 30cm arrastam veículos).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Desligue o disjuntor geral de energia e feche a válvula de gás antes da água entrar.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Se a água começar a subir no veículo, saia imediatamente e busque terreno elevado.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2">
              <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100 block">
                3. Depois que a Água Baixar
              </span>
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span>Cuidado com animais peçonhentos (cobras, aranhas, escorpiões) refugiados no entulho.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span>Descarte alimentos e medicamentos que entraram em contato com a lama da enchente.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span>Lave o chão e paredes com água sanitária (1 copo para cada 20L de água).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'storm' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2.5">
            <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              Proteção Contra Raios e Descargas Atmosféricas
            </span>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 font-bold">›</span>
                <span>Não permaneça em campos abertos, piscinas, represas ou praias durante a trovoada.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 font-bold">›</span>
                <span>Nunca se abrigue debaixo de árvores isoladas ou perto de cercas de arame e postes metálicos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 font-bold">›</span>
                <span>Desconecte aparelhos eletrônicos caros da tomada para evitar queima por sobretensão.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 font-bold">›</span>
                <span>Dentro de casa, evite usar chuveiro elétrico ou falar ao telefone com fio.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2.5">
            <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-teal-600" />
              Rajadas de Vento Forte e Granizo
            </span>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 font-bold">›</span>
                <span>Feche bem janelas, persianas e portas de correr para evitar que a pressão do vento estilhace vidros.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 font-bold">›</span>
                <span>Não estacione veículos sob árvores antigas ou placas de publicidade frágeis.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 font-bold">›</span>
                <span>Caso fios elétricos caiam sobre seu automóvel, permaneça no interior do veículo e chame os bombeiros (193).</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'landslide' && (
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
          <div className="flex items-center gap-2">
            <Mountain className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Sinais Prévios de Alerta para Deslizamento de Encosta
            </h4>
          </div>

          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            A saturação do solo por chuvas contínuas reduz o atrito e causa escorregamentos repentinos. Ao notar qualquer um destes 5 sinais, saia imediatamente:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
            {[
              { title: 'Trincas no Chão e Paredes', desc: 'Rachaduras que aumentam rapidamente de espessura no piso ou na alvenaria.' },
              { title: 'Postes e Árvores Inclinados', desc: 'Muros abaulados ou inclinação gradual de postes de energia no morro.' },
              { title: 'Água Turva Brotando', desc: 'Surgimento de vertedouros de água barrenta brotando da base da encosta.' },
              { title: 'Portas Emperradas', desc: 'Portas e janelas que de repente travam ou não fecham devido à torção da fundação.' },
              { title: 'Ruídos Subterrâneos', desc: 'Estalos secos de vegetação quebrando ou som semelhante a trovão vindo do subsolo.' },
              { title: 'Acionamento de Sirenes', desc: 'Em áreas monitoradas, ao ouvir o alarme, dirija-se aos pontos de apoio da Defesa Civil.' },
            ].map((sig, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 text-xs">
                <span className="font-bold text-neutral-900 dark:text-neutral-100 block mb-1">
                  {idx + 1}. {sig.title}
                </span>
                <span className="text-neutral-600 dark:text-neutral-300 text-[11px] leading-relaxed block">
                  {sig.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'kit' && (
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Checklist da Mochila de Emergência (72 Horas)
              </h4>
              <p className="text-xs text-neutral-500">
                Itens indispensáveis reunidos em uma mochila impermeável para evacuações imediatas.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-32 h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                  style={{ width: `${kitProgressPercent}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {checkedKitIds.length}/{EMERGENCY_KIT_ITEMS.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {EMERGENCY_KIT_ITEMS.map((item) => {
              const isChecked = checkedKitIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleKitItem(item.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-2.5 ${
                    isChecked
                      ? 'border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-100'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <button type="button" className="mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0">
                    {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-neutral-400" />}
                  </button>
                  <span className={isChecked ? 'line-through opacity-80' : ''}>{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
