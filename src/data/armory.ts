export interface WeaponEntry {
  id: string;
  name: string;
  type: string;
  firepower: number;
  capacity: number;
  description: string;
}

export const armoryData: WeaponEntry[] = [
  {
    id: "WPN-001",
    name: "Samurai Edge",
    type: "Handgun",
    firepower: 3.5,
    capacity: 15,
    description: "Custom Beretta 92F designed by Robert Kendo for S.T.A.R.S. members. Features extended slide, custom grips, and superior accuracy."
  },
  {
    id: "WPN-002",
    name: "W-870",
    type: "Shotgun",
    firepower: 8.0,
    capacity: 8,
    description: "Standard issue 12-gauge pump-action shotgun. Highly effective at close range, capable of decapitating standard zombies."
  },
  {
    id: "WPN-003",
    name: "Lightning Hawk",
    type: "Magnum",
    firepower: 9.5,
    capacity: 7,
    description: "High-caliber .50 AE magnum revolver. Extremely rare ammunition. Reserved for boss encounters and heavy B.O.W.s."
  },
  {
    id: "WPN-004",
    name: "Anti-Tank Rocket",
    type: "Heavy",
    firepower: 10.0,
    capacity: 1,
    description: "Shoulder-fired rocket launcher. Guaranteed single-hit elimination for almost all known bio-organic weapons."
  },
  {
    id: "WPN-005",
    name: "Combat Knife",
    type: "Melee",
    firepower: 1.0,
    capacity: 0,
    description: "Standard issue survival knife. Last line of defense. Can be used to counter attacks or finish downed enemies to save ammo."
  }
];
