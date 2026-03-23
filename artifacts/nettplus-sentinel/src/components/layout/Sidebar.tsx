import { Calendar, MapPin, Target, Shield, CheckSquare, Square, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { DashboardFilters, CompetitorId, REGIONS_CONFIG } from "@/hooks/use-dashboard-filters";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarProps {
  filters: DashboardFilters;
  currentRegion: (typeof REGIONS_CONFIG)[number] | undefined;
  setRegion: (regionId: string) => void;
  toggleNeighborhood: (neighborhood: string) => void;
  setDateRange: (from: string, to: string) => void;
  toggleCompetitor: (comp: CompetitorId) => void;
  resetFilters: () => void;
}

const COMPETITORS: { id: CompetitorId; color: string; dot: string; label: string }[] = [
  { id: "Netlife", color: "text-comp-netlife border-comp-netlife", dot: "bg-comp-netlife", label: "Netlife" },
  { id: "PuntoNet", color: "text-comp-puntonet border-comp-puntonet", dot: "bg-comp-puntonet", label: "PuntoNet" },
  { id: "Celerity", color: "text-comp-celerity border-comp-celerity", dot: "bg-comp-celerity", label: "Celerity" },
  { id: "CNT", color: "text-comp-cnt border-comp-cnt", dot: "bg-comp-cnt", label: "CNT" },
];

const ALL_REGIONS = [{ id: "all", name: "Todo Quito" }, ...REGIONS_CONFIG];

export function Sidebar({
  filters,
  currentRegion,
  setRegion,
  toggleNeighborhood,
  setDateRange,
  toggleCompetitor,
  resetFilters,
}: SidebarProps) {
  const [neighborhoodOpen, setNeighborhoodOpen] = useState(true);

  const availableNeighborhoods = currentRegion?.neighborhoods ?? [];

  return (
    <aside className="w-72 hidden lg:flex flex-col h-screen fixed left-0 top-0 border-r border-white/5 glass-panel z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-800 flex items-center justify-center shadow-lg shadow-primary/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight text-white">Nettplus</h1>
            <p className="text-xs text-primary tracking-widest uppercase font-semibold">Sentinel</p>
          </div>
        </div>
        <button
          onClick={resetFilters}
          className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
          title="Restablecer filtros"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">

        {/* Region Selector */}
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <MapPin className="w-4 h-4" />
            <h3 className="font-semibold uppercase tracking-wider text-xs">Región Principal</h3>
          </div>
          <div className="space-y-1">
            {ALL_REGIONS.map((region) => (
              <button
                key={region.id}
                onClick={() => setRegion(region.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-between",
                  filters.regionId === region.id
                    ? "bg-primary/15 text-primary font-semibold border border-primary/20"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <span>{region.name}</span>
                {filters.regionId === region.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Neighborhood Multi-select — shown only when a region is selected */}
        {currentRegion && availableNeighborhoods.length > 0 && (
          <div>
            <button
              onClick={() => setNeighborhoodOpen((o) => !o)}
              className="flex items-center gap-2 text-muted-foreground mb-3 w-full hover:text-foreground transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <h3 className="font-semibold uppercase tracking-wider text-xs flex-1 text-left">
                Barrios Específicos
              </h3>
              <span className="text-xs text-primary">
                {filters.neighborhoods.length > 0 ? `${filters.neighborhoods.length} sel.` : "Todos"}
              </span>
              {neighborhoodOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {neighborhoodOpen && (
              <div className="space-y-1 pl-1">
                {availableNeighborhoods.map((nb) => {
                  const isSelected = filters.neighborhoods.includes(nb);
                  return (
                    <button
                      key={nb}
                      onClick={() => toggleNeighborhood(nb)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-150",
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 transition-all",
                        isSelected ? "border-primary bg-primary/30" : "border-white/20"
                      )}>
                        {isSelected && <div className="w-2 h-2 rounded-sm bg-primary" />}
                      </div>
                      <span className="truncate">{nb}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Date Range */}
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Calendar className="w-4 h-4" />
            <h3 className="font-semibold uppercase tracking-wider text-xs">Rango de Tiempo</h3>
          </div>
          <div className="space-y-2">
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

        {/* Competitors */}
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Target className="w-4 h-4" />
            <h3 className="font-semibold uppercase tracking-wider text-xs">Competidores</h3>
          </div>
          <div className="space-y-1">
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
                  <div className="flex items-center gap-2 flex-1">
                    <div className={cn("w-2 h-2 rounded-full flex-shrink-0", isSelected ? comp.dot : "bg-white/20")} />
                    <span className={cn(
                      "text-sm font-medium transition-colors",
                      isSelected ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {comp.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </aside>
  );
}
