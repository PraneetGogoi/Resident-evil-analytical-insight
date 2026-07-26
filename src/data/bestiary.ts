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
  },
  {
    id: "B-006",
    name: "Hunter Alpha (MA-121)",
    threatClass: "HIGH",
    weaknesses: ["Magnum rounds", "Acid shells"],
    firstAppearance: "Resident Evil (1996)",
    description: "Bipedal reptilian B.O.W. created by combining human DNA with reptilian genes and the t-Virus. Extremely agile and possesses razor-sharp claws."
  },
  {
    id: "B-007",
    name: "Tyrant (T-002)",
    threatClass: "EXTREME",
    weaknesses: ["Anti-Tank Rocket", "Exposed heart"],
    firstAppearance: "Resident Evil (1996)",
    description: "The ultimate B.O.W. envisioned by Umbrella. Exceptionally strong and durable, designed for military combat and execution of targeted threats."
  },
  {
    id: "B-008",
    name: "William Birkin (G)",
    threatClass: "EXTREME",
    weaknesses: ["High-caliber weapons", "Explosives focused on ocular weak points"],
    firstAppearance: "Resident Evil 2 (1998)",
    description: "Dr. Birkin mutated by his own G-Virus creation. Undergoes continuous unpredictable cellular mutation, growing increasingly grotesque and powerful."
  },
  {
    id: "B-009",
    name: "Majini",
    threatClass: "MODERATE",
    weaknesses: ["Flash grenades (when Cephalo bursts)", "Concentrated fire"],
    firstAppearance: "Resident Evil 5 (2009)",
    description: "Hosts of the Type 2 and Type 3 Plagas. More aggressive and organized than Ganados, capable of using firearms and riding motorcycles."
  },
  {
    id: "B-010",
    name: "Lycan",
    threatClass: "HIGH",
    weaknesses: ["Sniper rifles", "Explosive rounds"],
    firstAppearance: "Resident Evil Village (2021)",
    description: "Humans infected with the Cadou parasite via Mother Miranda. Possess extreme speed, agility, and a pack-hunting mentality."
  }
];
