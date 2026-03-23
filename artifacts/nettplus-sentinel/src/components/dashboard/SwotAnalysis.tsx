import { useGetSwotAnalysis } from "@workspace/api-client-react";
import { DashboardFilters } from "@/hooks/use-dashboard-filters";
import { ShieldCheck, ShieldAlert, Zap, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export function SwotAnalysis({ filters }: { filters: DashboardFilters }) {
  // Focus SWOT on specific competitor if only one is selected, else general
  const compFilter = filters.competitors.length === 1 ? filters.competitors[0] : undefined;
  
  const { data, isLoading } = useGetSwotAnalysis({
    location: filters.location,
    competitor: compFilter
  });

  if (isLoading) {
    return <div className="glass-panel h-[500px] rounded-2xl animate-pulse" />;
  }

  if (!data) return null;

  const quadrants = [
    {
      title: "Fortalezas Enemigas",
      items: data.strengths,
      icon: ShieldCheck,
      color: "text-destructive",
      bg: "bg-destructive/10 border-destructive/20",
      delay: 0.1
    },
    {
      title: "Debilidades Competencia",
      items: data.weaknesses,
      icon: ShieldAlert,
      color: "text-success",
      bg: "bg-success/10 border-success/20",
      delay: 0.2
    },
    {
      title: "Oportunidades Nettplus",
      items: data.opportunities,
      icon: Zap,
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
      delay: 0.3
    },
    {
      title: "Amenazas en Sector",
      items: data.threats,
      icon: AlertTriangle,
      color: "text-warning",
      bg: "bg-warning/10 border-warning/20",
      delay: 0.4
    }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h3 className="text-xl font-display font-bold text-foreground">Análisis Estratégico FODA</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {compFilter ? `Foco en: ${compFilter}` : "Visión general del mercado"} | Sector: {filters.location}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map((q, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: q.delay }}
            key={i} 
            className={`p-5 rounded-xl border ${q.bg} bg-opacity-5 backdrop-blur-sm`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${q.bg}`}>
                <q.icon className={`w-5 h-5 ${q.color}`} />
              </div>
              <h4 className="font-display font-bold text-lg text-foreground">{q.title}</h4>
            </div>
            
            <ul className="space-y-2">
              {q.items.length > 0 ? (
                q.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${q.bg.split(' ')[0].replace('/10', '')}`} />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground italic">Datos insuficientes.</li>
              )}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
