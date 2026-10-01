import {
  WeatherAlert,
  StormCell,
  FloodRiskZone,
  RiverGauge,
  SafetyShelter,
  OccurrenceHistoryItem,
  ClimateTrendData,
  MonthlyRainfall,
  UserLocationPreference,
  PushNotificationSettings
} from '../types/weather';

export const SUPPORTED_REGIONS: UserLocationPreference[] = [
  { cityName: 'São Paulo', stateCode: 'SP', lat: -23.5505, lng: -46.6333, isAutoGps: false },
  { cityName: 'Porto Alegre', stateCode: 'RS', lat: -30.0346, lng: -51.2177, isAutoGps: false },
  { cityName: 'Rio de Janeiro', stateCode: 'RJ', lat: -22.9068, lng: -43.1729, isAutoGps: false },
  { cityName: 'Belo Horizonte', stateCode: 'MG', lat: -19.9167, lng: -43.9345, isAutoGps: false },
  { cityName: 'Curitiba', stateCode: 'PR', lat: -25.4284, lng: -49.2733, isAutoGps: false },
  { cityName: 'Recife', stateCode: 'PE', lat: -8.0476, lng: -34.8770, isAutoGps: false },
  { cityName: 'Florianópolis', stateCode: 'SC', lat: -27.5954, lng: -48.5480, isAutoGps: false },
];

export const INITIAL_ALERTS: WeatherAlert[] = [
  {
    id: 'alt-sp-01',
    title: 'Alerta Crítico: Inundação e Transbordamento Fluvial',
    hazardType: 'flood',
    severity: 'critical',
    headline: 'Bacia do Rio Tietê e Córrego Aricanduva em cota de transbordamento iminente',
    description: 'Volume pluviométrico de 78mm registrado nas últimas 2 horas. Solo saturado na Zona Leste e Marginal Tietê com risco grave de enxurrada e corte de vias principais.',
    safetyInstructions: [
      'Nunca tente atravessar ruas inundadas a pé ou com veículos motorizados.',
      'Moradores de áreas ribeirinhas devem buscar pontos altos imediatamente.',
      'Desligue a chave geral de energia elétrica e feche registros de gás.',
      'Em caso de emergência, ligue imediatamente para a Defesa Civil no número 199.'
    ],
    affectedAreas: ['Zona Leste', 'Marginal Tietê', 'Penha', 'São Miguel Paulista', 'Vila Prudente'],
    centerCoordinates: { lat: -23.5350, lng: -46.5400 },
    radiusKm: 18,
    issuedAt: 'Há 18 min',
    expiresAt: 'Válido até 22:00',
    precipitationExpectedMm: 85,
    windSpeedKmh: 42,
    riverLevelStatus: 'overflow',
    source: 'Defesa Civil Estadual / CEMADEN'
  },
  {
    id: 'alt-sp-02',
    title: 'Alerta Severo: Linha de Instabilidade com Rajadas e Granizo',
    hazardType: 'storm',
    severity: 'severe',
    headline: 'Tempestade convectiva com nuvens do tipo cumulonimbus avançando a 45 km/h',
    description: 'Frente de rajada detectada pelo radar meteorológico com ventos superiores a 75 km/h, queda localizada de granizo e alta densidade de descargas atmosféricas.',
    safetyInstructions: [
      'Não se abrigue debaixo de árvores ou estruturas metálicas vulneráveis.',
      'Afaste-se de janelas de vidro e desconecte aparelhos eletrônicos das tomadas.',
      'Evite estacionar veículos próximos a postes de energia e placas publicitárias.'
    ],
    affectedAreas: ['Zona Sul', 'Santo Amaro', 'Interlagos', 'Morumbi', 'Taboão da Serra'],
    centerCoordinates: { lat: -23.6500, lng: -46.7000 },
    radiusKm: 25,
    issuedAt: 'Há 32 min',
    expiresAt: 'Válido até 20:30',
    precipitationExpectedMm: 55,
    windSpeedKmh: 78,
    riverLevelStatus: 'alert',
    source: 'INMET / Radar São Roque'
  },
  {
    id: 'alt-sp-03',
    title: 'Atenção Geológica: Risco de Deslizamento de Encosta',
    hazardType: 'landslide',
    severity: 'warning',
    headline: 'Acumulado de 135mm em 72h em áreas de morro com alta declividade',
    description: 'Monitoramento geotécnico aponta instabilidade nas encostas orientais da Serra da Cantareira e Perus. Observar trincas no solo e muros.',
    safetyInstructions: [
      'Observe sinais de rachaduras nas paredes, postes inclinados ou água turva.',
      'Ao menor estalo ou movimentação de terra, abandone o imóvel com o kit de emergência.'
    ],
    affectedAreas: ['Serra da Cantareira', 'Perus', 'Brasilândia', 'Mairiporã'],
    centerCoordinates: { lat: -23.4200, lng: -46.6000 },
    radiusKm: 14,
    issuedAt: 'Há 1 hora',
    expiresAt: 'Válido até amanhã 08:00',
    precipitationExpectedMm: 40,
    windSpeedKmh: 28,
    source: 'Instituto de Pesquisas Tecnológicas (IPT)'
  }
];

