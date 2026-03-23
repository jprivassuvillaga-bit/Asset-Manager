import { format, subDays } from "date-fns";

export type LocalRelevance = "ALTA" | "MEDIA" | "BAJA";

export interface Region {
  id: string;
  name: string;
  neighborhoods: string[];
}

export interface CompetitorOffer {
  id: string;
  detectedDate: string;
  competitor: string;
  adImageUrl: string;
  adCaption: string;
  plan: string;
  price: number;
  speedMbps: number;
  inferredLocation: string;
  specificLocation: string;
  offerType: string;
  sourceUrl: string;
  localRelevance: LocalRelevance;
  isNew: boolean;
}

export interface PriceComparison {
  competitor: string;
  avgPricePerMbps: number;
  avgPrice: number;
  offerCount: number;
  minPrice: number;
  maxPrice: number;
}

export interface MarketShare {
  competitor: string;
  offerCount: number;
  percentage: number;
  color: string;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  lastUpdated: string;
}

export interface MapPoint {
  lat: number;
  lng: number;
  competitor: string;
  plan: string;
  price: number;
  neighborhood: string;
  intensity: "high" | "medium" | "low";
}

export interface DashboardSummary {
  totalOffersDetected: number;
  highRelevanceOffers: number;
  competitorsTracked: number;
  avgMarketPrice: number;
  lastRefresh: string;
  alertsCount: number;
  newOffersCount: number;
  selectedRegionName: string;
}

export const REGIONS: Region[] = [
  {
    id: "sur",
    name: "Sur de Quito",
    neighborhoods: ["Quitumbe", "Chillogallo", "Solanda", "La Ecuatoriana", "Guajaló", "La Ajaví", "La Mena", "Turubamba"],
  },
  {
    id: "centro",
    name: "Centro de Quito",
    neighborhoods: ["La Mariscal", "Centro Histórico", "La Floresta", "Chimbacalle", "El Panecillo"],
  },
  {
    id: "norte",
    name: "Norte de Quito",
    neighborhoods: ["González Suárez", "El Batán", "Quito Norte", "Carcelén", "Cotocollao", "Ponceano"],
  },
  {
    id: "valles",
    name: "Valles",
    neighborhoods: ["Cumbayá", "Tumbaco", "Los Chillos", "Sangolquí", "Conocoto"],
  },
];

const ALL_NEIGHBORHOODS = REGIONS.flatMap((r) => r.neighborhoods);

const REGION_BY_NEIGHBORHOOD: Record<string, string> = {};
for (const region of REGIONS) {
  for (const nb of region.neighborhoods) {
    REGION_BY_NEIGHBORHOOD[nb] = region.name;
  }
}

const COMPETITORS = ["Netlife", "PuntoNet", "Celerity", "CNT"];

const COMPETITOR_COLORS: Record<string, string> = {
  Netlife: "hsl(11, 100%, 58%)",
  PuntoNet: "hsl(220, 90%, 56%)",
  Celerity: "hsl(36, 90%, 56%)",
  CNT: "hsl(143, 90%, 56%)",
};

const PLANS = [
  { name: "Plan 100 Mbps", speed: 100 },
  { name: "Plan 200 Mbps", speed: 200 },
  { name: "Plan 300 Mbps", speed: 300 },
  { name: "Plan 500 Mbps", speed: 500 },
  { name: "Plan 1 Gbps", speed: 1000 },
];

const OFFER_TYPES = [
  "Instalación Gratis",
  "Descuento Mensual",
  "Primer Mes Gratis",
  "Equipo WiFi Incluido",
  "Bundle TV + Internet",
  "Promoción Anual",
];

