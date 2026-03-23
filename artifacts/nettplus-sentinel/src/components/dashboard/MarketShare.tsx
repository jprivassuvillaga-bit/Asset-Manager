import { useGetMarketShare } from "@workspace/api-client-react";
import { DashboardFilters } from "@/hooks/use-dashboard-filters";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MarketShareProps {
  filters: DashboardFilters;
}

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percentage,
}: any) => {
  if (percentage < 8) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
      {`${percentage}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-card border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl text-sm">
        <p className="font-display font-bold text-base mb-1">{d.competitor}</p>
        <p className="text-muted-foreground">Ofertas: <span className="font-bold text-foreground">{d.offerCount}</span></p>
        <p className="text-muted-foreground">Participación: <span className="font-bold text-foreground">{d.percentage}%</span></p>
      </div>
    );
  }
  return null;
};

export function MarketShare({ filters }: MarketShareProps) {
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const neighborhoodsParam = filters.neighborhoods.join(",");

  const { data, isLoading } = useGetMarketShare({
    location: filters.location,
    neighborhoods: neighborhoodsParam || undefined,
  });

  if (isLoading) {
    return <div className="glass-panel h-[400px] rounded-2xl animate-pulse" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-2xl flex items-center justify-center text-muted-foreground text-sm">
        Sin datos suficientes para la zona seleccionada.
      </div>
    );
  }

  const regionLabel = filters.neighborhoods.length > 0
    ? filters.neighborhoods.join(", ")
    : filters.location;

  return (
    <div className="glass-panel p-6 rounded-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-8 bg-[hsl(11,100%,58%)] rounded-full" />
            <h2 className="text-xl font-display font-bold text-foreground">Market Share de Ofertas</h2>
          </div>
          <p className="text-sm text-muted-foreground ml-5">
            Zona: <span className="text-foreground">{regionLabel}</span>
          </p>
        </div>
        <div className="flex gap-1 bg-black/30 rounded-lg p-1">
          {(["pie", "bar"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                chartType === type ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {type === "pie" ? "Circular" : "Barras"}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "pie" ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={115}
                innerRadius={55}
                dataKey="offerCount"
                labelLine={false}
                label={renderCustomLabel}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="competitor"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
              <Bar dataKey="offerCount" radius={[5, 5, 0, 0]} maxBarSize={60}>
                {data.map((entry, index) => (
                  <Cell key={`cell-bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend with ranking */}
      <div className="mt-5 space-y-2">
        {data.map((entry, idx) => (
          <div key={entry.competitor} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-4 flex-shrink-0 font-mono">#{idx + 1}</span>
            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-sm text-foreground flex-1">{entry.competitor}</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${entry.percentage}%`, backgroundColor: entry.color }}
                />
              </div>
              <span className="text-xs font-bold text-foreground w-10 text-right">{entry.percentage}%</span>
            </div>
            {idx === 0 && (
              <TrendingUp className="w-3.5 h-3.5 text-[hsl(11,100%,58%)] flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
