import { timelineData } from "@/data/timeline";

export default function Timeline() {
  const sortedTimeline = [...timelineData].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month.localeCompare(b.month);
  });

  return (
    <div className="relative max-w-[900px] mx-auto px-6 md:px-12 pt-[70px] pb-[60px] z-[5]">
      <div className="mb-12">
        <div className="bg-gradient-to-br from-[#1c140c66] to-[#050301b3] border border-torch/25 p-7 md:p-8 transform md:rotate-[0.5deg] relative shadow-xl inline-block">
          <div className="absolute -top-1.5 left-5 w-[22px] h-[22px] rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--torch-hot),var(--torch)_70%)] shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
          <div className="font-['Courier_Prime'] text-[10px] tracking-[4px] text-torch uppercase mb-4 opacity-90">
            Historical Records
          </div>
          <h1 className="title-h1 font-['Cinzel'] font-bold text-4xl md:text-[50px] tracking-[5px] text-bone leading-none relative">
            MASTER TIMELINE
            <span className="block text-[0.48em] tracking-[7px] text-torch-hot mt-2">CHRONOLOGICAL EVENT LOG</span>
          </h1>
        </div>
      </div>

      <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[1.1rem] md:before:ml-[5.5rem] before:-translate-x-px before:h-full before:w-[3px] before:bg-torch/20">
        {sortedTimeline.map((entry, idx) => (
          <div key={idx} className="relative flex items-start group py-6">
            
            {/* Year Label (Desktop) / Month Label */}
            <div className="w-[5.5rem] shrink-0 pt-2 hidden md:block text-right pr-6 font-['Cinzel'] font-bold text-xl text-torch-hot">
              {entry.year}
            </div>

            {/* Timeline node */}
            <div className="absolute left-[1.1rem] md:left-[5.5rem] w-3 h-3 bg-[#140e09] border-2 border-torch rounded-full -translate-x-[5.5px] mt-3 group-hover:bg-torch-hot group-hover:scale-150 transition-all z-10 shadow-[0_0_10px_rgba(232,76,34,0.5)]" />
            
            {/* Content Card */}
            <div className="ml-10 md:ml-8 w-full bg-[#1f1b17]/80 border border-torch/10 p-5 shadow-lg transform transition-all group-hover:border-torch/50 group-hover:-translate-y-1 relative">
              {/* Year label for mobile */}
              <div className="md:hidden font-['Cinzel'] font-bold text-xl text-torch-hot mb-2">
                {entry.year}
              </div>

              <div className="flex justify-between items-end border-b border-torch/20 pb-2 mb-3">
                <h3 className="font-['Cinzel'] font-bold text-lg text-bone tracking-wider">{entry.title}</h3>
                <div className="font-['Courier_Prime'] text-[10px] font-bold text-bone-dim tracking-[2px] uppercase">
                  {entry.month}
                </div>
              </div>

              <div className="mb-3">
                <span className={`inline-block font-['Courier_Prime'] text-[9px] tracking-[2px] uppercase px-2 py-0.5 border ${entry.classification === 'TOP SECRET' ? 'border-blood-glow text-blood-glow bg-blood-glow/10' : entry.classification === 'CLASSIFIED' ? 'border-torch-hot text-torch-hot bg-torch-hot/10' : 'border-[#7a6e5f] text-[#7a6e5f] bg-[#7a6e5f]/10'}`}>
                  {entry.classification}
                </span>
              </div>

              <p className="font-['Special_Elite'] text-[13px] text-bone/80 leading-relaxed">
                {entry.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="h-[100px]"></div>
    </div>
  );
}
