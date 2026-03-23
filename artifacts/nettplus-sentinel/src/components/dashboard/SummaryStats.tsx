import { useGetCompetitorSummary } from "@workspace/api-client-react";
import { Activity, AlertTriangle, Crosshair, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

export function SummaryStats() {
  const { data: summary, isLoading, isError } = useGetCompetitorSummary();

  const stats = [
    {
      title: "Ofertas Detectadas",
      value: summary?.totalOffersDetected ?? 0,
      icon: Activity,
      color: "text-primary",
      bg: "bg-primary/10",
      delay: 0.1
    },
    {
      title: "Ofertas Alta Relevancia",
      value: summary?.highRelevanceOffers ?? 0,
      icon: AlertTriangle,
      color: "text-warning",
      bg: "bg-warning/10",
      delay: 0.2
    },
    {
      title: "Competidores Activos",
      value: summary?.competitorsTracked ?? 0,
      icon: Crosshair,
      color: "text-success",
      bg: "bg-success/10",
      delay: 0.3
    },
    {
      title: "Precio Promedio Mercado",
      value: summary ? formatCurrency(summary.avgMarketPrice) : "$0.00",
      icon: DollarSign,
      color: "text-comp-puntonet",
      bg: "bg-comp-puntonet/10",
      delay: 0.4
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass-panel p-6 rounded-2xl animate-pulse h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: stat.delay }}
          className="glass-panel p-6 rounded-2xl relative overflow-hidden group"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150 opacity-20 bg-current" style={{ color: "inherit" }} />
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
              <h3 className="text-3xl font-display font-bold text-foreground">
                {stat.value}
              </h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
