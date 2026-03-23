import { Link } from "wouter";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative glitch background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      
      <div className="text-center relative z-10 glass-panel p-12 rounded-3xl max-w-md w-full border border-destructive/20 shadow-2xl shadow-destructive/10">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>
        
        <h1 className="text-4xl font-display font-bold text-foreground mb-2">Error 404</h1>
        <p className="text-xl text-muted-foreground mb-8">Vector no encontrado</p>
        
        <p className="text-sm text-muted-foreground/70 mb-8 border-t border-b border-white/5 py-4">
          La coordenada que intentas acceder está fuera del radar o la transmisión ha sido interceptada.
        </p>
        
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <Home className="w-4 h-4" />
          Retornar al Centro de Mando
        </Link>
      </div>
    </div>
  );
}
