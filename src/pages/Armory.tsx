import { useState } from "react";
import { armoryData, WeaponEntry } from "@/data/armory";

export default function Armory() {
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponEntry | null>(armoryData[0]);

  return (
    <div className="relative max-w-[1200px] mx-auto px-6 md:px-12 pt-[70px] pb-[60px] z-[5] min-h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-12">
        <h1 className="title-h1 font-['Cinzel'] font-bold text-4xl md:text-[50px] tracking-[5px] text-bone leading-none">
          ARMORY INVENTORY
          <span className="block text-[0.48em] tracking-[7px] text-torch-hot mt-2">TACTICAL EQUIPMENT LOG</span>
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1">
        {/* List side */}
        <div className="w-full md:w-1/3 border-r border-torch/20 pr-4 space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {armoryData.map(weapon => (
            <button
              key={weapon.id}
              onClick={() => setSelectedWeapon(weapon)}
              className={`w-full text-left p-3 flex justify-between items-center font-['Courier_Prime'] transition-colors border-l-4 ${selectedWeapon?.id === weapon.id ? 'bg-[#1f1b17] border-torch-hot text-bone' : 'border-transparent text-bone-dim hover:bg-[#1c140c66] hover:text-bone'}`}
            >
              <span className="text-sm tracking-widest">{weapon.name}</span>
              <span className="text-[10px] text-torch/70">{weapon.type}</span>
            </button>
          ))}
        </div>

        {/* Detail side */}
        {selectedWeapon ? (
          <div className="w-full md:w-2/3 bg-[#1c140c66] border border-torch/20 p-6 md:p-10 relative shadow-2xl">
            <div className="absolute top-0 right-0 p-4 border-l border-b border-torch/20 bg-void">
              <span className="font-['Courier_Prime'] text-[10px] tracking-[3px] text-torch uppercase">
                ID: {selectedWeapon.id}
              </span>
            </div>
            
            <h2 className="font-['Cinzel'] text-3xl text-bone tracking-widest mb-6 border-b border-ash/30 pb-4 pr-32">
              {selectedWeapon.name}
            </h2>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-void/50 p-4 border border-torch/10">
                <p className="font-['Courier_Prime'] text-[10px] text-bone-dim tracking-[2px] uppercase mb-1">Weapon Type</p>
                <p className="font-bold font-['Cinzel'] tracking-widest text-lg text-[#bca476]">
                  {selectedWeapon.type}
                </p>
              </div>
              <div className="bg-void/50 p-4 border border-torch/10">
                <p className="font-['Courier_Prime'] text-[10px] text-bone-dim tracking-[2px] uppercase mb-1">Mag Capacity</p>
                <p className="font-bold font-['Cinzel'] tracking-widest text-lg text-torch-hot">
                  {selectedWeapon.capacity > 0 ? selectedWeapon.capacity : 'N/A'}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <p className="font-['Courier_Prime'] text-[10px] text-bone-dim tracking-[2px] uppercase mb-2">Firepower Rating</p>
              <div className="h-2 w-full bg-[#140e09] border border-torch/20 overflow-hidden">
                <div 
                  className="h-full bg-blood-glow transition-all duration-1000 ease-out"
                  style={{ width: `${(selectedWeapon.firepower / 10) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-[10px] font-['Courier_Prime'] text-torch/50">
                <span>0.0</span>
                <span>{selectedWeapon.firepower.toFixed(1)}</span>
                <span>10.0</span>
              </div>
            </div>

            <div>
              <p className="font-['Courier_Prime'] text-[10px] text-bone-dim tracking-[2px] uppercase mb-2">Technical Description</p>
              <p className="font-['Special_Elite'] text-sm leading-relaxed text-bone/80">
                {selectedWeapon.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full md:w-2/3 flex items-center justify-center border border-torch/10 bg-void/30">
            <p className="font-['Courier_Prime'] text-torch/50 tracking-widest animate-pulse">SELECT WEAPON PROFILE</p>
          </div>
        )}
      </div>
    </div>
  );
}
