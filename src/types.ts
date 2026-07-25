export interface Character {
  id: string;
  name: string;
  faction: string;
  classification: string;
  status: string;
  killCount: number;
  firstIncident: string;
  redactionState: string;
  portraitFilename: string;
  bio: string;
  pageRank?: number;
  degree?: number;
  communityId?: number;
  kmeansCluster?: number;
  predictedRole?: string;
  predictedConfidence?: number;
  predictionFeatures?: string;
}

export interface CharacterConnection {
  sourceId: string;
  targetId: string;
  weight: number;
}

export interface NetworkData {
  nodes: Character[];
  edges: CharacterConnection[];
}

export interface Game {
  id: string;
  title: string;
  year: number;
  type: 'mainline' | 'spinoff';
  chronologyOrder: number;
  location?: string;
  protagonists?: string;
  blurb?: string;
  outbreakClass?: string;
  casualties?: string;
  containmentStatus?: string;
  severity?: number;
}
