export interface Game {
  id: string;
  title: string;
  year: number;
  type: 'mainline' | 'spinoff';
  chronology_order: number;
  location?: string;
  protagonists?: string;
  blurb?: string;
  outbreakClass?: string;
  casualties?: string | number;
  containmentStatus?: string;
  severity?: number;
}

export const games: Game[] = [
  {
    id: "re", title: "Resident Evil", year: 1996, type: "mainline", chronology_order: 2,
    location: "Raccoon City, Arklay Mountains",
    protagonists: "S.T.A.R.S. — JILL VALENTINE / CHRIS REDFIELD",
    blurb: "Mansion incident. Unauthorized viral testing facility discovered. Survivors: unconfirmed.",
    outbreakClass: "BIOHAZARD LEVEL 4",
    casualties: "DOZENS",
    containmentStatus: "STERILIZED (EXPLOSION)",
    severity: 65
  },
  {
    id: "re2", title: "Resident Evil 2", year: 1998, type: "mainline", chronology_order: 4,
    location: "Raccoon City, RPD & Sewers",
    protagonists: "CIVILIAN / RPD — CLAIRE REDFIELD / LEON S. KENNEDY",
    blurb: "City-wide contamination via water supply. RPD compromised. G-Virus deployed.",
    outbreakClass: "PANDEMIC LEVEL 5",
    casualties: "100,000+",
    containmentStatus: "UNCONTAINED (ESCALATED)",
    severity: 92
  },
  {
    id: "re3", title: "Resident Evil 3: Nemesis", year: 1999, type: "mainline", chronology_order: 3,
    location: "Raccoon City, Streets & Clock Tower",
    protagonists: "S.T.A.R.S. / U.B.C.S. — JILL VALENTINE / CARLOS OLIVEIRA",
    blurb: "Targeted elimination of S.T.A.R.S. personnel by Tyrant designated 'Nemesis'. Evacuation failed.",
    outbreakClass: "PANDEMIC LEVEL 5",
    casualties: "100,000+",
    containmentStatus: "STERILIZED (MISSILE STRIKE)",
    severity: 98
  },
  {
    id: "re_ve", title: "Resident Evil: Code – Veronica", year: 2000, type: "mainline", chronology_order: 5,
    location: "Rockfort Island / Antarctic Base",
    protagonists: "CIVILIAN / FORMER S.T.A.R.S. — CLAIRE REDFIELD / CHRIS REDFIELD",
    blurb: "T-Veronica virus outbreak. Ashford family legacy compromised. Facility self-destruct engaged.",
    outbreakClass: "BIOHAZARD LEVEL 3",
    casualties: "HUNDREDS",
    containmentStatus: "CONTAINED (ISOLATED)",
    severity: 55
  },
  {
    id: "re0", title: "Resident Evil 0", year: 2002, type: "mainline", chronology_order: 1,
    location: "Arklay Mountains, Ecliptic Express",
    protagonists: "S.T.A.R.S. / CONVICT — REBECCA CHAMBERS / BILLY COEN",
    blurb: "Initial T-Virus leakage aboard Umbrella executive train. Progenitor virus origins uncovered.",
    outbreakClass: "BIOHAZARD LEVEL 3",
    casualties: "DOZENS",
    containmentStatus: "CONTAINED",
    severity: 50
  },
  {
    id: "re4", title: "Resident Evil 4", year: 2005, type: "mainline", chronology_order: 6,
    location: "Valdelobos, Rural Spain",
    protagonists: "US GOV. AGENT — LEON S. KENNEDY",
    blurb: "Rescue operation for US President's daughter. Plagas parasite cult 'Los Illuminados' neutralized.",
    outbreakClass: "PARASITIC THREAT LEVEL 4",
    casualties: "ENTIRE REGION",
    containmentStatus: "NEUTRALIZED",
    severity: 75
  },
  {
    id: "re5", title: "Resident Evil 5", year: 2009, type: "mainline", chronology_order: 8,
    location: "Kijuju, West Africa",
    protagonists: "B.S.A.A. — CHRIS REDFIELD / SHEVA ALOMAR",
    blurb: "Type 2 Plagas sold on black market. Uroboros virus global saturation plan averted.",
    outbreakClass: "GLOBAL THREAT LEVEL 5",
    casualties: "THOUSANDS",
    containmentStatus: "THREAT ELIMINATED",
    severity: 85
  },
  {
    id: "re_re", title: "Resident Evil: Revelations", year: 2012, type: "spinoff", chronology_order: 7,
    location: "Mediterranean Sea, Queen Zenobia",
    protagonists: "B.S.A.A. — JILL VALENTINE / CHRIS REDFIELD",
    blurb: "T-Abyss virus outbreak on abandoned cruise liner. Terrorist group 'Il Veltro' implicated.",
    outbreakClass: "BIOHAZARD LEVEL 3",
    casualties: "HUNDREDS",
    containmentStatus: "STERILIZED (SUN SATELLITE)",
    severity: 60
  },
  {
    id: "re6", title: "Resident Evil 6", year: 2012, type: "mainline", chronology_order: 10,
    location: "Tall Oaks / Lanshiang",
    protagonists: "GOV / B.S.A.A. / MERCENARY — LEON / CHRIS / JAKE / ADA",
    blurb: "Coordinated bio-terror attacks using C-Virus. US President assassinated. Global crisis.",
    outbreakClass: "PANDEMIC LEVEL 5",
    casualties: "MILLIONS",
    containmentStatus: "VACCINE DEPLOYED",
    severity: 100
  },
  {
    id: "re_re2", title: "Resident Evil: Revelations 2", year: 2015, type: "spinoff", chronology_order: 9,
    location: "Zabytij Island, Baltic Sea",
    protagonists: "TERRASAVE / B.S.A.A. — CLAIRE REDFIELD / BARRY BURTON",
    blurb: "Kidnapping by 'The Overseer'. T-Phobos virus induced by fear. Mind transfer experiments.",
    outbreakClass: "BIOHAZARD LEVEL 2",
    casualties: "DOZENS",
    containmentStatus: "ISOLATED THREAT",
    severity: 45
  },
  {
    id: "re7", title: "Resident Evil 7: Biohazard", year: 2017, type: "mainline", chronology_order: 11,
    location: "Dulvey, Louisiana",
    protagonists: "CIVILIAN — ETHAN WINTERS",
    blurb: "Missing persons case reveals E-Type bioweapon 'Eveline'. Mutamycete mold infection.",
    outbreakClass: "FUNGAL THREAT LEVEL 3",
    casualties: "FAMILY & LOCALS",
    containmentStatus: "STERILIZED",
    severity: 55
  },
  {
    id: "re8", title: "Resident Evil Village", year: 2021, type: "mainline", chronology_order: 12,
    location: "Unnamed Village, Eastern Europe",
    protagonists: "CIVILIAN — ETHAN WINTERS",
    blurb: "Megamycete root discovered. Cadou parasite experiments by Mother Miranda. Lycan threat.",
    outbreakClass: "FUNGAL THREAT LEVEL 4",
    casualties: "ENTIRE VILLAGE",
    containmentStatus: "STERILIZED (EXPLOSION)",
    severity: 70
  },
  {
    id: "re_sr", title: "Resident Evil Village – Shadow of Rose", year: 2022, type: "spinoff", chronology_order: 13,
    location: "Megamycete Consciousness (Realm)",
    protagonists: "CIVILIAN — ROSEMARY WINTERS",
    blurb: "Psychological integration with Megamycete remnants to purge abilities. Neural construct simulation.",
    outbreakClass: "ANOMALY LEVEL 1",
    casualties: "NONE (VIRTUAL)",
    containmentStatus: "RESOLVED",
    severity: 20
  },
  {
    id: "re9", title: "Resident Evil Requiem", year: 2026, type: "mainline", chronology_order: 14,
    location: "CLASSIFIED",
    protagonists: "B.S.A.A. / GOV AGENT — CLASSIFIED",
    blurb: "Data not found. Ongoing investigation into B.S.A.A. corruption and bioweapon soldiers.",
    outbreakClass: "CLASSIFIED",
    casualties: "UNKNOWN",
    containmentStatus: "ACTIVE",
    severity: 85
  },
];

