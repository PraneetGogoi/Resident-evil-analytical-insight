import { useState } from "react";
import { locationsData, LocationEntry } from "@/data/locations";

export default function Locations() {
  const [selectedLoc, setSelectedLoc] = useState<LocationEntry | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DESTROYED': return 'text-[#a01c1c] border-[#a01c1c]';
      case 'ABANDONED': return 'text-[#7a6e5f] border-[#7a6e5f]';
      case 'QUARANTINED': return 'text-[#e84c22] border-[#e84c22]';
      case 'ACTIVE': return 'text-[#00b4d8] border-[#00b4d8]';
      default: return 'text-bone border-bone';
    }
  };

  return (
    <div className="relative max-w-[1200px] mx-auto px-6 md:px-12 pt-[70px] pb-[60px] z-[5] min-h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-12">
        <h1 className="title-h1 font-['Cinzel'] font-bold text-4xl md:text-[50px] tracking-[5px] text-bone leading-none">
          GLOBAL INCIDENTS
          <span className="block text-[0.48em] tracking-[7px] text-torch-hot mt-2">TERRITORIAL MAPPING</span>
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1">
        {/* Interactive Map Area */}
        <div className="w-full md:w-2/3 relative bg-[#080503] border border-torch/20 overflow-hidden shadow-2xl min-h-[400px]">
          {/* Map Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          {/* Radar Sweep */}
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-torch/5 opacity-50" />
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-torch/10 opacity-50" />
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-torch/20 opacity-50" />
          
          <div className="absolute top-1/2 left-1/2 w-full h-[2px] bg-torch/10 -translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 left-1/2 w-[2px] h-full bg-torch/10 -translate-x-1/2 -translate-y-1/2" />

          {/* Location Nodes */}
          {locationsData.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedLoc(loc)}
              className={`absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all flex items-center justify-center group ${selectedLoc?.id === loc.id ? 'z-20' : 'z-10'}`}
              style={{ left: `${loc.coordinates.x}%`, top: `${loc.coordinates.y}%` }}
            >
              <div className={`absolute w-full h-full rounded-full animate-ping opacity-75 ${selectedLoc?.id === loc.id ? 'bg-torch-hot' : 'bg-torch/50'}`} />
              <div className={`relative w-2 h-2 rounded-full ${selectedLoc?.id === loc.id ? 'bg-bone' : 'bg-torch-hot'}`} />
              
              {/* Tooltip on map */}
              <div className={`absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-void/90 border p-1 text-[9px] font-['Courier_Prime'] uppercase tracking-widest ${selectedLoc?.id === loc.id ? 'border-torch-hot text-bone block' : 'border-torch/30 text-torch hidden group-hover:block'}`}>
                {loc.name}
              </div>
            </button>
          ))}
        </div>

        {/* Location Details Side */}
        <div className="w-full md:w-1/3 bg-[#1c140c66] border border-torch/20 p-6 relative shadow-2xl">
          {selectedLoc ? (
            <>
              <div className="flex justify-between items-start mb-6 border-b border-torch/20 pb-4">
                <div>
                  <h2 className="font-['Cinzel'] text-xl text-bone tracking-widest mb-1">{selectedLoc.name}</h2>
                  <p className="font-['Courier_Prime'] text-[10px] text-bone-dim tracking-[2px] uppercase">{selectedLoc.region}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="font-['Courier_Prime'] text-[10px] text-bone-dim tracking-[2px] uppercase mb-1">Status</p>
                <div className={`inline-block font-bold font-['Courier_Prime'] tracking-widest text-xs border-2 px-2 py-1 ${getStatusColor(selectedLoc.status)}`}>
                  {selectedLoc.status}
                </div>
              </div>

              <div className="mb-6">
                <p className="font-['Courier_Prime'] text-[10px] text-bone-dim tracking-[2px] uppercase mb-2">Major Incidents</p>
                <ul className="space-y-1">
                  {selectedLoc.incidents.map((inc, i) => (
                    <li key={i} className="font-['Special_Elite'] text-sm text-[#bca476]">
                      <span className="text-torch-hot mr-2">»</span>{inc}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-['Courier_Prime'] text-[10px] text-bone-dim tracking-[2px] uppercase mb-2">Intel Report</p>
                <p className="font-['Special_Elite'] text-sm leading-relaxed text-bone/80">
                  {selectedLoc.description}
                </p>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-torch/10 bg-void/30">
              <svg viewBox="0 0 24 24" className="w-12 h-12 stroke-torch/30 fill-none stroke-[1px] mb-4">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2 L12 22 M2 12 L22 12" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <p className="font-['Courier_Prime'] text-torch/50 tracking-widest text-xs uppercase animate-pulse">AWAITING TARGET SELECTION</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
