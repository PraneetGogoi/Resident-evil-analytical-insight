import { useState, useRef, useEffect } from "react";
import { GameDossierModal } from "@/components/GameDossierModal";
import { LoadingState, ErrorState } from "@/components/SystemState";
import { Game } from "@/types";

export default function Games() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/games')
      .then(res => res.ok ? res.json() : Promise.reject(new Error("Failed to fetch games")))
      .then(data => {
        setGames(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setIsLoading(false);
      });
  }, []);

  const sortedGames = [...games].sort((a, b) => a.year - b.year);
  
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [hoveredGameId, setHoveredGameId] = useState<string | null>(null);
  
  // Refs for drawing the string
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const [lineCoords, setLineCoords] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  // Update line coordinates when hover or selection changes, or on resize
  useEffect(() => {
    const updateLine = () => {
      const activeId = selectedGame?.id || hoveredGameId;
      if (!activeId || !headerRef.current || !cardsRef.current[activeId]) {
        setLineCoords(null);
        return;
      }

      const headerRect = headerRef.current.getBoundingClientRect();
      const cardRect = cardsRef.current[activeId]!.getBoundingClientRect();

      setLineCoords({
        x1: headerRect.left + headerRect.width / 2,
        y1: headerRect.bottom, // Attach to bottom of header
        x2: cardRect.left + cardRect.width / 2,
        y2: cardRect.top + 20, // Attach near top of card
      });
    };

    updateLine();
    window.addEventListener("resize", updateLine);
    window.addEventListener("scroll", updateLine); // For fixed/absolute positioning updates
    
    return () => {
      window.removeEventListener("resize", updateLine);
      window.removeEventListener("scroll", updateLine);
    };
  }, [selectedGame, hoveredGameId]);

  return (
    <>
      {/* Red String Overlay (Fixed to screen to map client rects) */}
      {lineCoords && (
        <svg 
          className={`fixed inset-0 w-full h-full pointer-events-none transition-opacity duration-300 ${selectedGame ? 'z-[65]' : 'z-[4]'}`}
          style={{ overflow: 'visible' }}
        >
          <line 
            x1={lineCoords.x1} 
            y1={lineCoords.y1} 
            x2={lineCoords.x2} 
            y2={lineCoords.y2} 
            stroke="var(--string)" 
            strokeWidth="1.5" 
            strokeDasharray="4 2"
            className="animate-dash"
          />
          {/* Pin dots */}
          <circle cx={lineCoords.x1} cy={lineCoords.y1} r="3" fill="#ff5555" />
          <circle cx={lineCoords.x2} cy={lineCoords.y2} r="3" fill="#ff5555" />
        </svg>
      )}

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 pt-[70px] pb-[60px] z-[5]">
        
        {/* Title Node */}
        <div 
          ref={headerRef}
          className={`md:absolute md:top-0 md:left-[2%] md:w-[460px] mb-8 md:mb-0 transition-all duration-500 hover:scale-105 ${selectedGame ? 'z-[62]' : 'z-[6]'}`}
        >
          <div className="bg-gradient-to-br from-[#1c140c] to-[#050301] border border-torch/40 p-7 md:p-8 transform md:-rotate-1 relative shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-[22px] h-[22px] rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--torch-hot),var(--torch)_70%)] shadow-[0_2px_4px_rgba(0,0,0,0.6)] z-10" />
            <div className="font-['Courier_Prime'] text-[10px] tracking-[4px] text-torch uppercase mb-4 opacity-90 text-center">
              Timeline Archives // Classified
            </div>
            <h1 className="title-h1 font-['Cinzel'] font-bold text-4xl md:text-[50px] tracking-[5px] text-bone leading-none relative text-center">
              INCIDENT LOGS
            </h1>
            <p className="font-['Special_Elite'] text-[12.5px] leading-[1.9] text-bone-dim mt-4 text-center">
              Chronological record of biological incidents. Documented cases: <span className="text-torch font-bold">{sortedGames.length}</span>.
            </p>
          </div>
        </div>

        {/* Grid of Case File Cards */}
        <div className="mt-8 md:mt-[220px]">
          {isLoading ? (
            <LoadingState message="ACCESSING INCIDENT LOGS..." />
          ) : error ? (
            <ErrorState error={error} message="FAILED TO RETRIEVE LOGS" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
              {sortedGames.map((game, i) => {
              const rotation = i % 2 === 0 ? `rotate-[${1 + (i % 3)}deg]` : `-rotate-[${1 + (i % 2)}deg]`;
              
              const protagonists = game.protagonists || "AGENTS: IDENTITY REDACTED";
              const blurb = game.blurb || "No official mission report available. Incident files heavily redacted or destroyed by Umbrella operatives.";
              const outbreakClass = game.outbreakClass || "UNKNOWN";
              const severity = game.severity || Math.floor(Math.random() * 50) + 30;

              const isHovered = hoveredGameId === game.id;
              const isSelected = selectedGame?.id === game.id;
              
              // Varied noise colors per game for the redacted art
              const noiseR = (i * 45) % 255;
              const noiseG = (i * 85) % 150;
              const noiseB = (i * 35) % 200;
              
              return (
                <div 
                  key={game.id} 
                  ref={el => cardsRef.current[game.id] = el}
                  onMouseEnter={() => setHoveredGameId(game.id)}
                  onMouseLeave={() => setHoveredGameId(null)}
                  onClick={() => setSelectedGame(game)}
                  className={`bg-[#e0d6c1] p-4 pb-6 transform ${isSelected ? 'scale-105 rotate-0 z-[65] shadow-[0_0_40px_rgba(200,0,0,0.3)]' : isHovered ? 'scale-105 rotate-0 z-20 shadow-2xl' : `${rotation} z-10 shadow-xl`} transition-all duration-300 relative cursor-pointer border border-[#cabb96] group`}
                >
                  {/* Tape top edge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#dcd2be]/60 backdrop-blur-sm -rotate-2 mix-blend-multiply opacity-70 z-10" />

                  {/* Redacted Box Art */}
                  <div className="w-full h-48 bg-[#080503] relative overflow-hidden flex items-center justify-center border-2 border-ash/50 group-hover:border-torch/50 transition-colors mb-4">
                    <svg className="absolute inset-0 w-full h-full opacity-60 mix-blend-overlay pointer-events-none">
                      <filter id={`noise-${game.id}`}>
                        <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="3" stitchTiles="stitch"/>
                        <feColorMatrix type="matrix" values={`1 0 0 0 ${noiseR/255}  0 1 0 0 ${noiseG/255}  0 0 1 0 ${noiseB/255}  0 0 0 1 0`} />
                      </filter>
                      <rect width="100%" height="100%" filter={`url(#noise-${game.id})`} />
                    </svg>
                    
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none" />

                    <div className="text-center p-4 relative z-10">
                      <div className="border-[3px] border-torch text-torch font-bold font-['Courier_Prime'] text-xl tracking-[5px] px-3 py-1 -rotate-6 bg-void/80 mb-3 uppercase">
                        REDACTED
                      </div>
                      <span className="font-['Cinzel'] font-bold text-xl text-bone/70 tracking-widest block group-hover:text-bone transition-colors drop-shadow-md">
                        {game.title}
                      </span>
                    </div>
                  </div>

                  <div className="px-2">
                    {/* Header Info */}
                    <div className="flex justify-between items-end border-b-2 border-ash pb-2 mb-3">
                      <div className="font-['Cinzel'] font-bold text-xl text-[#2c241b]">
                        {game.title}
                      </div>
                      <div className="font-['Courier_Prime'] text-sm font-bold text-torch-hot bg-void px-2 py-0.5">
                        {game.year}
                      </div>
                    </div>

                    {/* Protagonist Badge */}
                    <div className="bg-void/5 border border-torch/30 inline-block px-2 py-1 mb-3">
                      <span className="font-['Courier_Prime'] text-[9px] font-bold tracking-[2px] uppercase text-[#615445]">
                        {protagonists}
                      </span>
                    </div>

                    {/* Mission Blurb */}
                    <p className="font-['Special_Elite'] text-[11px] leading-[1.6] text-[#4a4133] mb-4 h-[35px] overflow-hidden line-clamp-2">
                      {blurb}
                    </p>

                    {/* Stat Row */}
                    <div className="bg-void p-3 shadow-inner">
                      <div className="flex justify-between items-center font-['Courier_Prime'] text-[10px] tracking-widest uppercase border-b border-torch/20 pb-2 mb-2">
                        <span className="text-bone-dim">Outbreak Class</span>
                        <span className="font-bold text-torch-hot text-right">{outbreakClass}</span>
                      </div>
                      
                      <div className="flex justify-between font-['Courier_Prime'] text-[10px] text-torch mb-1 uppercase tracking-widest">
                        <span>Severity</span>
                        <span className="text-blood-glow">{severity}%</span>
                      </div>
                      <div className="h-1 w-full bg-[#140e09] border border-torch/20 overflow-hidden relative">
                        <div 
                          className="h-full bg-blood-glow meter-fill-anim"
                          style={{ width: `${severity}%` }}
                        />
                      </div>
                    </div>

                    {/* Stamp */}
                    <div className={`absolute bottom-6 right-5 font-['Courier_Prime'] text-[10px] tracking-widest font-bold border-2 px-2 py-1 rotate-[15deg] mix-blend-multiply opacity-80 ${game.type === 'mainline' ? 'text-[#a01c1c] border-[#a01c1c]' : 'text-[#2a4365] border-[#2a4365]'}`}>
                      {game.type.toUpperCase()}
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </div>
        
        <div className="h-[100px]"></div>
      </div>

      <GameDossierModal game={selectedGame} onClose={() => setSelectedGame(null)} onSelectGame={setSelectedGame} />
    </>
  );
}