export const INITIAL_STORM_CELLS: StormCell[] = [
  {
    id: 'cell-alpha-01',
    name: 'Célula Convectiva Alpha-1 (Supercélula)',
    hazardType: 'storm',
    severity: 'critical',
    currentLat: -23.5800,
    currentLng: -46.6200,
    headingDegrees: 65, // Nordeste
    speedKmh: 42,
    intensityDbr: 58, // Forte refletividade
    rainRateMmH: 65,
    windGustsKmh: 82,
    coneAngleDeg: 28,
    trajectory: [
      { timeOffsetMin: -60, timeLabel: '17:00 (-60m)', lat: -23.7500, lng: -46.9000, intensityDbr: 42, speedKmh: 38, probabilityPercent: 100 },
      { timeOffsetMin: -30, timeLabel: '17:30 (-30m)', lat: -23.6600, lng: -46.7600, intensityDbr: 52, speedKmh: 40, probabilityPercent: 100 },
      { timeOffsetMin: 0, timeLabel: 'Agora (18:00)', lat: -23.5800, lng: -46.6200, intensityDbr: 58, speedKmh: 42, probabilityPercent: 100 },
      { timeOffsetMin: 30, timeLabel: '18:30 (+30m)', lat: -23.4900, lng: -46.4800, intensityDbr: 56, speedKmh: 44, probabilityPercent: 92 },
      { timeOffsetMin: 60, timeLabel: '19:00 (+60m)', lat: -23.4000, lng: -46.3400, intensityDbr: 48, speedKmh: 42, probabilityPercent: 84 },
      { timeOffsetMin: 90, timeLabel: '19:30 (+90m)', lat: -23.3200, lng: -46.2000, intensityDbr: 36, speedKmh: 38, probabilityPercent: 71 }
    ]
  },
  {
    id: 'cell-beta-02',
    name: 'Linha de Instabilidade Fluvial Sul',
    hazardType: 'flood',
    severity: 'severe',
    currentLat: -23.6700,
    currentLng: -46.6800,
    headingDegrees: 45,
    speedKmh: 30,
    intensityDbr: 50,
    rainRateMmH: 48,
    windGustsKmh: 64,
    coneAngleDeg: 34,
    trajectory: [
      { timeOffsetMin: -60, timeLabel: '17:00 (-60m)', lat: -23.8200, lng: -46.8500, intensityDbr: 38, speedKmh: 28, probabilityPercent: 100 },
      { timeOffsetMin: -30, timeLabel: '17:30 (-30m)', lat: -23.7400, lng: -46.7600, intensityDbr: 45, speedKmh: 30, probabilityPercent: 100 },
      { timeOffsetMin: 0, timeLabel: 'Agora (18:00)', lat: -23.6700, lng: -46.6800, intensityDbr: 50, speedKmh: 30, probabilityPercent: 100 },
      { timeOffsetMin: 30, timeLabel: '18:30 (+30m)', lat: -23.5900, lng: -46.5900, intensityDbr: 47, speedKmh: 32, probabilityPercent: 88 },
      { timeOffsetMin: 60, timeLabel: '19:00 (+60m)', lat: -23.5100, lng: -46.5000, intensityDbr: 40, speedKmh: 30, probabilityPercent: 78 }
    ]
  }
];

