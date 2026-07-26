export default function FieldUpdates() {
  const updates = [
    {
      version: "v1.3",
      date: "2026-07-26",
      title: "Tactical Expansion",
      changes: [
        "Added B.O.W. Bestiary Catalog.",
        "Integrated interactive territory Map.",
        "Added Weapons Armory tracking capabilities.",
        "Added Master Timeline view."
      ]
    },
    {
      version: "v1.2",
      date: "2026-07-25",
      title: "System Hardening",
      changes: [
        "Implemented 'SIGNAL LOST' fallback protocols for data corruption.",
        "Restricted terminal access for unoptimized portable devices (Mobile Pass).",
        "Updated surveillance feed with custom visual signatures (Favicon & Meta Tags)."
      ]
    },
    {
      version: "v1.1",
      date: "2026-07-25",
      title: "Advanced Analytics Integration",
      changes: [
        "Integrated Machine Learning models (KMeans PCA Projection).",
        "Added network topology metrics (Degree vs PageRank).",
        "Fixed classification UI glitches in Dashboard module."
      ]
    },
    {
      version: "v1.0",
      date: "2026-07-24",
      title: "Initial Terminal Access",
      changes: [
        "Deployed R.E. ANALYTICS dashboard.",
        "Connected to RPD classified database.",
        "Initial node-link graph mapping completed."
      ]
    }
  ];

  return (
    <div className="relative max-w-[900px] mx-auto px-6 md:px-12 pt-[70px] pb-[60px] z-[5]">
      {/* Title Node */}
      <div className="mb-12">
        <div className="bg-gradient-to-br from-[#1c140c66] to-[#050301b3] border border-torch/25 p-7 md:p-8 transform md:rotate-[0.5deg] relative shadow-xl inline-block">
          <div className="absolute -top-1.5 left-5 w-[22px] h-[22px] rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--torch-hot),var(--torch)_70%)] shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
          <div className="font-['Courier_Prime'] text-[10px] tracking-[4px] text-torch uppercase mb-4 opacity-90">
            System Operations
          </div>
          <h1 className="title-h1 font-['Cinzel'] font-bold text-4xl md:text-[50px] tracking-[5px] text-bone leading-none relative">
            FIELD UPDATES
            <span className="block text-[0.48em] tracking-[7px] text-torch-hot mt-2">PATCH LOG DIRECTORY</span>
          </h1>
        </div>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-torch/20 before:to-transparent">
        {updates.map((update, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Timeline dot */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-board bg-torch-hot shadow-[0_0_15px_rgba(232,76,34,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
            
            {/* Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#1f1b17]/90 border border-torch/30 p-6 shadow-[0_5px_15px_rgba(0,0,0,0.5)] transform transition-transform hover:scale-[1.02] hover:border-torch-hot/50">
              <div className="flex justify-between items-end border-b border-torch/20 pb-3 mb-4">
                <h3 className="font-['Cinzel'] font-bold text-xl text-bone tracking-widest">{update.title}</h3>
                <div className="font-['Courier_Prime'] text-xs font-bold text-torch-hot bg-void px-2 py-1 ml-4 whitespace-nowrap">
                  {update.version}
                </div>
              </div>
              <div className="font-['Courier_Prime'] text-[10px] text-bone-dim tracking-[2px] uppercase mb-4">
                LOG DATE: {update.date}
              </div>
              <ul className="space-y-2">
                {update.changes.map((change, i) => (
                  <li key={i} className="flex items-start font-['Special_Elite'] text-[13px] text-bone/80 leading-relaxed">
                    <span className="text-torch-hot mr-2 mt-0.5">»</span>
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className="h-[100px]"></div>
    </div>
  );
}
