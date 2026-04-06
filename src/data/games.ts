export interface Game {
  id: string;
  title: string;
  year: number;
  type: 'mainline' | 'spinoff';
  chronology_order: number;
}

export const games: Game[] = [
  {id:"re",title:"Resident Evil",year:1996,type:"mainline",chronology_order:2},
  {id:"re2",title:"Resident Evil 2",year:1998,type:"mainline",chronology_order:4},
  {id:"re3",title:"Resident Evil 3: Nemesis",year:1999,type:"mainline",chronology_order:3},
  {id:"re_ve",title:"Resident Evil: Code – Veronica",year:2000,type:"mainline",chronology_order:5},
  {id:"re0",title:"Resident Evil 0",year:2002,type:"mainline",chronology_order:1},
  {id:"re4",title:"Resident Evil 4",year:2005,type:"mainline",chronology_order:6},
  {id:"re5",title:"Resident Evil 5",year:2009,type:"mainline",chronology_order:8},
  {id:"re_re",title:"Resident Evil: Revelations",year:2012,type:"spinoff",chronology_order:7},
  {id:"re6",title:"Resident Evil 6",year:2012,type:"mainline",chronology_order:10},
  {id:"re_re2",title:"Resident Evil: Revelations 2",year:2015,type:"spinoff",chronology_order:9},
  {id:"re7",title:"Resident Evil 7: Biohazard",year:2017,type:"mainline",chronology_order:11},
  {id:"re8",title:"Resident Evil Village",year:2021,type:"mainline",chronology_order:12},
  {id:"re_sr",title:"Resident Evil Village – Shadow of Rose",year:2022,type:"spinoff",chronology_order:13},
  {id:"re9",title:"Resident Evil Requiem",year:2026,type:"mainline",chronology_order:14},
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