export const FLOOD_RISK_ZONES: FloodRiskZone[] = [
  {
    id: 'frz-tiete',
    name: 'Várzea do Baixo Tietê / Ponte do Limão',
    basin: 'Bacia Hidrográfica do Alto Tietê',
    riskLevel: 'critical',
    currentWaterLevelM: 4.85,
    overflowThresholdM: 4.90,
    historyOfFlooding: 'Recorrente em tempestades > 40mm/h. Alagamento da pista expressa.',
    polygon: [
      { lat: -23.5180, lng: -46.6750 },
      { lat: -23.5120, lng: -46.6500 },
      { lat: -23.5220, lng: -46.6200 },
      { lat: -23.5350, lng: -46.6450 },
      { lat: -23.5290, lng: -46.6720 }
    ]
  },
  {
    id: 'frz-aricanduva',
    name: 'Corredor Aricanduva / Bacia de Retenção',
    basin: 'Sub-bacia do Córrego Aricanduva',
    riskLevel: 'critical',
    currentWaterLevelM: 3.40,
    overflowThresholdM: 3.20,
    historyOfFlooding: 'Transbordamento ativo nos pontos baixos da avenida principal.',
    polygon: [
      { lat: -23.5550, lng: -46.5350 },
      { lat: -23.5480, lng: -46.5100 },
      { lat: -23.5700, lng: -46.4950 },
      { lat: -23.5820, lng: -46.5200 },
      { lat: -23.5680, lng: -46.5420 }
    ]
  },
  {
    id: 'frz-pinheiros',
    name: 'Marginal Pinheiros / Beco do Aprendiz',
    basin: 'Bacia do Rio Pinheiros',
    riskLevel: 'high',
    currentWaterLevelM: 3.10,
    overflowThresholdM: 3.80,
    historyOfFlooding: 'Risco de refluxo de galerias pluviais com vento sul.',
    polygon: [
      { lat: -23.5700, lng: -46.7050 },
      { lat: -23.5900, lng: -46.6950 },
      { lat: -23.6150, lng: -46.6980 },
      { lat: -23.6050, lng: -46.7200 },
      { lat: -23.5800, lng: -46.7180 }
    ]
  },
  {
    id: 'frz-tamanduatei',
    name: 'Bacia Tamanduateí / Ipiranga',
    basin: 'Córrego do Ipiranga e Tamanduateí',
    riskLevel: 'moderate',
    currentWaterLevelM: 2.25,
    overflowThresholdM: 3.00,
    historyOfFlooding: 'Atenção para estrangulamento de drenagem sob viadutos.',
    polygon: [
      { lat: -23.5850, lng: -46.6200 },
      { lat: -23.6020, lng: -46.6050 },
      { lat: -23.6200, lng: -46.6180 },
      { lat: -23.6100, lng: -46.6350 },
      { lat: -23.5900, lng: -46.6320 }
    ]
  }
];

