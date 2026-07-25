import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
          <Link to="/games" className={`pb-1.5 border-b transition-colors ${location.pathname === '/games' ? 'border-torch text-torch-hot' : 'border-transparent hover:text-torch-hot hover:border-torch'}`}>Games</Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative z-[5] w-full">{children}</main>
    </div>
  );
}