const AD_CAPTIONS: Record<string, string[]> = {
  Netlife: [
    "¡Navega sin límites con Netlife! Oferta especial en el Sur de Quito.",
    "Conecta tu hogar en Chillogallo con la mejor fibra óptica. Solo este mes.",
    "Netlife llega a Quitumbe: Internet de alta velocidad para toda tu familia.",
    "¡Nuevo plan disponible en Solanda! Instalación gratis por tiempo limitado.",
    "Descuento del 30% el primer año en Netlife. ¡Aplica en todo Ecuador!",
    "Netlife en La Mariscal: la fibra más rápida del Norte. ¡Contrata ya!",
    "Cobertura total Netlife en Cumbayá y Tumbaco. Internet real sin cortes.",
  ],
  PuntoNet: [
    "PuntoNet en el Sur: Planes desde $19.99/mes. ¡Contrata hoy!",
    "Cobertura total en Chillogallo. PuntoNet fibra óptica.",
    "¿Buscas internet rápido en Quito? PuntoNet tiene la mejor oferta.",
    "Expansión PuntoNet en Quitumbe. Wi-Fi gratis incluido.",
    "Oferta especial: Internet PuntoNet con descuento mensual por 6 meses.",
    "PuntoNet llega a Solanda con su mejor plan por solo $22.99/mes.",
    "Internet PuntoNet en Los Chillos — fibra simétrica sin cláusulas.",
  ],
  Celerity: [
    "Celerity Internet: La velocidad que necesitas en el Sur de Quito.",
    "¡Celerity llega a Solanda! Planes desde $24.99 con instalación gratis.",
    "Navega rápido con Celerity. Ofertas disponibles en todo Quito.",
    "Nuevo en Guajaló: Internet Celerity sin cláusulas de permanencia.",
    "Celerity vs la competencia: Más velocidad, menor precio. ¡Pruébanos!",
    "Celerity estrena cobertura en La Ajaví. Fibra óptica desde $21.99.",
    "Plan Celerity 500 Mbps ahora disponible en González Suárez.",
  ],
  CNT: [
    "CNT EP: El internet del Estado al servicio del Sur de Quito.",
    "Conecta tu negocio con CNT. Fibra óptica en Chillogallo y Quitumbe.",
    "Plan especial CNT para hogares en Solanda. ¡Llama hoy!",
    "CNT amplía cobertura en La Ecuatoriana. Internet desde $15.99/mes.",
    "Bundle CNT: Internet + TV por cable a precio especial en Quito Sur.",
    "CNT fibra óptica llega a La Ajaví y Turubamba. ¡El precio más bajo!",
    "CNT en Sangolquí: cobertura nueva con plan familiar desde $17.99/mes.",
  ],
};

