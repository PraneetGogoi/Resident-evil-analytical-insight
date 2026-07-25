import { Character } from "@/types";
import { RedactedText } from "./RedactedText";
import { useEffect, useState } from "react";

interface DossierModalProps {
  character: Character | null;
  onClose: () => void;
}

export function DossierModal({ character, onClose }: DossierModalProps) {
  const [similarSubjects, setSimilarSubjects] = useState<Character[]>([]);

  useEffect(() => {
    if (character) {
      fetch('http://localhost:3001/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_id: character.id,
          target_type: 'character',
          action: 'view'
        })
      }).catch(console.error);

      // Fetch similar subjects based on KMeans cluster
      if (character.kmeansCluster !== undefined) {
        fetch('http://localhost:3001/api/characters')
          .then(res => res.json())
          .then((data: Character[]) => {
            const similar = data.filter(c => c.kmeansCluster === character.kmeansCluster && c.id !== character.id);
            // Get random 3
            setSimilarSubjects(similar.sort(() => 0.5 - Math.random()).slice(0, 3));
          })
          .catch(console.error);
      }
    }
  }, [character]);

  if (!character) return null;

  const killCount = character.killCount ?? ((Number(character.id) * 17) % 340);
  const firstAppearance = character.firstIncident ?? (1996 + (Number(character.id) % 25));
  const faction = character.faction ?? (character.classification === 'hero' ? 'BSAA / US Govt' : character.classification === 'villain' ? 'Umbrella Corp' : 'Civilian');
  const bio = character.bio ?? "DATA EXPUNGED. No further historical or psychological profile exists on record for this subject.";

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 z-[60] transition-opacity cursor-pointer backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#cabb96] shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[70] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 bottom-0 w-8 border-r border-[#837a63]/30 bg-[#d9cfb8]" />
        
        <div className="p-10 pl-16">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="font-['Courier_Prime'] text-[10px] tracking-[4px] text-ash uppercase font-bold mb-2">
                Subject Dossier
              </p>
              <h2 className="font-['Cinzel'] font-bold text-4xl tracking-[2px] text-[#241a10]">
                {character.name}
              </h2>
            </div>
            <button onClick={onClose} className="font-['Courier_Prime'] text-xs font-bold text-ash hover:text-blood-glow uppercase border border-ash px-2 py-1">
              Close [X]
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Portrait */}
            <div className="aspect-[3/4] bg-void border-2 border-ash relative overflow-hidden shadow-inner">
              <svg className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen pointer-events-none">
                <filter id="portrait-noise">
                  <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch"/>
                  <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.5 0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#portrait-noise)" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-['Cinzel'] text-bone-dim tracking-widest text-sm opacity-50">IMAGE REDACTED</span>
              </div>
            </div>

            {/* Vitals */}
            <div className="font-['Courier_Prime'] text-xs text-ash space-y-4">
              <div>
                <span className="block opacity-60 mb-1">ID Number</span>
                <b className="text-sm">#{String(character.id).padStart(4, '0')}</b>
              </div>
              <div>
                <span className="block opacity-60 mb-1">Classification</span>
                <b className="text-sm uppercase text-blood-hot">{character.classification}</b>
              </div>
              <div>
                <span className="block opacity-60 mb-1">Status</span>
                <b className="text-sm uppercase">
                  {character.status}
                </b>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6 font-['Courier_Prime'] text-sm text-ash border-t border-ash/30 pt-6">
            <div className="flex justify-between border-b border-dashed border-ash/30 pb-2">
              <span className="opacity-70">Known Faction</span>
              <RedactedText text={faction} />
            </div>
            <div className="flex justify-between border-b border-dashed border-ash/30 pb-2">
              <span className="opacity-70">Confirmed Kills</span>
              <RedactedText text={String(killCount)} />
            </div>
            <div className="flex justify-between border-b border-dashed border-ash/30 pb-2">
              <span className="opacity-70">First Incident</span>
              <RedactedText text={String(firstAppearance)} />
            </div>
          </div>

          {/* ML THREAT ASSESSMENT */}
          {character.predictedRole && (
            <div className="mt-8 bg-black/90 p-5 border-l-4 border-blood-hot shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative text-bone">
              <div className="absolute top-2 right-2 font-['Courier_Prime'] text-[8px] text-blood-glow tracking-widest uppercase animate-pulse">
                SYS_PREDICTION_ACTIVE
              </div>
              <div className="font-['Courier_Prime'] text-[10px] text-blood-hot font-bold tracking-[2px] uppercase mb-4 flex items-center gap-2 border-b border-blood-hot/30 pb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blood-hot">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Threat Assessment Output
              </div>
              
              <div className="space-y-3 font-['Courier_Prime'] text-xs">
                <div className="flex justify-between">
                  <span className="text-bone-dim">Computed Role Classification:</span>
                  <b className="uppercase text-torch">{character.predictedRole}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-bone-dim">Algorithm Confidence:</span>
                  <b className="uppercase">{((character.predictedConfidence || 0) * 100).toFixed(1)}%</b>
                </div>
                <div className="flex justify-between items-start pt-2 border-t border-dashed border-bone/20">
                  <span className="text-bone-dim">Primary Modifiers:</span>
                  <b className="text-right w-2/3 uppercase text-[10px] text-ash">{character.predictionFeatures}</b>
                </div>
              </div>
            </div>
          )}

          {/* SIMILAR SUBJECTS (KMeans Clusters) */}
          {similarSubjects.length > 0 && (
            <div className="mt-8 border border-ash/30 p-4">
              <div className="font-['Courier_Prime'] text-[10px] text-[#241a10] font-bold tracking-[2px] uppercase mb-3 pb-2 border-b border-dashed border-ash/30">
                Similar Subjects (Cluster Match)
              </div>
              <ul className="space-y-2 font-['Courier_Prime'] text-xs text-ash">
                {similarSubjects.map(sim => (
                  <li key={sim.id} className="flex justify-between items-center bg-[#d9cfb8] p-2 hover:bg-[#1c140c] hover:text-bone cursor-pointer transition-colors">
                    <span>{sim.name}</span>
                    <span className="text-[10px] uppercase opacity-70 border border-current px-1">{sim.classification}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Character Bio */}
          <div className="mt-8 bg-[#e0d6c1] p-5 border-l-4 border-torch shadow-inner relative mb-12">
            <div className="absolute top-2 right-2 font-['Courier_Prime'] text-[8px] text-ash/50 tracking-widest uppercase">
              DEPT OF DEFENSE // TOP SECRET
            </div>
            <div className="font-['Courier_Prime'] text-[10px] text-torch-hot font-bold tracking-[2px] uppercase mb-3 flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-torch">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Psychological / Historical Profile
            </div>
            
            <p className="font-['Courier_Prime'] text-[12.5px] leading-[1.8] text-[#2c241b]">
              {bio}
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
