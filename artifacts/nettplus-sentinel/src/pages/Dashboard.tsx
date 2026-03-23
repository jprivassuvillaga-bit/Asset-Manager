import { useDashboardFilters } from "@/hooks/use-dashboard-filters";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { SummaryStats } from "@/components/dashboard/SummaryStats";
import { OfferRadar } from "@/components/dashboard/OfferRadar";
import { PriceComparison } from "@/components/dashboard/PriceComparison";
import { SwotAnalysis } from "@/components/dashboard/SwotAnalysis";
import { PresenceMap } from "@/components/dashboard/PresenceMap";
import { MarketShare } from "@/components/dashboard/MarketShare";

export function Dashboard() {
  const filterState = useDashboardFilters();
  const { filters, currentRegion } = filterState;

  return (
    <div className="min-h-screen bg-background flex relative">
      <Sidebar
        filters={filters}
        currentRegion={currentRegion}
        setRegion={filterState.setRegion}
        toggleNeighborhood={filterState.toggleNeighborhood}
        setDateRange={filterState.setDateRange}
        toggleCompetitor={filterState.toggleCompetitor}
        resetFilters={filterState.resetFilters}
      />

      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        <Header />

        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">

          {/* Summary Stats + New Offers Alert */}
          <SummaryStats filters={filters} />

          <div className="space-y-8">

            {/* Module 1: Offer Radar */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-2 h-8 bg-primary rounded-full" />
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground">Radar de Ofertas Activas</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {filters.neighborhoods.length > 0
                      ? `Barrios: ${filters.neighborhoods.join(", ")}`
                      : filters.location}
                    {" · "}
                    {filters.competitors.join(", ")}
                  </p>
                </div>
              </div>
              <OfferRadar filters={filters} />
            </section>

            {/* Module 2 + 2b: Price Comparison & Market Share */}
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div>
                <PriceComparison filters={filters} />
              </div>
              <div>
                <MarketShare filters={filters} />
              </div>
            </section>

            {/* Module 3 + 4: SWOT + Presence Map */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <SwotAnalysis filters={filters} />
              </div>
              <div className="xl:col-span-1">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-2 h-8 bg-destructive rounded-full" />
                  <h2 className="text-xl font-display font-bold text-foreground">Presencia Táctica</h2>
                </div>
                <PresenceMap filters={filters} />
              </div>
            </section>

          </div>

          <footer className="mt-16 text-center text-muted-foreground text-sm pb-8">
            <p>Nettplus Sentinel v2.0.0 &copy; {new Date().getFullYear()}</p>
            <p className="mt-1 opacity-50">Confidencial — Solo para uso estratégico interno</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