const PRICE_RANGES: Record<string, Record<number, [number, number]>> = {
  Netlife: { 100: [24, 32], 200: [34, 42], 300: [44, 55], 500: [59, 72], 1000: [89, 110] },
  PuntoNet: { 100: [19, 27], 200: [28, 38], 300: [39, 49], 500: [52, 65], 1000: [79, 99] },
  Celerity: { 100: [21, 29], 200: [30, 40], 300: [41, 52], 500: [55, 68], 1000: [82, 105] },
  CNT: { 100: [15, 22], 200: [23, 31], 300: [32, 42], 500: [45, 58], 1000: [69, 89] },
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function pickFromArray<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

function randomInRange(min: number, max: number, seed: number): number {
  return Math.round((min + seededRandom(seed) * (max - min)) * 100) / 100;
}

function classifyRelevance(
  caption: string,
  neighborhood: string
): { specificLocation: string; localRelevance: LocalRelevance } {
  const surKeywords = ["Sur de Quito", "Quitumbe", "Chillogallo", "Solanda", "La Ecuatoriana", "Guajaló", "La Ajaví", "La Mena", "Turubamba"];
  const captionAndNb = `${caption} ${neighborhood}`;

  for (const kw of surKeywords) {
    if (captionAndNb.toLowerCase().includes(kw.toLowerCase())) {
      return { specificLocation: neighborhood, localRelevance: "ALTA" };
    }
  }
  if (captionAndNb.toLowerCase().includes("quito") || captionAndNb.toLowerCase().includes("sur")) {
    return { specificLocation: neighborhood, localRelevance: "MEDIA" };
  }
  return { specificLocation: neighborhood, localRelevance: "BAJA" };
}

function generateOffers(daysBack = 30): CompetitorOffer[] {
  const offers: CompetitorOffer[] = [];
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");

  let seed = 42;

  for (let d = 0; d < daysBack; d++) {
    const date = subDays(today, d);
    const dateStr = format(date, "yyyy-MM-dd");
    const dayOfWeek = date.getDay();
    const offersPerDay = dayOfWeek === 0 || dayOfWeek === 6 ? 10 : 6;

    for (let i = 0; i < offersPerDay; i++) {
      seed++;
      const competitor = pickFromArray(COMPETITORS, seed);
      seed++;
      const plan = pickFromArray(PLANS, seed);
      seed++;
      const neighborhood = pickFromArray(ALL_NEIGHBORHOODS, seed);
      const regionName = REGION_BY_NEIGHBORHOOD[neighborhood] ?? "Todo Quito";

      seed++;
      const caption = pickFromArray(AD_CAPTIONS[competitor], seed);
      seed++;
      const offerType = pickFromArray(OFFER_TYPES, seed);

      const priceRange = PRICE_RANGES[competitor][plan.speed] ?? [20, 50];
      seed++;
      const price = randomInRange(priceRange[0], priceRange[1], seed);

      const { specificLocation, localRelevance } = classifyRelevance(caption, neighborhood);
      const isNew = dateStr === todayStr;
      const offerId = `${competitor.toLowerCase()}-${dateStr}-${i}`;

      offers.push({
        id: offerId,
        detectedDate: dateStr,
        competitor,
        adImageUrl: `https://picsum.photos/seed/${offerId}/400/250`,
        adCaption: caption,
        plan: plan.name,
        price,
        speedMbps: plan.speed,
        inferredLocation: regionName,
        specificLocation,
        offerType,
        sourceUrl: `https://www.instagram.com/p/${offerId.replace(/[^a-z0-9]/g, "")}`,
        localRelevance,
        isNew,
      });
    }
  }

  return offers.sort((a, b) => b.detectedDate.localeCompare(a.detectedDate));
}

const MAP_POINTS_BASE: Array<{
  lat: number;
  lng: number;
  neighborhood: string;
  competitor: string;
  speed: number;
  baseSeed: number;
}> = [
  { lat: -0.298, lng: -78.573, neighborhood: "Chillogallo", competitor: "Netlife", speed: 300, baseSeed: 1 },
  { lat: -0.298, lng: -78.573, neighborhood: "Chillogallo", competitor: "PuntoNet", speed: 200, baseSeed: 2 },
  { lat: -0.315, lng: -78.561, neighborhood: "Quitumbe", competitor: "Netlife", speed: 500, baseSeed: 3 },
  { lat: -0.315, lng: -78.561, neighborhood: "Quitumbe", competitor: "CNT", speed: 100, baseSeed: 4 },
  { lat: -0.315, lng: -78.561, neighborhood: "Quitumbe", competitor: "PuntoNet", speed: 300, baseSeed: 5 },
  { lat: -0.282, lng: -78.544, neighborhood: "Solanda", competitor: "Celerity", speed: 200, baseSeed: 6 },
  { lat: -0.282, lng: -78.544, neighborhood: "Solanda", competitor: "Netlife", speed: 300, baseSeed: 7 },
  { lat: -0.334, lng: -78.556, neighborhood: "La Ecuatoriana", competitor: "CNT", speed: 100, baseSeed: 8 },
  { lat: -0.267, lng: -78.520, neighborhood: "Guajaló", competitor: "Celerity", speed: 200, baseSeed: 9 },
  { lat: -0.350, lng: -78.540, neighborhood: "La Ajaví", competitor: "CNT", speed: 100, baseSeed: 17 },
  { lat: -0.350, lng: -78.540, neighborhood: "La Ajaví", competitor: "Celerity", speed: 200, baseSeed: 18 },
  { lat: -0.360, lng: -78.548, neighborhood: "Turubamba", competitor: "PuntoNet", speed: 100, baseSeed: 19 },
  { lat: -0.340, lng: -78.535, neighborhood: "La Mena", competitor: "Netlife", speed: 300, baseSeed: 20 },
  { lat: -0.217, lng: -78.489, neighborhood: "La Mariscal", competitor: "Netlife", speed: 1000, baseSeed: 10 },
  { lat: -0.217, lng: -78.489, neighborhood: "La Mariscal", competitor: "PuntoNet", speed: 500, baseSeed: 11 },
  { lat: -0.196, lng: -78.441, neighborhood: "González Suárez", competitor: "Netlife", speed: 1000, baseSeed: 12 },
  { lat: -0.207, lng: -78.479, neighborhood: "El Batán", competitor: "Celerity", speed: 300, baseSeed: 13 },
  { lat: -0.192, lng: -78.427, neighborhood: "Cumbayá", competitor: "PuntoNet", speed: 500, baseSeed: 14 },
  { lat: -0.186, lng: -78.403, neighborhood: "Tumbaco", competitor: "CNT", speed: 200, baseSeed: 15 },
  { lat: -0.362, lng: -78.488, neighborhood: "Los Chillos", competitor: "Netlife", speed: 300, baseSeed: 16 },
];

export function generateMapPoints(location?: string): MapPoint[] {
  return MAP_POINTS_BASE.map((p) => {
    const priceRange = PRICE_RANGES[p.competitor][p.speed] ?? [20, 50];
    const price = randomInRange(priceRange[0], priceRange[1], p.baseSeed * 13);
    const intensity: "high" | "medium" | "low" =
      ["Chillogallo", "Quitumbe"].includes(p.neighborhood)
        ? "high"
        : ["Solanda", "La Ecuatoriana", "La Ajaví"].includes(p.neighborhood)
        ? "medium"
        : "low";

    return {
      lat: p.lat + (seededRandom(p.baseSeed * 7) - 0.5) * 0.005,
      lng: p.lng + (seededRandom(p.baseSeed * 11) - 0.5) * 0.005,
      competitor: p.competitor,
      plan: `Plan ${p.speed} Mbps`,
      price,
      neighborhood: p.neighborhood,
      intensity,
    };
  }).filter((pt) => matchesLocationFilter(pt.neighborhood, location));
}

function matchesLocationFilter(neighborhood: string, location?: string): boolean {
  if (!location || location === "Todo Quito" || location === "all" || location === "") return true;
  const region = REGIONS.find((r) => r.name === location || r.id === location);
  if (region) return region.neighborhoods.includes(neighborhood);
  return neighborhood.toLowerCase().includes(location.toLowerCase());
}

let cachedOffers: CompetitorOffer[] | null = null;
let cacheDate: string | null = null;

export function getAllOffers(): CompetitorOffer[] {
  const today = format(new Date(), "yyyy-MM-dd");
  if (cachedOffers && cacheDate === today) return cachedOffers;
  cachedOffers = generateOffers(30);
  cacheDate = today;
  return cachedOffers;
}

export function filterOffers(
  offers: CompetitorOffer[],
  params: {
    competitor?: string | string[];
    location?: string;
    neighborhoods?: string | string[];
    dateFrom?: string;
    dateTo?: string;
  }
): CompetitorOffer[] {
  let filtered = [...offers];

  if (params.competitor) {
    const comps = Array.isArray(params.competitor)
      ? params.competitor
      : params.competitor.split(",").map((c) => c.trim()).filter(Boolean);
    if (comps.length > 0) {
      filtered = filtered.filter((o) => comps.includes(o.competitor));
    }
  }

  if (params.neighborhoods) {
    const nbs = Array.isArray(params.neighborhoods)
      ? params.neighborhoods
      : params.neighborhoods.split(",").map((n) => n.trim()).filter(Boolean);
    if (nbs.length > 0) {
      filtered = filtered.filter((o) => nbs.includes(o.specificLocation));
      return applyDateFilter(filtered, params);
    }
  }

  if (params.location && params.location !== "all" && params.location !== "Todo Quito" && params.location !== "") {
    const loc = params.location;
    const region = REGIONS.find((r) => r.name === loc || r.id === loc);
    if (region) {
      filtered = filtered.filter((o) => region.neighborhoods.includes(o.specificLocation));
    } else {
      filtered = filtered.filter(
        (o) =>
          o.specificLocation.toLowerCase().includes(loc.toLowerCase()) ||
          o.inferredLocation.toLowerCase().includes(loc.toLowerCase())
      );
    }
  }

  return applyDateFilter(filtered, params);
}

function applyDateFilter(
  offers: CompetitorOffer[],
  params: { dateFrom?: string; dateTo?: string }
): CompetitorOffer[] {
  let filtered = offers;
  if (params.dateFrom) filtered = filtered.filter((o) => o.detectedDate >= params.dateFrom!);
  if (params.dateTo) filtered = filtered.filter((o) => o.detectedDate <= params.dateTo!);
  return filtered;
}

export function computePriceComparison(offers: CompetitorOffer[]): PriceComparison[] {
  const byCompetitor: Record<string, CompetitorOffer[]> = {};
  for (const o of offers) {
    if (!byCompetitor[o.competitor]) byCompetitor[o.competitor] = [];
    byCompetitor[o.competitor].push(o);
  }

  return Object.entries(byCompetitor).map(([competitor, items]) => {
    const prices = items.map((i) => i.price);
    const pricesPerMbps = items.map((i) => i.price / i.speedMbps);
    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

    return {
      competitor,
      avgPricePerMbps: Math.round(avg(pricesPerMbps) * 100) / 100,
      avgPrice: Math.round(avg(prices) * 100) / 100,
      offerCount: items.length,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  });
}

export function computeMarketShare(offers: CompetitorOffer[]): MarketShare[] {
  const counts: Record<string, number> = {};
  for (const o of offers) {
    counts[o.competitor] = (counts[o.competitor] ?? 0) + 1;
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([competitor, offerCount]) => ({
      competitor,
      offerCount,
      percentage: total > 0 ? Math.round((offerCount / total) * 1000) / 10 : 0,
      color: COMPETITOR_COLORS[competitor] ?? "hsl(var(--primary))",
    }));
}

const SWOT_DATA: Record<string, { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] }> = {
  default: {
    strengths: [
      "Netlife mantiene la mayor presencia en Chillogallo con 8 anuncios activos esta semana",
      "CNT ofrece los precios más bajos del mercado en planes de 100 Mbps ($15-22/mes)",
      "PuntoNet intensificó campañas en Quitumbe con promociones de instalación gratuita",
      "Celerity lanzó bundle TV+Internet con descuento del 25% en Solanda",
    ],
    weaknesses: [
      "Celerity reporta múltiples quejas de servicio técnico en Guajaló (simulado Twitter)",
      "CNT muestra tiempos de instalación lentos según comentarios simulados de clientes",
      "PuntoNet tiene cobertura limitada en La Ecuatoriana vs. Nettplus",
      "Netlife registra caídas de servicio los fines de semana según datos simulados",
    ],
    opportunities: [
      "Ningún competidor tiene presencia fuerte en el sector de La Ajaví",
      "La brecha de precio entre CNT y los privados permite posicionamiento de valor premium",
      "Crecimiento de demanda de 500 Mbps+ en zonas residenciales nuevas del Sur",
      "Temporada escolar genera alta demanda de planes familiares en el Sur",
    ],
    threats: [
      "Netlife bajó precios en Chillogallo un 15% este mes — riesgo de churn",
      "PuntoNet expandió cobertura a 3 nuevos sectores en el Sur esta semana",
      "CNT podría recibir subsidio estatal para acelerar instalaciones",
      "Celerity anuncia fibra simétrica de 1 Gbps a precio competitivo para Q2",
    ],
  },
  "Sur de Quito": {
    strengths: [
      "Netlife domina Chillogallo con 12 anuncios de alta relevancia esta semana",
      "PuntoNet es el más agresivo en precio en Quitumbe ($19.99/mes por 100 Mbps)",
      "Celerity con instalación gratis activa en Solanda y sectores aledaños",
      "CNT expande fibra óptica en La Ecuatoriana y La Ajaví con apoyo municipal",
    ],
    weaknesses: [
      "Celerity tiene ratio de quejas 3x mayor en el Sur vs. el Norte de Quito",
      "CNT tiene velocidades reales 40% menores a las prometidas en el Sur",
      "PuntoNet sin cobertura confirmada en Turubamba y La Mena",
      "Netlife reporta demoras de 2-3 semanas en instalación en sectores del Sur",
    ],
    opportunities: [
      "La Ajaví y Turubamba tienen baja penetración de fibra óptica — mercado virgen",
      "Proyectos de vivienda nueva en Quitumbe sin ISP dominante establecido",
      "Demanda creciente de trabajo remoto impulsa necesidad de mayor ancho de banda",
      "Alianza con municipio del Sur podría dar ventaja de acceso a infraestructura",
    ],
    threats: [
      "Netlife lanza campaña de fidelización con 2 meses gratis en Chillogallo",
      "PuntoNet y CNT anunciaron expansión conjunta de red en el Sur para Q3",
      "Celerity baja precio de plan 300 Mbps a $38/mes en Solanda",
      "Gobierno anuncia subsidio de conectividad para zonas Sur de Quito",
    ],
  },
};

export function getSwotAnalysis(location?: string, competitor?: string): SwotAnalysis {
  const data =
    location && SWOT_DATA[location] ? SWOT_DATA[location] : SWOT_DATA["default"];

  if (competitor && competitor !== "all") {
    return {
      strengths: data.strengths.filter((s) => s.includes(competitor)).slice(0, 2).concat(data.strengths.slice(0, 1)),
      weaknesses: data.weaknesses.filter((s) => s.includes(competitor)).slice(0, 2).concat(data.weaknesses.slice(0, 1)),
      opportunities: data.opportunities,
      threats: data.threats.filter((s) => s.includes(competitor)).slice(0, 2).concat(data.threats.slice(0, 1)),
      lastUpdated: new Date().toISOString(),
    };
  }

  return { ...data, lastUpdated: new Date().toISOString() };
}

export function getDashboardSummary(location?: string, neighborhoods?: string): DashboardSummary {
  const allOffers = getAllOffers();
  const nbs = neighborhoods ? neighborhoods.split(",").map((n) => n.trim()).filter(Boolean) : [];
  const filtered = filterOffers(allOffers, { location, neighborhoods: nbs.length ? nbs : undefined });
  const highRelevance = filtered.filter((o) => o.localRelevance === "ALTA");
  const newOffers = filtered.filter((o) => o.isNew);
  const avgPrice = filtered.length > 0 ? filtered.reduce((a, o) => a + o.price, 0) / filtered.length : 0;

  let regionName = "Todo Quito";
  if (nbs.length > 0) regionName = nbs.join(", ");
  else if (location && location !== "Todo Quito" && location !== "all") regionName = location;

  return {
    totalOffersDetected: filtered.length,
    highRelevanceOffers: highRelevance.length,
    competitorsTracked: 4,
    avgMarketPrice: Math.round(avgPrice * 100) / 100,
    lastRefresh: new Date().toISOString(),
    alertsCount: newOffers.filter((o) => o.localRelevance === "ALTA").length,
    newOffersCount: newOffers.length,
    selectedRegionName: regionName,
  };
}