export const RIVER_GAUGES: RiverGauge[] = [
  {
    id: 'rg-01',
    riverName: 'Rio Tietê',
    stationName: 'Ponte Nova das Pesquisas',
    lat: -23.5150,
    lng: -46.6380,
    currentLevelM: 4.85,
    alertLevelM: 4.20,
    overflowLevelM: 4.90,
    status: 'alert',
    trend: 'rising',
    updatedAt: '18:02'
  },
  {
    id: 'rg-02',
    riverName: 'Córrego Aricanduva',
    stationName: 'Estação Ragueb Chohfi',
    lat: -23.5620,
    lng: -46.5180,
    currentLevelM: 3.42,
    alertLevelM: 2.80,
    overflowLevelM: 3.20,
    status: 'overflow',
    trend: 'rising',
    updatedAt: '18:04'
  },
  {
    id: 'rg-03',
    riverName: 'Rio Pinheiros',
    stationName: 'Ponte Cidade Jardim',
    lat: -23.5850,
    lng: -46.6980,
    currentLevelM: 3.12,
    alertLevelM: 3.30,
    overflowLevelM: 3.80,
    status: 'normal',
    trend: 'stable',
    updatedAt: '18:00'
  },
  {
    id: 'rg-04',
    riverName: 'Córrego Pirajuçara',
    stationName: 'Piscinão Sharp',
    lat: -23.6050,
    lng: -46.7350,
    currentLevelM: 2.88,
    alertLevelM: 2.60,
    overflowLevelM: 3.10,
    status: 'attention',
    trend: 'falling',
    updatedAt: '17:58'
  }
];

export const SAFETY_SHELTERS: SafetyShelter[] = [
  {
    id: 'sh-01',
    name: 'Abrigo Municipal Defesa Civil - Penha',
    address: 'Rua General Sócrates, 420 - Penha de França',
    capacity: 250,
    currentOccupancy: 42,
    status: 'open',
    phone: '(11) 3397-0199',
    lat: -23.5280,
    lng: -46.5450
  },
  {
    id: 'sh-02',
    name: 'Centro de Acolhimento Emergencial Vila Prudente',
    address: 'Avenida Francisco Falconi, 980 - Vila Prudente',
    capacity: 180,
    currentOccupancy: 28,
    status: 'open',
    phone: '(11) 2215-4490',
    lat: -23.5850,
    lng: -46.5750
  },
  {
    id: 'sh-03',
    name: 'Ginásio Esportivo Santo Amaro - Ponto Seguro',
    address: 'Rua Padre José de Anchieta, 312 - Santo Amaro',
    capacity: 350,
    currentOccupancy: 0,
    status: 'standby',
    phone: '(11) 5524-1188',
    lat: -23.6520,
    lng: -46.7050
  },
  {
    id: 'sh-04',
    name: 'Centro Social e Comunitário Brasilândia',
    address: 'Estrada do Sabão, 1450 - Brasilândia',
    capacity: 120,
    currentOccupancy: 15,
    status: 'open',
    phone: '(11) 3921-6677',
    lat: -23.4750,
    lng: -46.6850
  }
];

