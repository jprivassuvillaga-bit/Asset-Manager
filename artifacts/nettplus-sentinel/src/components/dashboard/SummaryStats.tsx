import { useGetCompetitorSummary } from "@workspace/api-client-react";
import { Activity, AlertTriangle, Crosshair, DollarSign, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { DashboardFilters } from "@/hooks/use-dashboard-filters";

interface SummaryStatsProps {
  filters: DashboardFilters;
}

export function SummaryStats({ filters }: SummaryStatsProps) {
  const neighborhoodsParam = filters.neighborhoods.join(",");
  const { data: summary, isLoading } = useGetCompetitorSummary({
    location: filters.location,
    neighborhoods: neighborhoodsParam || undefined,
  });

  const stats = [
    {
      title: "Ofertas Detectadas",
      value: summary?.totalOffersDetected ?? 0,
      icon: Activity,
      color: "text-primary",
      bg: "bg-primary/10",
      delay: 0.0,
    },
    {
      title: "Alta Relevancia",
      value: summary?.highRelevanceOffers ?? 0,
      icon: AlertTriangle,
      color: "text-[hsl(36,90%,56%)]",
      bg: "bg-[hsl(36,90%,56%)]/10",
      delay: 0.05,
    },
    {
      title: "Competidores Activos",
      value: summary?.competitorsTracked ?? 4,
      icon: Crosshair,
      color: "text-[hsl(143,90%,56%)]",
      bg: "bg-[hsl(143,90%,56%)]/10",
      delay: 0.1,
    },
    {
      title: "Precio Prom. Mercado",
      value: summary ? formatCurrency(summary.avgMarketPrice) : "$0.00",
      icon: DollarSign,
      color: "text-[hsl(220,90%,56%)]",
      bg: "bg-[hsl(220,90%,56%)]/10",
      delay: 0.15,
    },
  ];

  const newOffersCount = summary?.newOffersCount ?? 0;
  const regionName = summary?.selectedRegionName ?? filters.location;

  if (isLoading) {
    return (
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl animate-pulse h-28" />
          ))}
        </div>
        <div className="glass-panel h-16 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: stat.delay }}
            className="glass-panel p-5 rounded-2xl relative overflow-hidden group"
          >
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">{stat.title}</p>
                <h3 className="text-2xl font-display font-bold text-foreground">{stat.value}</h3>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* New Offers Alert Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className={`rounded-2xl px-5 py-4 flex items-center gap-4 border ${
          newOffersCount > 0
            ? "bg-primary/10 border-primary/30"
            : "bg-white/[0.02] border-white/5"
        }`}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          newOffersCount > 0 ? "bg-primary/20" : "bg-white/5"
        }`}>
          <Sparkles className={`w-5 h-5 ${newOffersCount > 0 ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className={`text-2xl font-display font-bold ${
              newOffersCount > 0 ? "text-primary" : "text-muted-foreground"
            }`}>
              {newOffersCount}
            </span>
            <span className="text-sm text-muted-foreground">
              {newOffersCount === 1 ? "oferta nueva detectada" : "ofertas nuevas detectadas"} hoy
              {" "}en{" "}
              <span className="text-foreground font-medium">{regionName}</span>
            </span>
          </div>
          {newOffersCount > 0 && (
            <p className="text-xs text-primary/70 mt-0.5">
              Actividad competitiva en las últimas 24 horas — revisa el Radar para más detalles.
            </p>
          )}
        </div>
        {newOffersCount > 0 && (
          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-white animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              EN VIVO
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
