import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [tapeTime, setTapeTime] = useState("00:00:00");
  const location = useLocation();

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000);
      const hh = String(Math.floor(s / 3600)).padStart(2, '0');
      const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
      const ss = String(s % 60).padStart(2, '0');
      setTapeTime(`${hh}:${mm}:${ss}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
      
      {/* Mobile Terminal Warning */}
      <div className="md:hidden fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center p-6 text-center border-8 border-double border-torch/50">
        <div className="absolute inset-0 scanline opacity-40 pointer-events-none mix-blend-overlay"></div>
        <AlertCircle className="w-16 h-16 text-torch-hot animate-[glitch_2s_infinite] mb-6 relative z-10" />
        <h2 className="font-['Cinzel'] font-bold text-2xl tracking-[5px] text-torch-hot mb-4 relative z-10 glitch-hover">ACCESS DENIED</h2>
        <p className="font-['Courier_Prime'] text-bone-dim text-sm tracking-widest leading-relaxed relative z-10">
          TERMINAL DISPLAY NOT OPTIMIZED FOR PORTABLE DEVICES. <br/><br/>
          PLEASE RECONNECT VIA SECURE DESKTOP TERMINAL.
        </p>
      </div>

      {/* Global Overlays */}
      <div className="grime"></div>
      <div className="grain"></div>
      <div className="tracking"></div>
      <div className="vignette"></div>
      <div className="frame-corners"></div>
      
      {/* Global Camcorder HUD */}
      <div className="camcorder">
        <span className="rec-dot"></span>
        <span>REC</span>
        <span>{tapeTime}</span>
      </div>

      {/* Global Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 md:px-16 border-b border-torch/20 relative z-10 w-full shrink-0">
        <div className="font-['Cinzel'] font-bold text-sm tracking-[4px] text-bone-dim flex gap-3 items-center">
          <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-torch-hot fill-none stroke-[1.8px]">
            <path d="M12 2 L12 8 M12 8 L6 20 M12 8 L18 20 M6 20 L18 20" />
            <circle cx="12" cy="4" r="1.6" />
          </svg>
          R.E. ANALYTICS
        </div>
        <div className="flex gap-6 md:gap-8 font-['Courier_Prime'] text-[11px] tracking-[2px] uppercase text-ash">
          <Link to="/" className={`pb-1.5 border-b transition-colors ${location.pathname === '/' ? 'border-torch text-torch-hot' : 'border-transparent hover:text-torch-hot hover:border-torch'}`}>Home</Link>
          <Link to="/dashboard" className={`pb-1.5 border-b transition-colors ${location.pathname === '/dashboard' ? 'border-torch text-torch-hot' : 'border-transparent hover:text-torch-hot hover:border-torch'}`}>Dashboard</Link>
          <Link to="/characters" className={`pb-1.5 border-b transition-colors ${location.pathname === '/characters' ? 'border-torch text-torch-hot' : 'border-transparent hover:text-torch-hot hover:border-torch'}`}>Characters</Link>
          <Link to="/bestiary" className={`pb-1.5 border-b transition-colors ${location.pathname === '/bestiary' ? 'border-torch text-torch-hot' : 'border-transparent hover:text-torch-hot hover:border-torch'}`}>Bestiary</Link>
          <Link to="/locations" className={`pb-1.5 border-b transition-colors ${location.pathname === '/locations' ? 'border-torch text-torch-hot' : 'border-transparent hover:text-torch-hot hover:border-torch'}`}>Locations</Link>
          <Link to="/armory" className={`pb-1.5 border-b transition-colors ${location.pathname === '/armory' ? 'border-torch text-torch-hot' : 'border-transparent hover:text-torch-hot hover:border-torch'}`}>Armory</Link>
          <Link to="/timeline" className={`pb-1.5 border-b transition-colors ${location.pathname === '/timeline' ? 'border-torch text-torch-hot' : 'border-transparent hover:text-torch-hot hover:border-torch'}`}>Timeline</Link>
          <Link to="/games" className={`pb-1.5 border-b transition-colors ${location.pathname === '/games' ? 'border-torch text-torch-hot' : 'border-transparent hover:text-torch-hot hover:border-torch'}`}>Games</Link>
          <Link to="/updates" className={`pb-1.5 border-b transition-colors ${location.pathname === '/updates' ? 'border-torch text-torch-hot' : 'border-transparent hover:text-torch-hot hover:border-torch'}`}>Updates</Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative z-[5] w-full">{children}</main>
    </div>
  );
}