export const OCCURRENCE_HISTORY: OccurrenceHistoryItem[] = [
  {
    id: 'occ-2026-02',
    title: 'Supertempestade de Verão com Granizo e Vento de 92 km/h',
    date: '14 de Fevereiro de 2026',
    year: 2026,
    month: 2,
    hazardType: 'storm',
    severity: 'critical',
    region: 'Zona Sul e Região Metropolitana',
    rainfallAccumulationMm: 112,
    peakRiverLevelM: 4.95,
    affectedPeople: 18500,
    economicImpactBrl: 'R$ 48 milhões',
    description: 'Rajadas violentas derrubaram mais de 240 árvores de grande porte, afetando a distribuição elétrica. Interrupção das linhas férreas e 32 pontos de alagamento transitável.',
    mitigationNotes: 'Acionamento preventivo de sirenes e esvaziamento antecipado de 6 piscinões da bacia do Pirajuçara reduziram o tempo de retenção em 40%.'
  },
  {
    id: 'occ-2025-11',
    title: 'Enchente Relâmpago na Bacia do Rio Tietê e Aricanduva',
    date: '28 de Novembro de 2025',
    year: 2025,
    month: 11,
    hazardType: 'flood',
    severity: 'critical',
    region: 'Zona Leste e Centro Expandido',
    rainfallAccumulationMm: 124,
    peakRiverLevelM: 5.12,
    affectedPeople: 34000,
    economicImpactBrl: 'R$ 72 milhões',
    description: 'Chuva concentrada de 95mm em apenas 70 minutos. Córrego transbordou cobrindo a pista local da marginal por 5 horas.',
    mitigationNotes: 'Resgate de 118 moradores por botes infláveis do Corpo de Bombeiros sem vítimas fatais registradas.'
  },
  {
    id: 'occ-2025-03',
    title: 'Deslizamentos de Massa e Solo Saturado na Serra',
    date: '08 de Março de 2025',
    year: 2025,
    month: 3,
    hazardType: 'landslide',
    severity: 'severe',
    region: 'Encostas Norte / Mairiporã',
    rainfallAccumulationMm: 148,
    affectedPeople: 4200,
    economicImpactBrl: 'R$ 19 milhões',
    description: 'Três dias ininterruptos de garoa densa e temporais isolados elevaram a umidade do solo a 98%, causando 14 escorregamentos superficiais.',
    mitigationNotes: 'Alerta prévio emitido 12h antes possibilitou a desocupação preventiva de 78 residências mapeadas em área de risco R4.'
  },
  {
    id: 'occ-2024-12',
    title: 'Vendaval Severo com Microexplosão Atmosférica (Downburst)',
    date: '19 de Dezembro de 2024',
    year: 2024,
    month: 12,
    hazardType: 'wind',
    severity: 'severe',
    region: 'Zona Oeste e Marginal Pinheiros',
    rainfallAccumulationMm: 68,
    affectedPeople: 12000,
    economicImpactBrl: 'R$ 31 milhões',
    description: 'Ventos descendentes atingiram 104 km/h registrados no aeroporto de Congonhas. Destelhamento de galpões e queda de estruturas metálicas.',
    mitigationNotes: 'Protocolo de resiliência acionado em 15 minutos pelas concessionárias de serviços públicos.'
  },
  {
    id: 'occ-2024-01',
    title: 'Inundação Generalizada por Onda de Monção de Verão',
    date: '22 de Janeiro de 2024',
    year: 2024,
    month: 1,
    hazardType: 'flood',
    severity: 'critical',
    region: 'Toda a Região Metropolitana',
    rainfallAccumulationMm: 165,
    peakRiverLevelM: 5.35,
    affectedPeople: 62000,
    economicImpactBrl: 'R$ 115 milhões',
    description: 'Maior precipitação diária da década para o mês de janeiro. Todos os rios metropolitanos atingiram a cota máxima de transbordamento simultâneo.',
    mitigationNotes: 'Abertura de comportas de emergência e ativação de 14 abrigos provisórios da rede da Defesa Civil.'
  },
  {
    id: 'occ-2023-10',
    title: 'Ciclone Extratropical e Linha de Instabilidade Pré-Frontal',
    date: '11 de Outubro de 2023',
    year: 2023,
    month: 10,
    hazardType: 'storm',
    severity: 'severe',
    region: 'Litoral e Planalto Paulista',
    rainfallAccumulationMm: 88,
    affectedPeople: 15600,
    economicImpactBrl: 'R$ 37 milhões',
    description: 'Queda brusca de pressão barométrica gerou ventos sustentados de 70 km/h com rajadas de 89 km/h e maré de tempestade.',
    mitigationNotes: 'Interrupção preventiva da travessia de balsas e sinalização de risco em orla.'
  },
  {
    id: 'occ-2022-02',
    title: 'Inundação na Bacia do Córrego do Ipiranga e Tamanduateí',
    date: '02 de Fevereiro de 2022',
    year: 2022,
    month: 2,
    hazardType: 'flood',
    severity: 'warning',
    region: 'Ipiranga e São Caetano',
    rainfallAccumulationMm: 79,
    peakRiverLevelM: 3.85,
    affectedPeople: 8900,
    economicImpactBrl: 'R$ 14 milhões',
    description: 'Alagamento em vias de escoamento e garagens subterrâneas em bairros residenciais.',
    mitigationNotes: 'Equipes de hidrojateamento liberaram os bueiros em 3 horas após o escoamento.'
  }
];

