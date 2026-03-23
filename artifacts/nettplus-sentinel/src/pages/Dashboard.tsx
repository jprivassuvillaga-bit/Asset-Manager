import { useDashboardFilters } from "@/hooks/use-dashboard-filters";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { SummaryStats } from "@/components/dashboard/SummaryStats";
import { OfferRadar } from "@/components/dashboard/OfferRadar";
import { PriceComparison } from "@/components/dashboard/PriceComparison";
import { SwotAnalysis } from "@/components/dashboard/SwotAnalysis";
import { PresenceMap } from "@/components/dashboard/PresenceMap";
import { Menu } from "lucide-react";

export function Dashboard() {
  const filterState = useDashboardFilters();

  return (
    <div className="min-h-screen bg-background flex relative">
      {/* Sidebar - fixed left */}
      <Sidebar {...filterState} />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        <Header />
        
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {/* Mobile Filter Trigger (mockup for simplicity, actual filters in sidebar for desktop) */}
          <div className="lg:hidden mb-6 flex items-center gap-2 text-primary font-medium bg-primary/10 px-4 py-2 rounded-lg inline-flex">
            <Menu className="w-5 h-5" />
            <span>Filtros (Solo Escritorio)</span>
          </div>

          <SummaryStats />

          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-primary rounded-full" />
                <h2 className="text-2xl font-display font-bold text-foreground">Radar de Ofertas Activas</h2>
              </div>
              <OfferRadar filters={filterState.filters} />
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-comp-celerity rounded-full" />
                  <h2 className="text-2xl font-display font-bold text-foreground">Guerra de Precios</h2>
                </div>
                <PriceComparison filters={filterState.filters} />
              </div>
              <div className="xl:col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-destructive rounded-full" />
                  <h2 className="text-2xl font-display font-bold text-foreground">Presencia Táctica</h2>
                </div>
                <PresenceMap filters={filterState.filters} />
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-success rounded-full" />
                <h2 className="text-2xl font-display font-bold text-foreground">Reporte de Inteligencia</h2>
              </div>
              <SwotAnalysis filters={filterState.filters} />
            </section>
          </div>
          
          <footer className="mt-16 text-center text-muted-foreground text-sm pb-8">
            <p>Nettplus Sentinel v1.0.0 &copy; {new Date().getFullYear()}</p>
            <p className="mt-1 opacity-50">Confidencial - Solo para uso estratégico</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
