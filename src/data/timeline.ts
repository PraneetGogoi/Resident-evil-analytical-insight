export interface TimelineEntry {
  year: number;
  month: string;
  title: string;
  description: string;
  classification: "PUBLIC" | "CLASSIFIED" | "TOP SECRET";
}

export const timelineData: TimelineEntry[] = [
  {
    year: 1968,
    month: "August",
    title: "Progenitor Virus Discovered",
    description: "Lord Oswell E. Spencer, Dr. James Marcus, and Edward Ashford discover the Progenitor Virus in West Africa from the Ndipaya tribe's Sonnentreppe flower.",
    classification: "TOP SECRET"
  },
  {
    year: 1978,
    month: "January",
    title: "T-Virus Developed",
    description: "Dr. James Marcus successfully creates the first strain of the t-Virus by combining the Progenitor Virus with leech DNA.",
    classification: "TOP SECRET"
  },
  {
    year: 1998,
    month: "July",
    title: "Mansion Incident",
    description: "S.T.A.R.S. Alpha and Bravo teams investigate bizarre murders in the Arklay Mountains, leading them to the Spencer Mansion. They discover Umbrella's illegal B.O.W. research.",
    classification: "CLASSIFIED"
  },
  {
    year: 1998,
    month: "September",
    title: "Raccoon City Destruction Incident",
    description: "A t-Virus outbreak consumes Raccoon City. The U.S. Government launches a thermobaric missile to sanitize the area, resulting in over 100,000 casualties.",
    classification: "PUBLIC"
  },
  {
    year: 2003,
    month: "February",
    title: "End of Umbrella",
    description: "Following the Raccoon City trials and the exposure of their bioweapons research in Russia, Umbrella Corporation officially goes bankrupt and is dissolved.",
    classification: "PUBLIC"
  },
  {
    year: 2004,
    month: "Autumn",
    title: "Las Plagas Incident",
    description: "Leon S. Kennedy is dispatched to rural Spain to rescue the President's daughter, encountering the Los Iluminados cult and the Las Plagas parasite.",
    classification: "CLASSIFIED"
  },
  {
    year: 2009,
    month: "March",
    title: "Kijuju Incident",
    description: "BSAA agents Chris Redfield and Sheva Alomar prevent Albert Wesker from deploying the Uroboros virus globally via missile strike from a volcanic base.",
    classification: "CLASSIFIED"
  },
  {
    year: 2017,
    month: "July",
    title: "Dulvey Incident",
    description: "Ethan Winters travels to the Baker Estate in Louisiana to find his missing wife, Mia. Encounters the Mutamycete superorganism known as Eveline.",
    classification: "CLASSIFIED"
  }
];