export const CLIMATE_TRENDS_YEARLY: ClimateTrendData[] = [
  { year: 2020, totalRainfallMm: 1420, historicalAverageMm: 1480, extremeEventsCount: 14, floodOccurrences: 6, severeStormsCount: 8, maxDailyRainMm: 98 },
  { year: 2021, totalRainfallMm: 1390, historicalAverageMm: 1480, extremeEventsCount: 16, floodOccurrences: 7, severeStormsCount: 9, maxDailyRainMm: 105 },
  { year: 2022, totalRainfallMm: 1510, historicalAverageMm: 1480, extremeEventsCount: 19, floodOccurrences: 9, severeStormsCount: 10, maxDailyRainMm: 118 },
  { year: 2023, totalRainfallMm: 1640, historicalAverageMm: 1480, extremeEventsCount: 24, floodOccurrences: 11, severeStormsCount: 13, maxDailyRainMm: 132 },
  { year: 2024, totalRainfallMm: 1785, historicalAverageMm: 1480, extremeEventsCount: 29, floodOccurrences: 14, severeStormsCount: 15, maxDailyRainMm: 165 },
  { year: 2025, totalRainfallMm: 1820, historicalAverageMm: 1480, extremeEventsCount: 32, floodOccurrences: 16, severeStormsCount: 16, maxDailyRainMm: 152 },
  { year: 2026, totalRainfallMm: 1890, historicalAverageMm: 1480, extremeEventsCount: 36, floodOccurrences: 18, severeStormsCount: 18, maxDailyRainMm: 172 }
];

export const MONTHLY_PRECIPITATION_DATA: MonthlyRainfall[] = [
  { month: 'Jan', observedMm: 295, climatologicalBaselineMm: 238, anomalyPercent: +23.9 },
  { month: 'Fev', observedMm: 280, climatologicalBaselineMm: 215, anomalyPercent: +30.2 },
  { month: 'Mar', observedMm: 220, climatologicalBaselineMm: 178, anomalyPercent: +23.6 },
  { month: 'Abr', observedMm: 115, climatologicalBaselineMm: 85, anomalyPercent: +35.3 },
  { month: 'Mai', observedMm: 82, climatologicalBaselineMm: 68, anomalyPercent: +20.6 },
  { month: 'Jun', observedMm: 45, climatologicalBaselineMm: 52, anomalyPercent: -13.5 },
  { month: 'Jul', observedMm: 38, climatologicalBaselineMm: 48, anomalyPercent: -20.8 },
  { month: 'Ago', observedMm: 42, climatologicalBaselineMm: 45, anomalyPercent: -6.7 },
  { month: 'Set', observedMm: 125, climatologicalBaselineMm: 82, anomalyPercent: +52.4 },
  { month: 'Out', observedMm: 170, climatologicalBaselineMm: 128, anomalyPercent: +32.8 },
  { month: 'Nov', observedMm: 215, climatologicalBaselineMm: 145, anomalyPercent: +48.3 },
  { month: 'Dez', observedMm: 263, climatologicalBaselineMm: 196, anomalyPercent: +34.2 }
];

export const DEFAULT_PUSH_SETTINGS: PushNotificationSettings = {
  enabled: true,
  minSeverity: 'warning',
  radiusKm: 25,
  soundEnabled: true,
  vibrateEnabled: true,
  notifyStorms: true,
  notifyFloods: true,
  notifyLandslides: true,
  notifyHighWinds: true,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '06:00'
};
