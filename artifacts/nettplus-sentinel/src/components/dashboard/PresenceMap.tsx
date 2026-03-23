import { useGetMapPoints } from "@workspace/api-client-react";
import { DashboardFilters } from "@/hooks/use-dashboard-filters";
import { MapPin, Target } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

export function PresenceMap({ filters }: { filters: DashboardFilters }) {
  const { data, isLoading } = useGetMapPoints({
    location: filters.location
  });

  if (isLoading) {
    return <div className="glass-panel h-[500px] rounded-2xl animate-pulse" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl h-full flex flex-col items-center justify-center text-center">
        <MapPin className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground">Sin puntos calientes en este sector.</p>
      </div>
    );
  }

  // Aggregate points by neighborhood for the list view
  const neighborhoods = data.reduce((acc, point) => {
    if (!acc[point.neighborhood]) {
      acc[point.neighborhood] = {
        name: point.neighborhood,
        count: 0,
        competitors: new Set<string>(),
        intensity: "low" as string,
        minPrice: 9999,
      };
    }
    acc[point.neighborhood].count += 1;
    acc[point.neighborhood].competitors.add(point.competitor);
    if (point.price < acc[point.neighborhood].minPrice) {
      acc[point.neighborhood].minPrice = point.price;
    }
    
    // Simplistic intensity logic based on count
    const c = acc[point.neighborhood].count;
    if (c > 5) acc[point.neighborhood].intensity = "high";
    else if (c > 2) acc[point.neighborhood].intensity = "medium";
    
    return acc;
  }, {} as Record<string, any>);

  const sortedZones = Object.values(neighborhoods).sort((a, b) => b.count - a.count);

  return (
    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col relative overflow-hidden">
      {/* Decorative radar background image from requirements */}
      <div 
        className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/radar-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <div className="mb-6 relative z-10">
        <h3 className="text-xl font-display font-bold text-foreground">Zonas Calientes</h3>
        <p className="text-sm text-muted-foreground mt-1">Concentración de despliegue por barrio</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 relative z-10">
        {sortedZones.map((zone, idx) => (
          <div key={idx} className="bg-black/30 border border-white/5 p-4 rounded-xl hover:bg-black/40 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <Target className={`w-4 h-4 ${
                  zone.intensity === 'high' ? 'text-destructive' : 
                  zone.intensity === 'medium' ? 'text-warning' : 'text-primary'
                }`} />
                <h4 className="font-bold text-foreground">{zone.name}</h4>
              </div>
              <Badge variant={
                zone.intensity === 'high' ? 'destructive' : 
                zone.intensity === 'medium' ? 'warning' : 'outline'
              }>
                {zone.count} alertas
              </Badge>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex gap-1.5 flex-wrap max-w-[60%]">
                {Array.from(zone.competitors).map((c: any) => (
                  <span key={c} className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded">
                    {c}
                  </span>
                ))}
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground block">Precio piso:</span>
                <span className="font-bold text-foreground">{formatCurrency(zone.minPrice)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
