import { Calendar, MapPin, Target, Shield, CheckSquare, Square } from "lucide-react";
import { DashboardFilters, CompetitorId } from "@/hooks/use-dashboard-filters";
import { cn } from "@/lib/utils";

interface SidebarProps {
  filters: DashboardFilters;
  setLocation: (loc: string) => void;
  setDateRange: (from: string, to: string) => void;
  toggleCompetitor: (comp: CompetitorId) => void;
}

const LOCATIONS = [
  "Todo Quito",
  "Sur de Quito",
  "Quitumbe",
  "Chillogallo",
  "Solanda",
  "Valles",
  "Norte de Quito",
];

const COMPETITORS: { id: CompetitorId; color: string; label: string }[] = [
  { id: "Netlife", color: "text-comp-netlife border-comp-netlife", label: "Netlife" },
  { id: "PuntoNet", color: "text-comp-puntonet border-comp-puntonet", label: "PuntoNet" },
  { id: "Celerity", color: "text-comp-celerity border-comp-celerity", label: "Celerity" },
  { id: "CNT", color: "text-comp-cnt border-comp-cnt", label: "CNT" },
];

export function Sidebar({ filters, setLocation, setDateRange, toggleCompetitor }: SidebarProps) {
  return (
    <aside className="w-72 hidden lg:flex flex-col h-screen fixed left-0 top-0 border-r border-white/5 glass-panel z-40">
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-800 flex items-center justify-center shadow-lg shadow-primary/20">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg leading-tight text-white">Nettplus</h1>
          <p className="text-xs text-primary tracking-widest uppercase font-semibold">Sentinel</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Location Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <h3 className="font-semibold uppercase tracking-wider text-xs">Zona de Monitoreo</h3>
          </div>
          <div className="space-y-1">
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                onClick={() => setLocation(loc)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200",
                  filters.location === loc
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Calendar className="w-4 h-4" />
            <h3 className="font-semibold uppercase tracking-wider text-xs">Rango de Tiempo</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Desde</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setDateRange(e.target.value, filters.dateTo)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Hasta</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setDateRange(filters.dateFrom, e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Competitor Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Target className="w-4 h-4" />
            <h3 className="font-semibold uppercase tracking-wider text-xs">Competidores</h3>
          </div>
          <div className="space-y-2">
            {COMPETITORS.map((comp) => {
              const isSelected = filters.competitors.includes(comp.id);
              return (
                <button
                  key={comp.id}
                  onClick={() => toggleCompetitor(comp.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-white/5 group"
                >
                  <div className={cn("transition-colors", isSelected ? comp.color : "text-muted-foreground")}>
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5 opacity-50 group-hover:opacity-100" />
                    )}
                  </div>
                  <span className={cn(
                    "text-sm font-medium transition-colors",
                    isSelected ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {comp.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </aside>
  );
}
