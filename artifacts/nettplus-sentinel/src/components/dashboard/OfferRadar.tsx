import { useGetCompetitorOffers } from "@workspace/api-client-react";
import { DashboardFilters } from "@/hooks/use-dashboard-filters";
import { Badge } from "@/components/ui/Badge";
import { ExternalLink, MapPin, Zap } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

export function OfferRadar({ filters }: { filters: DashboardFilters }) {
  const neighborhoodsParam = filters.neighborhoods.join(",");

  const { data: offers, isLoading, isError } = useGetCompetitorOffers({
    location: filters.location,
    neighborhoods: neighborhoodsParam || undefined,
    competitor: filters.competitors.join(",") || undefined,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  });

  const getCompetitorVariant = (comp: string) => {
    const c = comp.toLowerCase();
    if (c.includes("netlife")) return "netlife";
    if (c.includes("puntonet")) return "puntonet";
    if (c.includes("celerity")) return "celerity";
    if (c.includes("cnt")) return "cnt";
    return "default";
  };

  const getRelevanceStyle = (rel: string) => {
    if (rel === "ALTA") return "text-[hsl(11,100%,58%)]";
    if (rel === "MEDIA") return "text-[hsl(36,90%,56%)]";
    return "text-muted-foreground";
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-panel h-64 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError || !offers) {
    return (
      <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center">
        <Zap className="w-12 h-12 text-destructive mb-4 opacity-50" />
        <h3 className="text-xl font-display font-bold text-foreground">Error de Conexión</h3>
        <p className="text-muted-foreground max-w-md mt-2">
          No se pudo conectar con el motor de inteligencia. Verifica los filtros o intenta más tarde.
        </p>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-display font-bold text-foreground">Sector Despejado</h3>
        <p className="text-muted-foreground mt-2">
          No se detectaron ofertas con los parámetros actuales.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {offers.map((offer, idx) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.5) }}
          key={offer.id}
          className="glass-panel rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-300"
        >
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <Badge variant={getCompetitorVariant(offer.competitor) as any}>
              {offer.competitor}
            </Badge>
            <div className="flex items-center gap-2">
              {offer.isNew && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  NUEVO
                </span>
              )}
              <div className="flex items-center gap-1 text-xs font-medium">
                <span className={`w-1.5 h-1.5 rounded-full ${offer.localRelevance === "ALTA" ? "animate-pulse bg-[hsl(11,100%,58%)]" : offer.localRelevance === "MEDIA" ? "bg-[hsl(36,90%,56%)]" : "bg-muted-foreground"}`} />
                <span className={getRelevanceStyle(offer.localRelevance)}>
                  {offer.localRelevance}
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 flex-1">
            <h4 className="text-lg font-display font-bold text-foreground mb-1">{offer.plan}</h4>
            <div className="flex items-end gap-1.5 mb-4">
              <span className="text-3xl font-display font-bold text-primary">
                {formatCurrency(offer.price)}
              </span>
              <span className="text-sm text-muted-foreground mb-0.5">/mes</span>
            </div>

            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{offer.speedMbps} Mbps</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{offer.specificLocation}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-muted-foreground">
                {offer.offerType}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3.5 bg-black/20 mt-auto flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {formatDate(offer.detectedDate)}
            </span>
            <a
              href={offer.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Ver Evidencia <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
