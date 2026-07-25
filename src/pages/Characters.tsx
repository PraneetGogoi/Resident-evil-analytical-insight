import { useState, useRef, useEffect } from "react";
import { DossierModal } from "@/components/DossierModal";

import { Character } from "@/types";

export default function Characters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [flicker, setFlicker] = useState(false);
  const [maxPageRank, setMaxPageRank] = useState(0);
  
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [stringLines, setStringLines] = useState<{x1:number, y1:number, x2:number, y2:number}[]>([]);
  
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/characters')
      .then(res => res.json())
      .then(data => {
        // Sort by PageRank by default to show most central characters first
        const sorted = data.sort((a: any, b: any) => (b.pageRank || 0) - (a.pageRank || 0));
        setCharacters(sorted);
        setMaxPageRank(Math.max(...sorted.map((c: any) => c.pageRank || 0)));
        setIsLoading(false);
      });
  }, []);

  // Trigger flicker effect on filter/search change
  useEffect(() => {
    setFlicker(true);
    const timer = setTimeout(() => setFlicker(false), 400);
    return () => clearTimeout(timer);
  }, [roleFilter, search]);

  const filtered = characters.filter(c => {
    const matchesRole = roleFilter === "all" || c.classification.toLowerCase() === roleFilter;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleCardClick = (clickedChar: Character) => {
    if (containerRef.current && cardRefs.current[Number(clickedChar.id)]) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const clickedRect = cardRefs.current[Number(clickedChar.id)]!.getBoundingClientRect();
      
      const startX = clickedRect.left - containerRect.left + clickedRect.width / 2;
      const startY = clickedRect.top - containerRect.top + clickedRect.height / 2;

      // Find 2 random other characters in the same role that are currently visible
      const siblings = filtered.filter(c => c.id !== clickedChar.id && c.classification === clickedChar.classification);
      const targets = siblings.sort(() => 0.5 - Math.random()).slice(0, 2);

      const lines = targets.map(t => {
        const targetRef = cardRefs.current[Number(t.id)];
        if (targetRef) {
          const tRect = targetRef.getBoundingClientRect();
          return {
            x1: startX,
            y1: startY,
            x2: tRect.left - containerRect.left + tRect.width / 2,
            y2: tRect.top - containerRect.top + tRect.height / 2,
          };
        }
        return null;
      }).filter(Boolean) as {x1:number, y1:number, x2:number, y2:number}[];

      if (lines.length > 0) {
        setStringLines(lines);
        setTimeout(() => {
          setStringLines([]);
          setSelectedCharacter(clickedChar);
        }, 800);
        return; // Wait for animation
      }
    }
    
    // Fallback if no lines drawn
    setSelectedCharacter(clickedChar);
  };

  return (
    <div className="relative max-w-[1300px] mx-auto px-6 md:px-12 pt-[70px] pb-[60px] z-[5]" ref={containerRef}>
      
      {/* Title Node */}
      <div className="md:absolute z-[6] md:top-0 md:left-[2%] md:w-[460px] mb-8 md:mb-0">
        <div className="bg-gradient-to-br from-[#1c140c66] to-[#050301b3] border border-torch/25 p-7 md:p-8 transform md:rotate-1 relative shadow-xl">
          <div className="absolute -top-1.5 left-5 w-[22px] h-[22px] rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--torch-hot),var(--torch)_70%)] shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
          <div className="font-['Courier_Prime'] text-[10px] tracking-[4px] text-torch uppercase mb-4 opacity-90">
            RPD Internal Database
          </div>
          <h1 className="title-h1 font-['Cinzel'] font-bold text-4xl md:text-[50px] tracking-[5px] text-bone leading-none relative">
            SUBJECT RECORDS
            <span className="block text-[0.48em] tracking-[7px] text-torch-hot mt-2">CLASSIFIED FILES</span>
          </h1>
          <p className="font-['Special_Elite'] text-[12.5px] leading-[1.9] text-bone-dim mt-4">
            Known entities spanning the incident timeline. Total entries on record: <span className="text-torch">{characters.length}</span>.
          </p>
        </div>
      </div>

      {/* Typewriter Search & Filters */}
      <div className="md:absolute z-[6] md:w-[320px] md:top-[90px] md:right-[5%] mb-8 md:mb-0 space-y-4">
        
        {/* Typewriter Search Bar */}
        <div className="bg-[#1c140c] border border-torch/30 p-3 shadow-lg flex items-center font-['Courier_Prime']">
          <span className="text-torch-hot mr-2">{'>'}</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="QUERY SUBJECT..."
            className="bg-transparent border-none outline-none text-bone uppercase placeholder:text-bone/30 w-full text-sm"
          />
          <span className="animate-pulse text-torch-hot">_</span>
        </div>

        {/* Filter Sticky Note */}
        <div className="bg-[#b9a25a] text-[#241a0c] p-4 pb-5 transform md:-rotate-2 shadow-[0_8px_18px_rgba(0,0,0,0.5)] font-['Caveat'] text-[18px] leading-[1.3] w-[220px] ml-auto">
          <b className="block font-['Courier_Prime'] text-[10px] tracking-[1.5px] mb-2 opacity-70">FILTER LOGS</b>
          Sort by classification:
          <select 
            className="mt-2 w-full bg-transparent border-b-2 border-[#241a0c]/30 font-['Courier_Prime'] text-sm focus:outline-none focus:border-[#241a0c]"
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">ALL ENTITIES</option>
            <option value="hero">GOVERNMENT AGENT</option>
            <option value="villain">B.O.W. / MUTANT</option>
            <option value="support">CIVILIAN</option>
          </select>
        </div>
      </div>

      {/* String Overlay Canvas */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-[15]">
        {stringLines.map((line, i) => (
          <line 
            key={i} 
            x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} 
            className="stroke-string stroke-[1.5px]"
            strokeDasharray="4 2"
          >
            <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.8s" fill="freeze" />
            <animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" />
          </line>
        ))}
      </svg>

      {/* Grid of Evidence Cards */}
      <div className={`mt-8 md:mt-[300px] ${flicker ? 'flicker-transition' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {isLoading ? (
            <div className="col-span-full text-center py-20 font-['Courier_Prime'] text-torch">LOADING DATABASE RECORDS...</div>
          ) : filtered.map((c, i) => {
            const isHero = c.classification.toLowerCase() === 'hero';
            const isVillain = c.classification.toLowerCase() === 'villain';
            const isHub = (c.pageRank || 0) >= (maxPageRank * 0.4) && maxPageRank > 0; // Top central nodes
            
            const badgeClass = isVillain 
              ? 'text-blood-glow border-[#c2262666]' 
              : isHero 
                ? 'text-torch-hot border-torch-hot/40' 
                : 'text-ash border-[#7a6e5f59]';
                
            const badgeText = isVillain ? 'B.O.W. / HOSTILE' : isHero ? 'GOVERNMENT AGENT' : 'UNKNOWN CIVILIAN';
            const rotation = i % 2 === 0 ? '-rotate-[1.2deg]' : 'rotate-[0.8deg]';

            // Add interactive states
            const statusClass = isVillain ? 'status-deceased' : 'status-active';
            
            // Visual weight for Hub Subjects
            const cardScaleClass = isHub ? 'scale-[1.03] border-torch/60 shadow-[0_14px_36px_rgba(255,80,0,0.15)]' : 'border-torch/20 shadow-[0_14px_26px_rgba(0,0,0,0.4)]';

            return (
              <div 
                key={c.id} 
                ref={(el) => cardRefs.current[Number(c.id)] = el}
                onClick={() => handleCardClick(c)}
                className={`bg-gradient-to-br from-[#3a3a221a] to-[#050301ad] border p-5 relative md:${rotation} hover:border-torch-hot/50 hover:z-20 transition-all cursor-pointer group ${statusClass} ${cardScaleClass}`}
              >
                {/* Tape strip */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 -rotate-2 w-14 h-4 bg-[#d8cfba2e] opacity-70"></div>
                
                {/* Hub Badge */}
                {isHub && (
                  <div className="absolute -right-3 -top-3 rotate-[12deg] z-20">
                    <span className="font-['Courier_Prime'] text-[9px] bg-blood-hot text-bone px-2 py-1 shadow-[0_4px_12px_rgba(255,0,0,0.5)] border border-torch font-bold">
                      HUB SUBJECT
                    </span>
                  </div>
                )}
                
                {/* Stamp */}
                <span className={`font-['Courier_Prime'] text-[9.5px] tracking-[1.5px] uppercase ${badgeClass} border px-2 py-0.5 inline-block mb-3.5`}>
                  {badgeText}
                </span>
                
                <h3 className="font-['Cinzel'] font-bold text-base tracking-[1px] text-bone mb-1.5 group-hover:text-torch transition-colors">
                  {c.name}
                </h3>
                
                <div className="font-['Courier_Prime'] text-[10px] text-bone-dim mb-3.5">ID: #{String(c.id).padStart(4, '0')}</div>
                
                {/* Detected Faction Cluster from Louvain */}
                {c.communityId !== undefined && (
                  <div className="flex justify-between font-['Courier_Prime'] text-[10.5px] text-bone-dim py-1.5 border-t border-dashed border-torch/15 relative z-10">
                    <span>Faction Cluster</span><b className="text-torch-hot">GROUP {c.communityId}</b>
                  </div>
                )}
                <div className="flex justify-between font-['Courier_Prime'] text-[10.5px] text-bone-dim py-1.5 border-t border-dashed border-torch/15 relative z-10">
                  <span>Status</span><b className="text-bone uppercase">{c.status}</b>
                </div>
                <div className="flex justify-between items-center font-['Courier_Prime'] text-[10.5px] text-bone-dim py-1.5 border-t border-dashed border-torch/15 relative z-10">
                  <span>Profile</span>
                  <div className="bg-black text-black px-1 group-hover:bg-transparent group-hover:text-bone transition-colors duration-500 font-bold uppercase select-none">
                    CLICK TO DECLASSIFY
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 font-['Courier_Prime'] text-ash border-2 border-dashed border-torch/20 mt-10">
            [ NO ENTITIES FOUND MATCHING CRITERIA ]
          </div>
        )}
      </div>

      <DossierModal 
        character={selectedCharacter} 
        onClose={() => setSelectedCharacter(null)} 
      />

      <div className="h-[100px]"></div>
    </div>
  );
}
