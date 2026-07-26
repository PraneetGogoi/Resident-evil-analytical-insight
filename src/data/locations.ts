export interface LocationEntry {
  id: string;
  name: string;
  region: string;
  status: "DESTROYED" | "ABANDONED" | "QUARANTINED" | "ACTIVE";
  incidents: string[];
  description: string;
  coordinates: { x: number; y: number };
}

export const locationsData: LocationEntry[] = [
  {
    id: "LOC-001",
    name: "Arklay Laboratory",
    region: "Arklay Mountains, USA",
    status: "DESTROYED",
    incidents: ["Mansion Incident (1998)"],
    description: "Covert research facility disguised as the Spencer Mansion. Site of the first major t-Virus outbreak.",
    coordinates: { x: 30, y: 40 }
  },
  {
    id: "LOC-002",
    name: "Raccoon City",
    region: "Midwest, USA",
    status: "DESTROYED",
    incidents: ["Raccoon City Destruction Incident (1998)"],
    description: "Industrial midwestern city heavily influenced by Umbrella Corp. Annihilated by a thermobaric strike to contain a massive t-Virus outbreak.",
    coordinates: { x: 35, y: 45 }
  },
  {
    id: "LOC-003",
    name: "Rockfort Island",
    region: "Southern Ocean",
    status: "DESTROYED",
    incidents: ["Rockfort Island Outbreak (1998)"],
    description: "Isolated island facility used by Umbrella for military training and holding high-value prisoners.",
    coordinates: { x: 70, y: 75 }
  },
  {
    id: "LOC-004",
    name: "Los Iluminados Territory",
    region: "Rural Spain",
    status: "QUARANTINED",
    incidents: ["Las Plagas Incident (2004)"],
    description: "Remote village and castle grounds controlled by the Los Iluminados cult, utilizing the Las Plagas parasite.",
    coordinates: { x: 55, y: 35 }
  },
  {
    id: "LOC-005",
    name: "Kijuju",
    region: "West Africa",
    status: "QUARANTINED",
    incidents: ["Kijuju Incident (2009)"],
    description: "Autonomous Zone in West Africa. Site of massive Uroboros virus testing and Type 2 Plagas deployment by Tricell.",
    coordinates: { x: 60, y: 60 }
  },
  {
    id: "LOC-006",
    name: "Baker Estate",
    region: "Dulvey, Louisiana, USA",
    status: "ABANDONED",
    incidents: ["Dulvey Incident (2017)"],
    description: "Isolated plantation infected by the mold superorganism weapon Eveline, mutating the resident family.",
    coordinates: { x: 25, y: 48 }
  }
];
