export interface BowEntry {
  id: string;
  name: string;
  threatClass: string;
  weaknesses: string[];
  firstAppearance: string;
  description: string;
}

export const bestiaryData: BowEntry[] = [
  {
    id: "B-001",
    name: "Zombie (T-Virus)",
    threatClass: "LOW",
    weaknesses: ["Head trauma", "Fire"],
    firstAppearance: "Resident Evil (1996)",
    description: "Standard animated corpse resulting from T-Virus necrosis. Slow, lacking intelligence, driven by hunger. Dangerous in groups."
  },
  {
    id: "B-002",
    name: "Licker",
    threatClass: "HIGH",
    weaknesses: ["Shotgun blasts", "Acid rounds", "Deafness exploits"],
    firstAppearance: "Resident Evil 2 (1998)",
    description: "V-ACT mutation of a zombie. Blind, relies entirely on acute hearing. Features exposed brain tissue, lethal claws, and a piercing tongue."
  },
  {
    id: "B-003",
    name: "Nemesis-T Type",
    threatClass: "EXTREME",
    weaknesses: ["Heavy ordinance", "Rail cannon"],
    firstAppearance: "Resident Evil 3: Nemesis (1999)",
    description: "Tyrant infected with the NE-α parasite. Highly intelligent, capable of using weapons and pursuing targets relentlessly across vast areas."
  },
  {
    id: "B-004",
    name: "Ganado",
    threatClass: "MODERATE",
    weaknesses: ["Flash grenades (when mutated)", "Headshots"],
    firstAppearance: "Resident Evil 4 (2005)",
    description: "Human host infected by Las Plagas parasite. Retains intelligence and ability to coordinate, use weapons, and communicate."
  },
  {
    id: "B-005",
    name: "Molded",
    threatClass: "HIGH",
    weaknesses: ["Neuro-toxin", "Enhanced handguns"],
    firstAppearance: "Resident Evil 7: Biohazard (2017)",
    description: "Fungal creatures created by the Megamycete. Capable of regenerating limbs and shaping their biomass into bladed appendages."
  }
];
