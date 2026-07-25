import { Game } from "@/types";
import { RedactedText } from "./RedactedText";
import { useEffect, useState } from "react";

interface GameDossierModalProps {
  game: Game | null;
  onClose: () => void;
  onSelectGame: (game: Game) => void;
}

// Simple CountUp component for the analytics
function CountUp({ end, duration = 1000 }: { end: number, duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count}</span>;
}

// Typewriter text for the blurb
function TypewriterBlurb({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 20); // Fast typewriter speed
    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="font-['Special_Elite'] text-[13px] leading-[1.8] text-bone-dim mt-2 h-[48px]">
      "{displayedText}"{displayedText.length < text.length && <span className="animate-pulse">_</span>}
    </p>
  );
}

export function GameDossierModal({ game, onClose, onSelectGame }: GameDossierModalProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [sortedGames, setSortedGames] = useState<Game[]>([]);

  useEffect(() => {
    // Fetch analytics for this game
    if (game) {
      // Record view
      fetch('http://localhost:3001/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_id: game.id,
          target_type: 'game',
          action: 'view'
        })
      }).catch(console.error);

      // We could also fetch game-specific features here if we make an endpoint for it.
      // For now, let's just simulate the analytics or omit them since they might not be fully migrated.
      // Or we can mock it here just like before if gameFeatures isn't in DB yet.
      setAnalytics(null); 
    }
  }, [game]);

  // We need the full list for prev/next, so we fetch it or pass it. 
  // Let's just fetch it once when the modal opens if it's empty.
  useEffect(() => {
    if (sortedGames.length === 0 && game) {
      fetch('http://localhost:3001/api/games')
        .then(res => res.json())
        .then((data: Game[]) => {
          setSortedGames([...data].sort((a, b) => a.year - b.year));
        });
    }
  }, [game, sortedGames]);

  if (!game) return null;

  const currentIndex = sortedGames.findIndex(g => g.id === game.id);
  const prevGame = currentIndex > 0 ? sortedGames[currentIndex - 1] : null;
  const nextGame = currentIndex < sortedGames.length - 1 ? sortedGames[currentIndex + 1] : null;

  // Fallback data
  const location = game.location || "CLASSIFIED / UNKNOWN REGION";
  const outbreakClass = game.outbreakClass || "BIOHAZARD LEVEL UNDETERMINED";
  const casualties = game.casualties || "[DATA CORRUPTED]";
  const containmentStatus = game.containmentStatus || "ONGOING INVESTIGATION";
  const severity = game.severity || Math.floor(Math.random() * 50) + 30;
  const blurb = game.blurb || "No official mission report available. Incident files heavily redacted or destroyed by Umbrella operatives.";

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[60] transition-opacity cursor-pointer" onClick={onClose} />
      
      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#140e09] border-l border-torch/20 shadow-[0_0_80px_rgba(0,0,0,0.9)] z-[70] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[75] bg-[length:100%_4px,3px_100%]" />
        
        <div className="p-10 pl-12 relative z-[71]">
          {/* Navigation and Close */}
          <div className="flex justify-between items-start mb-8 border-b border-torch/20 pb-6">
            <div>
              <p className="font-['Courier_Prime'] text-[10px] tracking-[4px] text-torch uppercase font-bold mb-2">
                Incident File // {game.year}
              </p>
              <h2 className="font-['Cinzel'] font-bold text-3xl md:text-4xl tracking-[2px] text-bone leading-none mb-2">
                {game.title}
              </h2>
              <div className="font-['Courier_Prime'] text-xs text-bone-dim tracking-widest uppercase">
                {location}
              </div>
            </div>
            <button onClick={onClose} className="font-['Courier_Prime'] text-xs font-bold text-bone-dim hover:text-torch-hot uppercase border border-ash hover:border-torch-hot px-2 py-1 transition-colors">
              Close [X]
            </button>
          </div>

          <div className="space-y-8">
            <div className="bg-void border border-torch/20 p-5 relative shadow-inner">
              <div className="absolute top-0 right-0 bg-blood text-bone font-bold text-[9px] px-2 py-1 tracking-widest uppercase">
                CONFIDENTIAL
              </div>
              <TypewriterBlurb text={blurb} />
            </div>

            {/* Tactical Threat Level Readout */}
            <div className="bg-[#0a0705] border border-torch/30 p-4 relative shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
              {severity > 80 && (
                <div className="absolute top-0 right-0 w-full h-1 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ff5555_10px,#ff5555_20px)] opacity-50" />
              )}
              
              <div className="flex justify-between items-start mb-3 font-['Courier_Prime']">
                <div>
                  <div className="text-[9px] text-torch/70 tracking-[3px] uppercase mb-1">
                    System Threat Assessment
                  </div>
                  <div className="text-sm tracking-widest uppercase flex items-center gap-2">
                    <span className={severity > 80 ? "text-blood animate-pulse" : severity > 50 ? "text-torch-hot" : "text-bone"}>
                      {severity > 80 ? "CRITICAL OUTBREAK" : severity > 50 ? "SEVERE HAZARD" : "CONTAINED"}
                    </span>
                    {severity > 80 && (
                      <span className="text-[10px] bg-blood text-bone px-1 rounded-sm animate-pulse">!</span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <div className="text-[10px] text-bone-dim uppercase">Severity Index</div>
                  <div className={`text-2xl font-bold font-['Cinzel'] leading-none ${severity > 80 ? "text-blood-glow" : "text-torch"}`}>
                    {severity}%
                  </div>
                </div>
              </div>

              {/* Data Graph / Bar */}
              <div className="relative h-12 w-full bg-[#1c140c] border border-torch/20 overflow-hidden flex items-end">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(232,76,34,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(232,76,34,0.1)_1px,transparent_1px)] bg-[size:10px_10px]" />
                <div className={`absolute top-0 left-0 bottom-0 ${severity > 80 ? 'bg-blood/20' : 'bg-torch/10'} transition-all duration-1000`} style={{ width: `${severity}%` }} />
                <svg className="absolute inset-0 w-full h-full stroke-[1.5px] fill-none opacity-80" preserveAspectRatio="none" viewBox="0 0 200 40">
                  {severity > 80 ? (
                    <path d="M0,20 L20,20 L30,5 L40,35 L50,15 L60,25 L70,20 L80,20 L90,0 L100,40 L110,10 L120,30 L130,20 L200,20" className="stroke-blood-glow animate-dash" strokeDasharray="200" />
                  ) : (
                    <path d="M0,20 L40,20 L45,10 L50,30 L55,20 L140,20 L145,15 L150,25 L155,20 L200,20" className="stroke-torch-hot animate-dash" strokeDasharray="200" />
                  )}
                </svg>
                <div className="absolute top-0 bottom-0 w-1 bg-white/20 shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-[scan_2s_linear_infinite]" />
              </div>
            </div>

            {/* Stats Row */}
            <div className="space-y-4 font-['Courier_Prime'] text-xs text-bone-dim pt-4">
              <div className="flex justify-between border-b border-dashed border-torch/20 pb-2">
                <span className="opacity-70 uppercase tracking-wider">Outbreak Class</span>
                <b className="text-torch-hot text-right">{outbreakClass}</b>
              </div>
              <div className="flex justify-between border-b border-dashed border-torch/20 pb-2">
                <span className="opacity-70 uppercase tracking-wider">Est. Casualties</span>
                <RedactedText text={String(casualties)} className="text-right" revealColor="text-torch-hot" />
              </div>
              <div className="flex justify-between border-b border-dashed border-torch/20 pb-2">
                <span className="opacity-70 uppercase tracking-wider">Containment</span>
                <b className="text-bone text-right">{containmentStatus}</b>
              </div>
            </div>

            {/* Analytics Section */}
            {analytics && (
              <div className="mt-8 border-t border-torch/20 pt-8">
                <h3 className="font-['Cinzel'] text-xl text-bone tracking-widest mb-6 text-center">
                  Database Analytics
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#1c140c] border border-torch/10 p-4 text-center">
                    <span className="block font-['Courier_Prime'] text-[9px] text-bone-dim uppercase tracking-widest mb-2">Total Scenes</span>
                    <span className="font-['Cinzel'] font-bold text-3xl text-bone"><CountUp end={analytics.total_scenes} /></span>
                  </div>
                  <div className="bg-[#1c140c] border border-torch/10 p-4 text-center">
                    <span className="block font-['Courier_Prime'] text-[9px] text-bone-dim uppercase tracking-widest mb-2">Entities Tracked</span>
                    <span className="font-['Cinzel'] font-bold text-3xl text-bone"><CountUp end={analytics.unique_characters} /></span>
                  </div>
                  <div className="bg-[#1c140c] border border-torch/10 p-4 text-center">
                    <span className="block font-['Courier_Prime'] text-[9px] text-bone-dim uppercase tracking-widest mb-2">Total Interactions</span>
                    <span className="font-['Cinzel'] font-bold text-3xl text-torch"><CountUp end={analytics.total_interactions} /></span>
                  </div>
                  <div className="bg-[#1c140c] border border-torch/10 p-4 text-center">
                    <span className="block font-['Courier_Prime'] text-[9px] text-bone-dim uppercase tracking-widest mb-2">Density Rating</span>
                    <span className="font-['Cinzel'] font-bold text-3xl text-blood-hot">{analytics.interactions_per_scene}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Prev/Next Navigation */}
            <div className="pt-8 flex justify-between font-['Courier_Prime'] text-xs">
              <button 
                onClick={() => prevGame && onSelectGame(prevGame)}
                disabled={!prevGame}
                className={`flex items-center gap-2 uppercase tracking-widest transition-colors ${prevGame ? 'text-torch hover:text-torch-hot' : 'text-ash opacity-50 cursor-not-allowed'}`}
              >
                <span>&lt;&lt; PREV</span>
              </button>
              
              <button 
                onClick={() => nextGame && onSelectGame(nextGame)}
                disabled={!nextGame}
                className={`flex items-center gap-2 uppercase tracking-widest transition-colors ${nextGame ? 'text-torch hover:text-torch-hot' : 'text-ash opacity-50 cursor-not-allowed'}`}
              >
                <span>NEXT &gt;&gt;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
