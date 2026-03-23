import { useGetPriceComparison } from "@workspace/api-client-react";
import { DashboardFilters } from "@/hooks/use-dashboard-filters";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils";

const COMPETITOR_COLORS: Record<string, string> = {
  "Netlife": "hsl(11, 100%, 58%)",
  "PuntoNet": "hsl(220, 90%, 56%)",
  "Celerity": "hsl(36, 90%, 56%)",
  "CNT": "hsl(143, 90%, 56%)",
  "Nettplus": "hsl(217, 91%, 60%)" // For future reference if Nettplus adds themselves
};

export function PriceComparison({ filters }: { filters: DashboardFilters }) {
  const { data, isLoading } = useGetPriceComparison({
    location: filters.location
  });

  if (isLoading) {
    return <div className="glass-panel h-[400px] rounded-2xl animate-pulse w-full" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass-panel h-[400px] rounded-2xl flex items-center justify-center text-muted-foreground">
        No hay datos suficientes para la comparativa.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-xl">
          <p className="font-display font-bold text-lg mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">
              Costo Promedio: <span className="font-bold text-foreground">{formatCurrency(payload[0].payload.avgPrice)}</span>
            </p>
            <p className="text-muted-foreground">
              Costo por Mbps: <span className="font-bold text-foreground">{formatCurrency(payload[0].payload.avgPricePerMbps)}</span>
            </p>
            <p className="text-muted-foreground mt-2 pt-2 border-t border-white/10">
              Muestra: {payload[0].payload.offerCount} ofertas
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 rounded-2xl">
      <div className="mb-6">
        <h3 className="text-xl font-display font-bold text-foreground">Costo Promedio vs Costo por Mbps</h3>
        <p className="text-sm text-muted-foreground">Sector: {filters.location}</p>
      </div>
      
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="competitor" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            
            <Bar yAxisId="left" dataKey="avgPrice" name="Precio Promedio" radius={[4, 4, 0, 0]} maxBarSize={50}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COMPETITOR_COLORS[entry.competitor] || 'hsl(var(--primary))'} />
              ))}
            </Bar>
            
            <Bar yAxisId="right" dataKey="avgPricePerMbps" name="Precio por Mbps" radius={[4, 4, 0, 0]} maxBarSize={50}>
              {data.map((entry, index) => (
                <Cell key={`cell-mbps-${index}`} fill={COMPETITOR_COLORS[entry.competitor] || 'hsl(var(--primary))'} fillOpacity={0.4} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-white/50" />
          <span>Precio Promedio Mensual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-white/20" />
          <span>Precio por Mbps (escala der.)</span>
        </div>
      </div>
    </div>
  );
}