export interface GameFeature {
  game_id: string;
  game_title: string;
  year: number;
  type: string;
  chronology_order: number;
  total_scenes: number;
  unique_characters: number;
  total_interactions: number;
  interactions_per_scene: number;
}

export const gameFeatures: GameFeature[] = [
  {game_id:"re",game_title:"Resident Evil",year:1996,type:"mainline",chronology_order:2,total_scenes:25,unique_characters:6,total_interactions:69,interactions_per_scene:2.76},
  {game_id:"re0",game_title:"Resident Evil 0",year:2002,type:"mainline",chronology_order:1,total_scenes:36,unique_characters:5,total_interactions:66,interactions_per_scene:1.83},
  {game_id:"re2",game_title:"Resident Evil 2",year:1998,type:"mainline",chronology_order:4,total_scenes:80,unique_characters:7,total_interactions:177,interactions_per_scene:2.21},
  {game_id:"re3",game_title:"Resident Evil 3: Nemesis",year:1999,type:"mainline",chronology_order:3,total_scenes:45,unique_characters:4,total_interactions:52,interactions_per_scene:1.16},
  {game_id:"re4",game_title:"Resident Evil 4",year:2005,type:"mainline",chronology_order:6,total_scenes:16,unique_characters:8,total_interactions:46,interactions_per_scene:2.88},
  {game_id:"re5",game_title:"Resident Evil 5",year:2009,type:"mainline",chronology_order:8,total_scenes:45,unique_characters:9,total_interactions:127,interactions_per_scene:2.82},
  {game_id:"re6",game_title:"Resident Evil 6",year:2012,type:"mainline",chronology_order:10,total_scenes:10,unique_characters:8,total_interactions:39,interactions_per_scene:3.9},
  {game_id:"re7",game_title:"Resident Evil 7: Biohazard",year:2017,type:"mainline",chronology_order:11,total_scenes:96,unique_characters:3,total_interactions:117,interactions_per_scene:1.22},
  {game_id:"re8",game_title:"Resident Evil Village",year:2021,type:"mainline",chronology_order:12,total_scenes:10,unique_characters:8,total_interactions:27,interactions_per_scene:2.7},
  {game_id:"re9",game_title:"Resident Evil Requiem",year:2026,type:"mainline",chronology_order:14,total_scenes:461,unique_characters:6,total_interactions:548,interactions_per_scene:1.19},
  {game_id:"re_sr",game_title:"RE Village – Shadow of Rose",year:2022,type:"spinoff",chronology_order:13,total_scenes:178,unique_characters:4,total_interactions:199,interactions_per_scene:1.12},
  {game_id:"re_ve",game_title:"RE: Code – Veronica",year:2000,type:"mainline",chronology_order:5,total_scenes:31,unique_characters:7,total_interactions:70,interactions_per_scene:2.26},
];

export interface GameAppearance {
  game_id: string;
  character_id: number;
  role: string;
  game_title: string;
  character_name: string;
}
