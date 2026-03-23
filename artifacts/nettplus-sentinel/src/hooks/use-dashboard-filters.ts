import { useState, useCallback } from "react";

export type CompetitorId = "Netlife" | "PuntoNet" | "Celerity" | "CNT";

export interface DashboardFilters {
  location: string;
  dateFrom: string;
  dateTo: string;
  competitors: CompetitorId[];
}

const defaultFilters: DashboardFilters = {
  location: "Todo Quito",
  dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
  dateTo: new Date().toISOString().split('T')[0], // today
  competitors: ["Netlife", "PuntoNet", "Celerity", "CNT"],
};

export function useDashboardFilters() {
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);

  const setLocation = useCallback((location: string) => {
    setFilters((prev) => ({ ...prev, location }));
  }, []);

  const setDateRange = useCallback((dateFrom: string, dateTo: string) => {
    setFilters((prev) => ({ ...prev, dateFrom, dateTo }));
  }, []);

  const toggleCompetitor = useCallback((competitor: CompetitorId) => {
    setFilters((prev) => {
      const isSelected = prev.competitors.includes(competitor);
      if (isSelected) {
        return {
          ...prev,
          competitors: prev.competitors.filter((c) => c !== competitor),
        };
      } else {
        return {
          ...prev,
          competitors: [...prev.competitors, competitor],
        };
      }
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return {
    filters,
    setLocation,
    setDateRange,
    toggleCompetitor,
    resetFilters,
  };
}
