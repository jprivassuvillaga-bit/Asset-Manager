import { useGetCompetitorOffers } from "@workspace/api-client-react";
import { DashboardFilters } from "@/hooks/use-dashboard-filters";
import { ExternalLink, MapPin, Zap, Sparkles, Clock } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

const COMPETITORS = [
  { id: "Netlife", color: "hsl(11,100%,58%)", bg: "bg-[hsl(11,100%,58%)]", text: "text-[hsl(11,100%,58%)]", border: "border-[hsl(11,100%,58%)]" },
  { id: "PuntoNet", color: "hsl(220,90%,56%)", bg: "bg-[hsl(220,90%,56%)]", text: "text-[hsl(220,90%,56%)]", border: "border-[hsl(220,90%,56%)]" },
  { id: "Celerity", color: "hsl(36,90%,56%)", bg: "bg-[hsl(36,90%,56%)]", text: "text-[hsl(36,90%,56%)]", border: "border-[hsl(36,90%,56%)]" },
  { id: "CNT", color: "hsl(143,90%,56%)", bg: "bg-[hsl(143,90%,56%)]", text: "text-[hsl(143,90%,56%)]", border: "border-[hsl(143,90%,56%)]" },
];

const RELEVANCE_LABEL: Record<string, string> = {
  ALTA: "Alta",
  MEDIA: "Media",
  BAJA: "Baja",
};

export function OfferRadar({ filters }: { filters: DashboardFilters }) {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>("Netlife");

  const neighborhoodsParam = filters.neighborhoods.join(",");

  const { data: offers, isLoading } = useGetCompetitorOffers({
    location: filters.location,
    neighborhoods: neighborhoodsParam || undefined,
    competitor: selectedCompetitor,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  });

  const sorted = [...(offers ?? [])].sort((a, b) => {
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;
    return b.detectedDate.localeCompare(a.detectedDate);
  });

  const newOffers = sorted.filter((o) => o.isNew);
  const olderOffers = sorted.filter((o) => !o.isNew);

  const comp = COMPETITORS.find((c) => c.id === selectedCompetitor)!;

  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      {/* Competitor Tab Bar */}
      <div className="flex border-b border-white/5 overflow-x-auto">
        {COMPETITORS.map((c) => {
          const isActive = selectedCompetitor === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCompetitor(c.id)}
              className={cn(
                "flex-1 min-w-[100px] px-4 py-4 text-sm font-semibold transition-all duration-200 relative whitespace-nowrap flex items-center justify-center gap-2",
                isActive
                  ? "text-white bg-white/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.02]"
              )}
            >
              <span
                className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", isActive ? c.bg : "bg-white/20")}
              />
              {c.id}
              {isActive && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: c.color }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-5">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <MapPin className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">
              Sin ofertas de <span className={cn("font-semibold", comp.text)}>{selectedCompetitor}</span> en este rango.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCompetitor}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* New Offers Section */}
              {newOffers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Hoy — {newOffers.length} nueva{newOffers.length !== 1 ? "s" : ""}
                    </span>
                    <div className="flex-1 h-px bg-primary/20" />
                  </div>
                  <div className="space-y-2">
                    {newOffers.map((offer, idx) => (
                      <OfferRow key={offer.id} offer={offer} comp={comp} idx={idx} isNew />
                    ))}
                  </div>
                </div>
              )}

              {/* Older Offers Section */}
              {olderOffers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Anteriores — {olderOffers.length}
                    </span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <div className="space-y-2">
                    {olderOffers.map((offer, idx) => (
                      <OfferRow key={offer.id} offer={offer} comp={comp} idx={idx} isNew={false} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function OfferRow({
  offer,
  comp,
  idx,
  isNew,
}: {
  offer: any;
  comp: (typeof COMPETITORS)[number];
  idx: number;
  isNew: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: idx * 0.03 }}
      className={cn(
        "flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors group",
        isNew
          ? "bg-primary/[0.04] border-primary/15 hover:bg-primary/[0.07]"
          : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
      )}
    >
      {/* Left: color stripe */}
      <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: comp.color, opacity: isNew ? 1 : 0.35 }} />

      {/* Plan & price */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-foreground">{offer.plan}</span>
          {isNew && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
              NUEVO
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 border border-white/10 text-muted-foreground">
            {offer.offerType}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {offer.specificLocation}
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 flex-shrink-0" />
            {offer.speedMbps} Mbps
          </span>
          <span
            className={cn(
              "font-medium",
              offer.localRelevance === "ALTA"
                ? "text-[hsl(11,100%,58%)]"
                : offer.localRelevance === "MEDIA"
                ? "text-[hsl(36,90%,56%)]"
                : "text-muted-foreground"
            )}
          >
            Relevancia {RELEVANCE_LABEL[offer.localRelevance]}
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="text-right flex-shrink-0">
        <p className={cn("text-lg font-display font-bold", isNew ? "text-primary" : "text-foreground")}>
          {formatCurrency(offer.price)}
        </p>
        <p className="text-[10px] text-muted-foreground">/mes</p>
      </div>

      {/* Date + link */}
      <div className="flex-shrink-0 flex flex-col items-end gap-1">
        <span className="text-[10px] text-muted-foreground">{formatDate(offer.detectedDate)}</span>
        <a
          href={offer.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-0.5 text-[10px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Evidencia <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </motion.div>
  );
}
