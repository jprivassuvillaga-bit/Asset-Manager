import { useState, useCallback } from "react";

export type CompetitorId = "Netlife" | "PuntoNet" | "Celerity" | "CNT";

export const REGIONS_CONFIG = [
  {
    id: "sur",
    name: "Sur de Quito",
    neighborhoods: ["Quitumbe", "Chillogallo", "Solanda", "La Ecuatoriana", "Guajaló", "La Ajaví", "La Mena", "Turubamba"],
  },
  {
    id: "centro",
    name: "Centro de Quito",
    neighborhoods: ["La Mariscal", "Centro Histórico", "La Floresta", "Chimbacalle", "El Panecillo"],
  },
  {
    id: "norte",
    name: "Norte de Quito",
    neighborhoods: ["González Suárez", "El Batán", "Quito Norte", "Carcelén", "Cotocollao", "Ponceano"],
  },
  {
    id: "valles",
    name: "Valles",
    neighborhoods: ["Cumbayá", "Tumbaco", "Los Chillos", "Sangolquí", "Conocoto"],
  },
];

export interface DashboardFilters {
  regionId: string;
  location: string;
  neighborhoods: string[];
  dateFrom: string;
  dateTo: string;
  competitors: CompetitorId[];
}

const defaultFilters: DashboardFilters = {
  regionId: "all",
  location: "Todo Quito",
  neighborhoods: [],
  dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  dateTo: new Date().toISOString().split("T")[0],
  competitors: ["Netlife", "PuntoNet", "Celerity", "CNT"],
};

export function useDashboardFilters() {
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);

  const setRegion = useCallback((regionId: string) => {
    const region = REGIONS_CONFIG.find((r) => r.id === regionId);
    setFilters((prev) => ({
      ...prev,
      regionId,
      location: region ? region.name : "Todo Quito",
      neighborhoods: [],
    }));
  }, []);

  const toggleNeighborhood = useCallback((neighborhood: string) => {
    setFilters((prev) => {
      const isSelected = prev.neighborhoods.includes(neighborhood);
      return {
        ...prev,
        neighborhoods: isSelected
          ? prev.neighborhoods.filter((n) => n !== neighborhood)
          : [...prev.neighborhoods, neighborhood],
      };
    });
  }, []);

  const setDateRange = useCallback((dateFrom: string, dateTo: string) => {
    setFilters((prev) => ({ ...prev, dateFrom, dateTo }));
  }, []);

  const toggleCompetitor = useCallback((competitor: CompetitorId) => {
    setFilters((prev) => {
      const isSelected = prev.competitors.includes(competitor);
      return {
        ...prev,
        competitors: isSelected
          ? prev.competitors.filter((c) => c !== competitor)
          : [...prev.competitors, competitor],
      };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const currentRegion = REGIONS_CONFIG.find((r) => r.id === filters.regionId);

  return {
    filters,
    currentRegion,
    setRegion,
    toggleNeighborhood,
    setDateRange,
    toggleCompetitor,
    resetFilters,
  };
}
