import { Bell, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function Header() {
  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });

  return (
    <header className="h-20 px-8 flex items-center justify-between border-b border-white/5 glass-panel sticky top-0 z-30">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground hidden md:block">Centro de Inteligencia</h2>
        <h2 className="text-xl font-display font-bold text-foreground md:hidden block">Sentinel</h2>
        <p className="text-sm text-muted-foreground capitalize">{today}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-success bg-success/10 px-3 py-1.5 rounded-full border border-success/20">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Sistema En Línea
        </div>
        
        <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors relative border border-white/5">
          <Bell className="w-4 h-4 text-foreground" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-destructive rounded-full border-2 border-background" />
        </button>
        
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-800 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
          <span className="font-bold text-white text-sm">NP</span>
        </div>
      </div>
    </header>
  );
}
